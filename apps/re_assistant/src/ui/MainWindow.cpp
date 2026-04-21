#include "ui/MainWindow.h"

#include "core/BinaryDocument.h"
#include "services/LoggingService.h"
#include "services/PluginManager.h"
#include "services/SettingsService.h"
#include "ui/DocumentTab.h"
#include "ui/dialogs/SettingsDialog.h"

#include <QAction>
#include <QApplication>
#include <QDockWidget>
#include <QFileDialog>
#include <QFileInfo>
#include <QMenuBar>
#include <QPlainTextEdit>
#include <QStatusBar>
#include <QTabWidget>

namespace rea::ui {

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_settingsService(new services::SettingsService(this))
    , m_pluginManager(new services::PluginManager(this))
    , m_sessionService(new services::SessionService(this)) {
    buildUi();

    connect(&services::LoggingService::instance(), &services::LoggingService::logAppended, this, [this](const QString &line) {
        m_logOutput->appendPlainText(line);
    });

    applyThemeFromSettings();
    connect(m_settingsService, &services::SettingsService::settingsChanged, this, &MainWindow::applyThemeFromSettings);

    m_pluginManager->loadFromDirectory(qApp->applicationDirPath() + "/plugins");

    if (m_settingsService->settings().autosaveSession) {
        for (const auto &path : m_sessionService->restoreOpenFiles()) {
            openFileAtPath(path);
        }
    }
}

MainWindow::~MainWindow() {
    QStringList files;
    for (int i = 0; i < m_tabs->count(); ++i) {
        auto *tab = qobject_cast<DocumentTab *>(m_tabs->widget(i));
        if (tab) {
            files << tab->filePath();
        }
    }
    if (m_settingsService->settings().autosaveSession) {
        m_sessionService->saveOpenFiles(files);
    }
}

void MainWindow::buildUi() {
    setWindowTitle(tr("Reverse Engineering Assistant"));
    resize(1600, 900);

    m_tabs = new QTabWidget(this);
    setCentralWidget(m_tabs);

    auto *fileMenu = menuBar()->addMenu(tr("&File"));
    auto *openAction = fileMenu->addAction(tr("Open Binary..."));
    openAction->setShortcut(QKeySequence::Open);
    connect(openAction, &QAction::triggered, this, &MainWindow::openFile);

    auto *settingsAction = fileMenu->addAction(tr("Settings"));
    settingsAction->setShortcut(QKeySequence(Qt::CTRL | Qt::Key_Comma));
    connect(settingsAction, &QAction::triggered, this, &MainWindow::showSettings);

    fileMenu->addSeparator();
    fileMenu->addAction(tr("Exit"), this, &QWidget::close, QKeySequence::Quit);

    m_logDock = new QDockWidget(tr("Logs / Output"), this);
    m_logOutput = new QPlainTextEdit(m_logDock);
    m_logOutput->setReadOnly(true);
    m_logDock->setWidget(m_logOutput);
    addDockWidget(Qt::BottomDockWidgetArea, m_logDock);

    statusBar()->showMessage(tr("Ready"));
}

void MainWindow::applyDarkTheme() {
    qApp->setStyleSheet(
        "QWidget { background: #1e1e1e; color: #d8d8d8; }"
        "QLineEdit, QTextEdit, QPlainTextEdit, QTableView, QTreeView { background: #252526; color: #e0e0e0; }"
        "QMenuBar::item:selected, QMenu::item:selected, QTabBar::tab:selected { background: #3a3d41; }"
        "QHeaderView::section { background: #333333; color: #d0d0d0; }");
}

void MainWindow::applyLightTheme() {
    qApp->setStyleSheet({});
}

void MainWindow::applyThemeFromSettings() {
    const auto settings = m_settingsService->settings();
    if (settings.theme == QStringLiteral("dark")) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }

    QFont baseFont = qApp->font();
    const int scaledFont = qMax(8, (settings.fontSize * settings.uiScale) / 100);
    baseFont.setPointSize(scaledFont);
    qApp->setFont(baseFont);
}

void MainWindow::openFile() {
    const auto path = QFileDialog::getOpenFileName(this,
                                                    tr("Open Binary"),
                                                    {},
                                                    tr("Binary Files (*.exe *.dll *.bin *.elf);;All Files (*.*)"));
    if (path.isEmpty()) {
        return;
    }
    openFileAtPath(path);
}

void MainWindow::openFileAtPath(const QString &path) {
    QString error;
    auto document = core::BinaryDocument::open(path, &error);
    if (!document) {
        services::LoggingService::instance().error(error);
        return;
    }

    auto *tab = new DocumentTab(document, m_settingsService, this);
    m_tabs->addTab(tab, QFileInfo(path).fileName());
    services::LoggingService::instance().info(QStringLiteral("Opened %1").arg(path));
}

void MainWindow::showSettings() {
    SettingsDialog dialog(m_settingsService, this);
    dialog.exec();
}

} // namespace rea::ui

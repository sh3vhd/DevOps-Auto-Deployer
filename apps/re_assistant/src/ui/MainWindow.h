#pragma once

#include "services/SessionService.h"

#include <QMainWindow>

class QDockWidget;
class QPlainTextEdit;
class QTabWidget;

namespace rea::services {
class PluginManager;
class SettingsService;
}

namespace rea::ui {

class MainWindow final : public QMainWindow {
    Q_OBJECT
public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow() override;

private slots:
    void openFile();
    void showSettings();

private:
    void buildUi();
    void applyDarkTheme();
    void applyLightTheme();
    void applyThemeFromSettings();
    void openFileAtPath(const QString &path);

    QTabWidget *m_tabs = nullptr;
    QDockWidget *m_logDock = nullptr;
    QPlainTextEdit *m_logOutput = nullptr;

    rea::services::SettingsService *m_settingsService = nullptr;
    rea::services::PluginManager *m_pluginManager = nullptr;
    rea::services::SessionService *m_sessionService = nullptr;
};

} // namespace rea::ui

#include "ui/DocumentTab.h"

#include "core/Disassembler.h"
#include "core/HexSearchEngine.h"
#include "core/BinaryAnalyzer.h"
#include "core/StringExtractor.h"
#include "ui/widgets/DisassemblyWidget.h"
#include "ui/widgets/HexViewWidget.h"
#include "ui/widgets/ImportExportWidget.h"
#include "ui/widgets/StringTableWidget.h"

#include <QLineEdit>
#include <QPushButton>
#include <QTabWidget>
#include <QTextEdit>
#include <QTreeWidget>
#include <QHBoxLayout>
#include <QVBoxLayout>

namespace rea::ui {

DocumentTab::DocumentTab(core::BinaryDocument::Ptr document, services::SettingsService *settingsService, QWidget *parent)
    : QWidget(parent)
    , m_document(std::move(document))
    , m_settingsService(settingsService) {
    buildUi();
    populateStructure();
    applySettings();
    connect(m_settingsService, &services::SettingsService::settingsChanged, this, &DocumentTab::applySettings);
}

void DocumentTab::buildUi() {
    auto *layout = new QVBoxLayout(this);
    auto *searchBar = new QHBoxLayout;
    m_searchInput = new QLineEdit(this);
    m_searchInput->setPlaceholderText(tr("Search ASCII text or hex bytes (e.g. 4D5A)..."));
    auto *searchButton = new QPushButton(tr("Search"), this);
    connect(searchButton, &QPushButton::clicked, this, &DocumentTab::runSearch);
    searchBar->addWidget(m_searchInput);
    searchBar->addWidget(searchButton);
    layout->addLayout(searchBar);

    auto *contentLayout = new QHBoxLayout;

    m_structureTree = new QTreeWidget(this);
    m_structureTree->setHeaderLabels({QStringLiteral("Structure"), QStringLiteral("Range")});

    auto *centerTabs = new QTabWidget(this);
    m_hexView = new HexViewWidget(this);
    m_hexView->setDocument(m_document);
    centerTabs->addTab(m_hexView, tr("Hex"));

    m_disassemblyView = new DisassemblyWidget(this);
    m_disassemblyView->setInstructions(core::Disassembler::disassemble(m_document, 0, 2048));
    centerTabs->addTab(m_disassemblyView, tr("Disassembly"));

    m_stringTable = new StringTableWidget(this);
    m_stringTable->setStrings(core::StringExtractor::extract(m_document));
    centerTabs->addTab(m_stringTable, tr("Strings"));

    m_importExportWidget = new ImportExportWidget(this);
    core::BinaryAnalyzer analyzer;
    m_importExportWidget->setImports(analyzer.imports(m_document));
    m_importExportWidget->setExports(analyzer.exports(m_document));
    centerTabs->addTab(m_importExportWidget, tr("Imports / Exports"));

    m_detailsText = new QTextEdit(this);
    m_detailsText->setReadOnly(true);
    m_detailsText->setPlainText(tr("Metadata\nFormat: %1\nArch: %2\nSize: %3 bytes")
                                    .arg(m_document->metadata().format,
                                         m_document->metadata().architecture)
                                    .arg(m_document->metadata().size));

    contentLayout->addWidget(m_structureTree, 1);
    contentLayout->addWidget(centerTabs, 3);
    contentLayout->addWidget(m_detailsText, 1);
    layout->addLayout(contentLayout);
}

void DocumentTab::populateStructure() {
    for (const auto &section : m_document->metadata().sections) {
        auto *item = new QTreeWidgetItem(m_structureTree);
        item->setText(0, section.name);
        item->setText(1, QStringLiteral("0x%1 - 0x%2")
                             .arg(section.offset, 0, 16)
                             .arg(section.offset + section.size, 0, 16));
    }
}

void DocumentTab::runSearch() {
    const auto query = m_searchInput->text().trimmed();
    if (query.isEmpty()) {
        return;
    }

    QList<quint64> offsets;
    bool isHex = false;
    QByteArray hexCandidate = query.toLatin1();
    hexCandidate.remove(' ');
    if (!hexCandidate.isEmpty() && hexCandidate.size() % 2 == 0) {
        const auto decoded = QByteArray::fromHex(hexCandidate);
        if (!decoded.isEmpty()) {
            offsets = core::HexSearchEngine::findHexPattern(m_document, decoded);
            isHex = true;
        }
    }
    if (!isHex) {
        offsets = core::HexSearchEngine::findText(m_document, query, Qt::CaseInsensitive);
    }
    m_hexView->highlightOffsets(offsets);
}

void DocumentTab::applySettings() {
    const auto s = m_settingsService->settings();
    m_hexView->applyDisplaySettings(s.bytesPerRow, s.showAscii);
}

} // namespace rea::ui

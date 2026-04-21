#pragma once

#include "core/BinaryDocument.h"

#include <QWidget>

class QSplitter;
class QLineEdit;
class QTreeWidget;
class QTextEdit;

namespace rea::ui {
class HexViewWidget;
class StringTableWidget;
class DisassemblyWidget;
class ImportExportWidget;
}

namespace rea::services {
class SettingsService;
}

namespace rea::ui {

class DocumentTab final : public QWidget {
    Q_OBJECT
public:
    DocumentTab(core::BinaryDocument::Ptr document, services::SettingsService *settingsService, QWidget *parent = nullptr);

    [[nodiscard]] QString filePath() const { return m_document->metadata().path; }

private:
    void buildUi();
    void populateStructure();
    void runSearch();
    void applySettings();

    core::BinaryDocument::Ptr m_document;
    services::SettingsService *m_settingsService = nullptr;

    QTreeWidget *m_structureTree = nullptr;
    HexViewWidget *m_hexView = nullptr;
    DisassemblyWidget *m_disassemblyView = nullptr;
    StringTableWidget *m_stringTable = nullptr;
    ImportExportWidget *m_importExportWidget = nullptr;
    QTextEdit *m_detailsText = nullptr;
    QLineEdit *m_searchInput = nullptr;
};

} // namespace rea::ui

#include "ui/widgets/ImportExportWidget.h"

namespace rea::ui {

ImportExportWidget::ImportExportWidget(QWidget *parent)
    : QTreeWidget(parent) {
    setHeaderLabels({tr("Type"), tr("Module"), tr("Symbol")});
}

void ImportExportWidget::setImports(const QList<rea::core::ImportSymbol> &imports) {
    auto *root = new QTreeWidgetItem(this, {tr("Imports")});
    for (const auto &entry : imports) {
        new QTreeWidgetItem(root, {tr("Import"), entry.library, entry.name});
    }
    root->setExpanded(true);
}

void ImportExportWidget::setExports(const QStringList &exports) {
    auto *root = new QTreeWidgetItem(this, {tr("Exports")});
    for (const auto &entry : exports) {
        new QTreeWidgetItem(root, {tr("Export"), QStringLiteral("self"), entry});
    }
    root->setExpanded(true);
}

} // namespace rea::ui

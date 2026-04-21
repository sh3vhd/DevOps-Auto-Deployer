#pragma once

#include "core/BinaryAnalyzer.h"

#include <QTreeWidget>

namespace rea::ui {

class ImportExportWidget final : public QTreeWidget {
    Q_OBJECT
public:
    explicit ImportExportWidget(QWidget *parent = nullptr);

    void setImports(const QList<rea::core::ImportSymbol> &imports);
    void setExports(const QStringList &exports);
};

} // namespace rea::ui

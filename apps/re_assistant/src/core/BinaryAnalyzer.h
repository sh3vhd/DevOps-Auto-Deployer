#pragma once

#include "core/BinaryDocument.h"

#include <QObject>

namespace rea::core {

struct ImportSymbol {
    QString library;
    QString name;
};

class BinaryAnalyzer final : public QObject {
    Q_OBJECT
public:
    explicit BinaryAnalyzer(QObject *parent = nullptr);

    [[nodiscard]] QList<ImportSymbol> imports(const BinaryDocument::Ptr &document) const;
    [[nodiscard]] QStringList exports(const BinaryDocument::Ptr &document) const;
};

} // namespace rea::core

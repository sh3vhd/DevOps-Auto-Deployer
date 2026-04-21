#pragma once

#include "core/BinaryDocument.h"

namespace rea::core {

class HexSearchEngine {
public:
    [[nodiscard]] static QList<quint64> findHexPattern(const BinaryDocument::Ptr &doc, const QByteArray &pattern);
    [[nodiscard]] static QList<quint64> findText(const BinaryDocument::Ptr &doc, const QString &text, Qt::CaseSensitivity cs = Qt::CaseInsensitive);
};

} // namespace rea::core

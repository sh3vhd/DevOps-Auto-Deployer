#pragma once

#include "core/BinaryDocument.h"

namespace rea::core {

struct ExtractedString {
    quint64 offset = 0;
    QString value;
    QString encoding;
};

class StringExtractor {
public:
    [[nodiscard]] static QList<ExtractedString> extract(const BinaryDocument::Ptr &doc, int minLength = 4);
};

} // namespace rea::core

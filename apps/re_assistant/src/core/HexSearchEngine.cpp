#include "core/HexSearchEngine.h"

namespace rea::core {

QList<quint64> HexSearchEngine::findHexPattern(const BinaryDocument::Ptr &doc, const QByteArray &pattern) {
    QList<quint64> offsets;
    if (!doc || pattern.isEmpty()) {
        return offsets;
    }

    const auto content = doc->readBytes(0, doc->metadata().size);
    int pos = content.indexOf(pattern);
    while (pos >= 0) {
        offsets.push_back(static_cast<quint64>(pos));
        pos = content.indexOf(pattern, pos + 1);
    }
    return offsets;
}

QList<quint64> HexSearchEngine::findText(const BinaryDocument::Ptr &doc, const QString &text, Qt::CaseSensitivity cs) {
    if (!doc || text.isEmpty()) {
        return {};
    }

    QByteArray haystack = doc->readBytes(0, doc->metadata().size);
    QByteArray needle = text.toUtf8();
    if (cs == Qt::CaseInsensitive) {
        haystack = haystack.toLower();
        needle = needle.toLower();
    }

    QList<quint64> offsets;
    int pos = haystack.indexOf(needle);
    while (pos >= 0) {
        offsets.push_back(static_cast<quint64>(pos));
        pos = haystack.indexOf(needle, pos + 1);
    }
    return offsets;
}

} // namespace rea::core

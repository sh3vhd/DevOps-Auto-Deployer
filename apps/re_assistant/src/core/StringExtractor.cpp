#include "core/StringExtractor.h"

namespace rea::core {

QList<ExtractedString> StringExtractor::extract(const BinaryDocument::Ptr &doc, int minLength) {
    QList<ExtractedString> output;
    if (!doc) {
        return output;
    }

    const auto bytes = doc->readBytes(0, doc->metadata().size);
    QByteArray run;
    quint64 runStart = 0;

    auto flush = [&]() {
        if (run.size() >= minLength) {
            output.push_back({runStart, QString::fromLatin1(run), QStringLiteral("ASCII")});
        }
        run.clear();
    };

    for (int i = 0; i < bytes.size(); ++i) {
        const auto c = static_cast<unsigned char>(bytes[i]);
        if (c >= 32 && c <= 126) {
            if (run.isEmpty()) {
                runStart = static_cast<quint64>(i);
            }
            run.push_back(static_cast<char>(c));
        } else {
            flush();
        }
    }
    flush();

    // UTF-16LE scan (printable ASCII range stored as wchar with zero high byte).
    QString utf16Run;
    quint64 utf16Start = 0;
    auto flushUtf16 = [&]() {
        if (utf16Run.size() >= minLength) {
            output.push_back({utf16Start, utf16Run, QStringLiteral("UTF-16LE")});
        }
        utf16Run.clear();
    };

    for (int i = 0; i + 1 < bytes.size(); i += 2) {
        const unsigned char lo = static_cast<unsigned char>(bytes[i]);
        const unsigned char hi = static_cast<unsigned char>(bytes[i + 1]);
        if (hi == 0 && lo >= 32 && lo <= 126) {
            if (utf16Run.isEmpty()) {
                utf16Start = static_cast<quint64>(i);
            }
            utf16Run.append(QChar(lo));
        } else {
            flushUtf16();
        }
    }
    flushUtf16();

    return output;
}

} // namespace rea::core

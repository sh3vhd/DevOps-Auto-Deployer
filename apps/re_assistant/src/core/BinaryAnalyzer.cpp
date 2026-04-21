#include "core/BinaryAnalyzer.h"

namespace rea::core {

BinaryAnalyzer::BinaryAnalyzer(QObject *parent)
    : QObject(parent) {}

QList<ImportSymbol> BinaryAnalyzer::imports(const BinaryDocument::Ptr &document) const {
    QList<ImportSymbol> symbols;
    if (!document) {
        return symbols;
    }

    const auto bytes = document->readBytes(0, document->metadata().size);
    const QList<QByteArray> knownLibs = {QByteArrayLiteral("kernel32.dll"),
                                         QByteArrayLiteral("user32.dll"),
                                         QByteArrayLiteral("advapi32.dll"),
                                         QByteArrayLiteral("ntdll.dll")};

    for (const auto &lib : knownLibs) {
        if (bytes.contains(lib)) {
            symbols.push_back({QString::fromLatin1(lib), QStringLiteral("<detected in binary>")});
        }
    }

    if (symbols.isEmpty() && document->metadata().format == QStringLiteral("PE")) {
        symbols.push_back({QStringLiteral("<parser>"), QStringLiteral("No imports detected by lightweight scanner")});
    }
    return symbols;
}

QStringList BinaryAnalyzer::exports(const BinaryDocument::Ptr &document) const {
    if (!document) {
        return {};
    }

    if (document->metadata().format == QStringLiteral("PE")) {
        return {QStringLiteral("<Export parsing can be extended via plugins>")};
    }

    return {};
}

} // namespace rea::core

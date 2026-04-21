#include "core/BinaryDocument.h"

#include <QDataStream>
#include <QFileInfo>
#include <QMutexLocker>

namespace rea::core {

BinaryDocument::BinaryDocument(const QString &path)
    : m_file(path) {
    m_metadata.path = path;
}

BinaryDocument::Ptr BinaryDocument::open(const QString &path, QString *errorMessage) {
    auto doc = Ptr(new BinaryDocument(path));
    if (!doc->initialize(errorMessage)) {
        return {};
    }
    return doc;
}

bool BinaryDocument::initialize(QString *errorMessage) {
    if (!m_file.open(QIODevice::ReadOnly)) {
        if (errorMessage) {
            *errorMessage = QStringLiteral("Unable to open file: %1").arg(m_file.errorString());
        }
        return false;
    }

    m_metadata.size = static_cast<quint64>(m_file.size());
    const auto sig = m_file.peek(4);
    if (sig.startsWith("MZ")) {
        m_metadata.format = QStringLiteral("PE");
        parsePeMetadata();
    } else if (sig == QByteArray::fromHex("7f454c46")) {
        m_metadata.format = QStringLiteral("ELF");
        parseElfMetadata();
    } else {
        m_metadata.format = QStringLiteral("Unknown");
        m_metadata.architecture = QStringLiteral("Unknown");
    }
    return true;
}

bool BinaryDocument::parsePeMetadata() {
    m_file.seek(0x3C);
    QDataStream stream(&m_file);
    stream.setByteOrder(QDataStream::LittleEndian);

    quint32 peOffset = 0;
    stream >> peOffset;
    m_file.seek(peOffset + 4);

    quint16 machine = 0;
    quint16 sectionCount = 0;
    stream >> machine >> sectionCount;

    if (machine == 0x8664) {
        m_metadata.architecture = QStringLiteral("x64");
    } else if (machine == 0x14c) {
        m_metadata.architecture = QStringLiteral("x86");
    } else {
        m_metadata.architecture = QStringLiteral("Unknown");
    }

    m_file.seek(peOffset + 20);
    quint16 optionalHeaderSize = 0;
    stream >> optionalHeaderSize;
    const quint64 sectionTableOffset = peOffset + 24 + optionalHeaderSize;

    m_file.seek(sectionTableOffset);
    for (quint16 i = 0; i < sectionCount; ++i) {
        QByteArray rawName(8, '\0');
        stream.readRawData(rawName.data(), 8);

        quint32 virtualSize = 0;
        quint32 virtualAddress = 0;
        quint32 rawSize = 0;
        quint32 rawOffset = 0;
        stream >> virtualSize >> virtualAddress >> rawSize >> rawOffset;
        m_file.seek(m_file.pos() + 16);

        SectionInfo section;
        section.name = QString::fromLatin1(rawName).trimmed();
        section.offset = rawOffset;
        section.size = rawSize;
        m_metadata.sections.push_back(section);
    }
    return true;
}

bool BinaryDocument::parseElfMetadata() {
    const QByteArray ident = m_file.peek(0x20);
    if (ident.size() < 0x12) {
        return false;
    }

    m_metadata.architecture = ident[4] == 2 ? QStringLiteral("x64") : QStringLiteral("x86");
    SectionInfo text;
    text.name = QStringLiteral("(ELF sections lazily loaded)");
    m_metadata.sections.push_back(text);
    return true;
}

QByteArray BinaryDocument::readBytes(quint64 offset, quint64 length) const {
    if (!m_file.isOpen()) {
        return {};
    }

    // Fast path for chunk-aligned reads from cache.
    if (length <= kChunkSize && offset % kChunkSize == 0) {
        QMutexLocker lock(&m_cacheMutex);
        if (m_chunkCache.contains(offset)) {
            return m_chunkCache.value(offset).left(static_cast<int>(length));
        }
    }

    if (!m_file.seek(static_cast<qint64>(offset))) {
        return {};
    }

    const auto payload = m_file.read(static_cast<qint64>(length));
    if (length <= kChunkSize && offset % kChunkSize == 0) {
        QMutexLocker lock(&m_cacheMutex);
        if (m_chunkCache.size() > 1024) {
            m_chunkCache.erase(m_chunkCache.begin());
        }
        m_chunkCache.insert(offset, payload);
    }
    return payload;
}

} // namespace rea::core

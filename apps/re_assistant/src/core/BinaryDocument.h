#pragma once

#include <QFile>
#include <QHash>
#include <QList>
#include <QMutex>
#include <QSharedPointer>
#include <QString>
#include <QVector>

namespace rea::core {

struct SectionInfo {
    QString name;
    quint64 offset = 0;
    quint64 size = 0;
};

struct FileMetadata {
    QString path;
    QString format;
    QString architecture;
    quint64 size = 0;
    QList<SectionInfo> sections;
};

class BinaryDocument {
public:
    using Ptr = QSharedPointer<BinaryDocument>;

    static Ptr open(const QString &path, QString *errorMessage = nullptr);

    [[nodiscard]] const FileMetadata &metadata() const { return m_metadata; }
    [[nodiscard]] QByteArray readBytes(quint64 offset, quint64 length) const;
    [[nodiscard]] bool isOpen() const { return m_file.isOpen(); }

private:
    explicit BinaryDocument(const QString &path);
    bool initialize(QString *errorMessage);

    bool parsePeMetadata();
    bool parseElfMetadata();

    mutable QFile m_file;
    mutable QMutex m_cacheMutex;
    mutable QHash<quint64, QByteArray> m_chunkCache;
    static constexpr quint64 kChunkSize = 4096;
    FileMetadata m_metadata;
};

} // namespace rea::core

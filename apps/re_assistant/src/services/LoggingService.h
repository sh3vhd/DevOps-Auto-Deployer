#pragma once

#include <QObject>

class QFile;
class QTextStream;

namespace rea::services {

class LoggingService final : public QObject {
    Q_OBJECT
public:
    static LoggingService &instance();

    void info(const QString &message);
    void warning(const QString &message);
    void error(const QString &message);

signals:
    void logAppended(const QString &line);

private:
    LoggingService();
    void append(const QString &level, const QString &message);

    QFile *m_logFile = nullptr;
    QTextStream *m_stream = nullptr;
};

} // namespace rea::services

#include "services/LoggingService.h"

#include <QDateTime>
#include <QDir>
#include <QFile>
#include <QStandardPaths>
#include <QTextStream>

namespace rea::services {

LoggingService::LoggingService() {
    const auto logsDir = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation) + "/logs";
    QDir().mkpath(logsDir);

    m_logFile = new QFile(logsDir + "/application.log", this);
    m_logFile->open(QIODevice::WriteOnly | QIODevice::Append | QIODevice::Text);
    m_stream = new QTextStream(m_logFile);
}

LoggingService &LoggingService::instance() {
    static LoggingService service;
    return service;
}

void LoggingService::info(const QString &message) {
    append(QStringLiteral("INFO"), message);
}

void LoggingService::warning(const QString &message) {
    append(QStringLiteral("WARN"), message);
}

void LoggingService::error(const QString &message) {
    append(QStringLiteral("ERROR"), message);
}

void LoggingService::append(const QString &level, const QString &message) {
    const auto line = QStringLiteral("[%1] [%2] %3")
                          .arg(QDateTime::currentDateTime().toString(Qt::ISODate), level, message);
    if (m_stream) {
        *m_stream << line << Qt::endl;
    }
    emit logAppended(line);
}

} // namespace rea::services

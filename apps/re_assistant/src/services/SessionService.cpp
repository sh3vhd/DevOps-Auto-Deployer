#include "services/SessionService.h"

#include <QSettings>

namespace rea::services {

SessionService::SessionService(QObject *parent)
    : QObject(parent) {}

void SessionService::saveOpenFiles(const QStringList &paths) {
    QSettings settings(QStringLiteral("ReverseEngineeringAssistant"), QStringLiteral("REA"));
    settings.setValue("session/openFiles", paths);
}

QStringList SessionService::restoreOpenFiles() const {
    QSettings settings(QStringLiteral("ReverseEngineeringAssistant"), QStringLiteral("REA"));
    return settings.value("session/openFiles").toStringList();
}

} // namespace rea::services

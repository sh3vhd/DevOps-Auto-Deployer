#include "services/PluginManager.h"

#include "plugins/interfaces/IReaPlugin.h"
#include "services/LoggingService.h"

#include <QDir>
#include <QPluginLoader>

namespace rea::services {

PluginManager::PluginManager(QObject *parent)
    : QObject(parent) {}

void PluginManager::loadFromDirectory(const QString &directoryPath) {
    const QDir dir(directoryPath);
    for (const auto &entry : dir.entryList(QDir::Files)) {
        QPluginLoader loader(dir.filePath(entry));
        QObject *instance = loader.instance();
        if (!instance) {
            continue;
        }

        auto *plugin = qobject_cast<rea::plugins::IReaPlugin *>(instance);
        if (!plugin) {
            continue;
        }

        plugin->initialize();
        m_loaded.push_back(plugin->name());
        LoggingService::instance().info(QStringLiteral("Plugin loaded: %1").arg(plugin->name()));
        emit pluginLoaded(plugin->name());
    }
}

} // namespace rea::services

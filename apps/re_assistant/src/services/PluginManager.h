#pragma once

#include <QObject>

namespace rea::services {

class PluginManager final : public QObject {
    Q_OBJECT
public:
    explicit PluginManager(QObject *parent = nullptr);

    void loadFromDirectory(const QString &directoryPath);
    [[nodiscard]] QStringList loadedPlugins() const { return m_loaded; }

signals:
    void pluginLoaded(const QString &name);

private:
    QStringList m_loaded;
};

} // namespace rea::services

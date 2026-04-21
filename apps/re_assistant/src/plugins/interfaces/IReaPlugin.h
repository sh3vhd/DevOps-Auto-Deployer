#pragma once

#include <QString>

namespace rea::plugins {

class IReaPlugin {
public:
    virtual ~IReaPlugin() = default;
    virtual QString id() const = 0;
    virtual QString name() const = 0;
    virtual void initialize() = 0;
};

} // namespace rea::plugins

#define IReaPlugin_iid "com.rea.plugins.IReaPlugin"
Q_DECLARE_INTERFACE(rea::plugins::IReaPlugin, IReaPlugin_iid)

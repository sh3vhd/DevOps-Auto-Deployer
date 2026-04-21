#pragma once

#include <QObject>

namespace rea::services {

class SessionService final : public QObject {
    Q_OBJECT
public:
    explicit SessionService(QObject *parent = nullptr);

    void saveOpenFiles(const QStringList &paths);
    [[nodiscard]] QStringList restoreOpenFiles() const;
};

} // namespace rea::services

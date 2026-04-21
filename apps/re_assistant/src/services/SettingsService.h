#pragma once

#include <QColor>
#include <QObject>

class QSettings;

namespace rea::services {

struct AppSettings {
    QString theme = QStringLiteral("dark");
    QString monoFont = QStringLiteral("Consolas");
    int fontSize = 10;
    int uiScale = 100;
    int bytesPerRow = 16;
    bool showAscii = true;
    QColor selectionColor = QColor("#66aaff");
    QString disasmSyntax = QStringLiteral("intel");
    bool autosaveSession = true;
    QString language = QStringLiteral("en_US");
};

class SettingsService final : public QObject {
    Q_OBJECT
public:
    explicit SettingsService(QObject *parent = nullptr);

    [[nodiscard]] AppSettings settings() const;
    void update(const AppSettings &settings);

signals:
    void settingsChanged();

private:
    QSettings *m_settings = nullptr;
};

} // namespace rea::services

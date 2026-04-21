#include "services/SettingsService.h"

#include <QSettings>

namespace rea::services {

SettingsService::SettingsService(QObject *parent)
    : QObject(parent)
    , m_settings(new QSettings(QStringLiteral("ReverseEngineeringAssistant"), QStringLiteral("REA"), this)) {}

AppSettings SettingsService::settings() const {
    AppSettings s;
    s.theme = m_settings->value("appearance/theme", s.theme).toString();
    s.monoFont = m_settings->value("appearance/monoFont", s.monoFont).toString();
    s.fontSize = m_settings->value("appearance/fontSize", s.fontSize).toInt();
    s.uiScale = m_settings->value("appearance/uiScale", s.uiScale).toInt();
    s.bytesPerRow = m_settings->value("hex/bytesPerRow", s.bytesPerRow).toInt();
    s.showAscii = m_settings->value("hex/showAscii", s.showAscii).toBool();
    s.selectionColor = m_settings->value("hex/selectionColor", s.selectionColor).value<QColor>();
    s.disasmSyntax = m_settings->value("disasm/syntax", s.disasmSyntax).toString();
    s.autosaveSession = m_settings->value("general/autosave", s.autosaveSession).toBool();
    s.language = m_settings->value("general/language", s.language).toString();
    return s;
}

void SettingsService::update(const AppSettings &settings) {
    m_settings->setValue("appearance/theme", settings.theme);
    m_settings->setValue("appearance/monoFont", settings.monoFont);
    m_settings->setValue("appearance/fontSize", settings.fontSize);
    m_settings->setValue("appearance/uiScale", settings.uiScale);
    m_settings->setValue("hex/bytesPerRow", settings.bytesPerRow);
    m_settings->setValue("hex/showAscii", settings.showAscii);
    m_settings->setValue("hex/selectionColor", settings.selectionColor);
    m_settings->setValue("disasm/syntax", settings.disasmSyntax);
    m_settings->setValue("general/autosave", settings.autosaveSession);
    m_settings->setValue("general/language", settings.language);
    emit settingsChanged();
}

} // namespace rea::services

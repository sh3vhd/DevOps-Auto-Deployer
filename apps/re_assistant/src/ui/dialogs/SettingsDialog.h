#pragma once

#include "services/SettingsService.h"

#include <QDialog>

class QCheckBox;
class QComboBox;
class QSpinBox;
class QLineEdit;

namespace rea::ui {

class SettingsDialog final : public QDialog {
    Q_OBJECT
public:
    explicit SettingsDialog(rea::services::SettingsService *settingsService, QWidget *parent = nullptr);

private slots:
    void apply();

private:
    rea::services::SettingsService *m_settingsService = nullptr;
    QComboBox *m_themeCombo = nullptr;
    QSpinBox *m_fontSizeSpin = nullptr;
    QSpinBox *m_uiScaleSpin = nullptr;
    QSpinBox *m_bytesPerRowSpin = nullptr;
    QCheckBox *m_asciiCheckbox = nullptr;
    QComboBox *m_disasmSyntaxCombo = nullptr;
    QLineEdit *m_languageEdit = nullptr;
    QCheckBox *m_autosaveCheckbox = nullptr;
};

} // namespace rea::ui

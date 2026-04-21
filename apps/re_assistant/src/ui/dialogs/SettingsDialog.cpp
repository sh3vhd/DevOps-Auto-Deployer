#include "ui/dialogs/SettingsDialog.h"

#include <QCheckBox>
#include <QComboBox>
#include <QDialogButtonBox>
#include <QFormLayout>
#include <QLineEdit>
#include <QPushButton>
#include <QSpinBox>
#include <QVBoxLayout>

namespace rea::ui {

SettingsDialog::SettingsDialog(rea::services::SettingsService *settingsService, QWidget *parent)
    : QDialog(parent)
    , m_settingsService(settingsService) {
    setWindowTitle(tr("Settings"));

    const auto current = m_settingsService->settings();

    m_themeCombo = new QComboBox(this);
    m_themeCombo->addItems({QStringLiteral("dark"), QStringLiteral("light"), QStringLiteral("custom")});
    m_themeCombo->setCurrentText(current.theme);

    m_fontSizeSpin = new QSpinBox(this);
    m_fontSizeSpin->setRange(8, 28);
    m_fontSizeSpin->setValue(current.fontSize);

    m_uiScaleSpin = new QSpinBox(this);
    m_uiScaleSpin->setRange(75, 300);
    m_uiScaleSpin->setValue(current.uiScale);

    m_bytesPerRowSpin = new QSpinBox(this);
    m_bytesPerRowSpin->setRange(8, 64);
    m_bytesPerRowSpin->setValue(current.bytesPerRow);

    m_asciiCheckbox = new QCheckBox(tr("Show ASCII column"), this);
    m_asciiCheckbox->setChecked(current.showAscii);

    m_disasmSyntaxCombo = new QComboBox(this);
    m_disasmSyntaxCombo->addItems({QStringLiteral("intel"), QStringLiteral("att")});
    m_disasmSyntaxCombo->setCurrentText(current.disasmSyntax);

    m_languageEdit = new QLineEdit(current.language, this);

    m_autosaveCheckbox = new QCheckBox(tr("Auto-save last session"), this);
    m_autosaveCheckbox->setChecked(current.autosaveSession);

    auto *form = new QFormLayout;
    form->addRow(tr("Theme"), m_themeCombo);
    form->addRow(tr("Font size"), m_fontSizeSpin);
    form->addRow(tr("UI scale (%)"), m_uiScaleSpin);
    form->addRow(tr("Bytes per row"), m_bytesPerRowSpin);
    form->addRow({}, m_asciiCheckbox);
    form->addRow(tr("Disassembly syntax"), m_disasmSyntaxCombo);
    form->addRow(tr("Language"), m_languageEdit);
    form->addRow({}, m_autosaveCheckbox);

    auto *buttonBox = new QDialogButtonBox(QDialogButtonBox::Apply | QDialogButtonBox::Close, this);
    connect(buttonBox->button(QDialogButtonBox::Apply), &QPushButton::clicked, this, &SettingsDialog::apply);
    connect(buttonBox, &QDialogButtonBox::rejected, this, &QDialog::reject);

    auto *layout = new QVBoxLayout(this);
    layout->addLayout(form);
    layout->addWidget(buttonBox);
}

void SettingsDialog::apply() {
    auto s = m_settingsService->settings();
    s.theme = m_themeCombo->currentText();
    s.fontSize = m_fontSizeSpin->value();
    s.uiScale = m_uiScaleSpin->value();
    s.bytesPerRow = m_bytesPerRowSpin->value();
    s.showAscii = m_asciiCheckbox->isChecked();
    s.disasmSyntax = m_disasmSyntaxCombo->currentText();
    s.language = m_languageEdit->text().trimmed();
    s.autosaveSession = m_autosaveCheckbox->isChecked();
    m_settingsService->update(s);
    accept();
}

} // namespace rea::ui

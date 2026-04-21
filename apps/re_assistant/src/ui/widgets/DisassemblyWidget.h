#pragma once

#include "core/Disassembler.h"

#include <QTableWidget>

namespace rea::ui {

class DisassemblyWidget final : public QTableWidget {
    Q_OBJECT
public:
    explicit DisassemblyWidget(QWidget *parent = nullptr);

    void setInstructions(const QList<rea::core::DisassembledInstruction> &instructions);
};

} // namespace rea::ui

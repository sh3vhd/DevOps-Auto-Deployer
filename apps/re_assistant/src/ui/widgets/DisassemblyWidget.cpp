#include "ui/widgets/DisassemblyWidget.h"

namespace rea::ui {

DisassemblyWidget::DisassemblyWidget(QWidget *parent)
    : QTableWidget(parent) {
    setColumnCount(3);
    setHorizontalHeaderLabels({tr("Address"), tr("Opcode"), tr("Instruction")});
}

void DisassemblyWidget::setInstructions(const QList<rea::core::DisassembledInstruction> &instructions) {
    setRowCount(instructions.size());
    for (int i = 0; i < instructions.size(); ++i) {
        const auto &ins = instructions[i];
        setItem(i, 0, new QTableWidgetItem(QStringLiteral("0x%1").arg(ins.address, 0, 16)));
        setItem(i, 1, new QTableWidgetItem(QString::fromLatin1(ins.opcode)));
        setItem(i, 2, new QTableWidgetItem(ins.text));
    }
}

} // namespace rea::ui

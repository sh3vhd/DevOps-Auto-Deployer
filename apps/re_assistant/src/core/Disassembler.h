#pragma once

#include "core/BinaryDocument.h"

namespace rea::core {

struct DisassembledInstruction {
    quint64 address = 0;
    QByteArray opcode;
    QString text;
};

class Disassembler {
public:
    [[nodiscard]] static QList<DisassembledInstruction> disassemble(const BinaryDocument::Ptr &doc, quint64 offset, quint64 maxBytes);
};

} // namespace rea::core

#include "core/Disassembler.h"

#ifdef REA_HAVE_CAPSTONE
#include <capstone/capstone.h>
#endif

namespace rea::core {

QList<DisassembledInstruction> Disassembler::disassemble(const BinaryDocument::Ptr &doc, quint64 offset, quint64 maxBytes) {
    QList<DisassembledInstruction> result;
    if (!doc) {
        return result;
    }

    const auto bytes = doc->readBytes(offset, maxBytes);
#ifdef REA_HAVE_CAPSTONE
    csh handle;
    cs_mode mode = doc->metadata().architecture == QStringLiteral("x64") ? CS_MODE_64 : CS_MODE_32;
    if (cs_open(CS_ARCH_X86, mode, &handle) == CS_ERR_OK) {
        cs_insn *insn = nullptr;
        const size_t count = cs_disasm(handle,
                                       reinterpret_cast<const uint8_t *>(bytes.constData()),
                                       bytes.size(),
                                       offset,
                                       0,
                                       &insn);
        for (size_t i = 0; i < count; ++i) {
            result.push_back({insn[i].address,
                              QByteArray(reinterpret_cast<const char *>(insn[i].bytes), static_cast<int>(insn[i].size)).toHex(' '),
                              QStringLiteral("%1 %2").arg(insn[i].mnemonic, insn[i].op_str)});
        }
        cs_free(insn, count);
        cs_close(&handle);
    }
#else
    for (int i = 0; i < bytes.size(); ++i) {
        const auto byte = static_cast<unsigned char>(bytes[i]);
        result.push_back({offset + static_cast<quint64>(i), QByteArray(1, static_cast<char>(byte)).toHex(), QStringLiteral("db 0x%1").arg(byte, 2, 16, QLatin1Char('0'))});
    }
#endif

    return result;
}

} // namespace rea::core

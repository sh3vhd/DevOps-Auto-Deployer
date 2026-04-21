# Reverse Engineering Assistant (Qt 6 / C++17)

A modular, production-oriented desktop application for reverse engineering workflows.

## Highlights

- Professional multi-panel desktop UI (dockable logs, tabbed document views).
- File loader for PE/ELF with metadata and section overview.
- High-performance hex table viewer (address + hex + ASCII).
- String extraction (ASCII) and searchable data foundations.
- Basic disassembly pipeline with optional Capstone integration.
- Import/export viewer foundations (extendable and plugin-ready).
- Full persistent settings system via `QSettings` plus example JSON config.
- Pluggable architecture with runtime dynamic plugin loading.

## Build (Windows-focused, portable)

### Dependencies

- CMake 3.21+
- Qt 6.11+ (`Core`, `Gui`, `Widgets`, `Concurrent`)
- Optional: Capstone disassembly engine (`capstone` pkg-config package)

### Commands

```bash
cd apps/re_assistant
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
```

Executable output is `ReverseEngineeringAssistant`.

## Folder structure

- `src/core`: binary analysis and processing logic.
- `src/services`: settings, logging, plugin/session management.
- `src/ui`: windows, dialogs, and reusable widgets.
- `src/plugins/interfaces`: plugin contracts.
- `config/example_settings.json`: sample persisted configuration.
- `docs/ARCHITECTURE.md`: architecture rationale.

## Future-ready extension points

- Add parsers per format in `BinaryAnalyzer` and `BinaryDocument`.
- Add worker-thread orchestration for heavy extraction/search tasks.
- Add custom plugin modules implementing `IReaPlugin`.

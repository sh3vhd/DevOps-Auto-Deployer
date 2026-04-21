# Reverse Engineering Assistant Architecture

## Layers

- **Core (`src/core`)**: Binary parsing, search, string extraction, and disassembly services.
- **Services (`src/services`)**: Persistent settings, logging, plugin loading, and session restore.
- **UI (`src/ui`)**: Desktop shell, dockable panels, tabbed binary documents, and settings dialog.

## Extensibility

- Plugin interface is defined in `src/plugins/interfaces/IReaPlugin.h`.
- Plugins are loaded from `<appDir>/plugins` through Qt's `QPluginLoader`.
- Core services are decoupled from UI widgets through explicit service boundaries.

## Performance strategy

- Hex data is shown via `QAbstractTableModel` and row-based lazy reads.
- Long-running work (extraction/disassembly/search) is designed to move into `QtConcurrent` workers.
- Binary document APIs expose offset-based reads to avoid loading unnecessary sections.

## Error handling

- File loading returns error strings instead of throwing UI-level exceptions.
- Logging service emits info/warn/error records and writes to a persistent log file.

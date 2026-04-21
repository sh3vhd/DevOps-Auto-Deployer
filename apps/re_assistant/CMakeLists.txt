cmake_minimum_required(VERSION 3.21)
project(ReverseEngineeringAssistant VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

option(REA_ENABLE_CAPSTONE "Enable Capstone disassembly engine" ON)

find_package(Qt6 6.11 REQUIRED COMPONENTS Core Gui Widgets Concurrent)

if (REA_ENABLE_CAPSTONE)
    find_package(PkgConfig QUIET)
    if (PkgConfig_FOUND)
        pkg_check_modules(CAPSTONE QUIET capstone)
    endif()
endif()

add_library(rea_core
    src/core/BinaryDocument.cpp
    src/core/BinaryAnalyzer.cpp
    src/core/HexSearchEngine.cpp
    src/core/StringExtractor.cpp
    src/core/Disassembler.cpp
)

target_include_directories(rea_core PUBLIC src)

target_link_libraries(rea_core PUBLIC Qt6::Core)

if (CAPSTONE_FOUND)
    target_compile_definitions(rea_core PUBLIC REA_HAVE_CAPSTONE)
    target_include_directories(rea_core PRIVATE ${CAPSTONE_INCLUDE_DIRS})
    target_link_libraries(rea_core PRIVATE ${CAPSTONE_LIBRARIES})
endif()

add_library(rea_services
    src/services/SettingsService.cpp
    src/services/LoggingService.cpp
    src/services/PluginManager.cpp
    src/services/SessionService.cpp
)

target_include_directories(rea_services PUBLIC src)

target_link_libraries(rea_services PUBLIC Qt6::Core Qt6::Widgets rea_core)

add_executable(ReverseEngineeringAssistant
    src/main.cpp
    src/ui/MainWindow.cpp
    src/ui/DocumentTab.cpp
    src/ui/widgets/HexViewWidget.cpp
    src/ui/widgets/StringTableWidget.cpp
    src/ui/widgets/DisassemblyWidget.cpp
    src/ui/widgets/ImportExportWidget.cpp
    src/ui/dialogs/SettingsDialog.cpp
    resources/resources.qrc
)

target_include_directories(ReverseEngineeringAssistant PRIVATE src)

target_link_libraries(ReverseEngineeringAssistant PRIVATE
    Qt6::Core Qt6::Gui Qt6::Widgets Qt6::Concurrent
    rea_core rea_services
)

if(WIN32)
    set_target_properties(ReverseEngineeringAssistant PROPERTIES WIN32_EXECUTABLE TRUE)
endif()

install(TARGETS ReverseEngineeringAssistant RUNTIME DESTINATION bin)

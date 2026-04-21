#include "ui/MainWindow.h"

#include <QApplication>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    app.setOrganizationName(QStringLiteral("ReverseEngineeringAssistant"));
    app.setApplicationName(QStringLiteral("REA"));

    rea::ui::MainWindow window;
    window.show();

    return app.exec();
}

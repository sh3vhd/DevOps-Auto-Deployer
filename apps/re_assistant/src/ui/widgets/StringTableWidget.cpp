#include "ui/widgets/StringTableWidget.h"

namespace rea::ui {

StringTableWidget::StringTableWidget(QWidget *parent)
    : QTableWidget(parent) {
    setColumnCount(3);
    setHorizontalHeaderLabels({tr("Offset"), tr("Encoding"), tr("Value")});
}

void StringTableWidget::setStrings(const QList<rea::core::ExtractedString> &strings) {
    setRowCount(strings.size());
    for (int i = 0; i < strings.size(); ++i) {
        const auto &s = strings[i];
        setItem(i, 0, new QTableWidgetItem(QStringLiteral("0x%1").arg(s.offset, 0, 16)));
        setItem(i, 1, new QTableWidgetItem(s.encoding));
        setItem(i, 2, new QTableWidgetItem(s.value));
    }
}

} // namespace rea::ui

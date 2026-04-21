#pragma once

#include "core/StringExtractor.h"

#include <QTableWidget>

namespace rea::ui {

class StringTableWidget final : public QTableWidget {
    Q_OBJECT
public:
    explicit StringTableWidget(QWidget *parent = nullptr);

    void setStrings(const QList<rea::core::ExtractedString> &strings);
};

} // namespace rea::ui

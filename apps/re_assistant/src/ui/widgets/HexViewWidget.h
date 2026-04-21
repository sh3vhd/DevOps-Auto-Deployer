#pragma once

#include "core/BinaryDocument.h"

#include <QAbstractTableModel>
#include <QSet>
#include <QTableView>

namespace rea::ui {

class HexTableModel final : public QAbstractTableModel {
    Q_OBJECT
public:
    explicit HexTableModel(QObject *parent = nullptr);

    void setDocument(const rea::core::BinaryDocument::Ptr &document);
    void setBytesPerRow(int bytesPerRow);
    void setShowAscii(bool enabled);
    void setHighlights(const QSet<quint64> &offsets);

    int rowCount(const QModelIndex &parent) const override;
    int columnCount(const QModelIndex &parent) const override;
    QVariant data(const QModelIndex &index, int role) const override;
    QVariant headerData(int section, Qt::Orientation orientation, int role) const override;

private:
    rea::core::BinaryDocument::Ptr m_document;
    int m_bytesPerRow = 16;
    bool m_showAscii = true;
    QSet<quint64> m_highlights;
};

class HexViewWidget final : public QTableView {
    Q_OBJECT
public:
    explicit HexViewWidget(QWidget *parent = nullptr);
    void setDocument(const rea::core::BinaryDocument::Ptr &document);
    void applyDisplaySettings(int bytesPerRow, bool showAscii);
    void highlightOffsets(const QList<quint64> &offsets);

private:
    HexTableModel *m_model = nullptr;
};

} // namespace rea::ui

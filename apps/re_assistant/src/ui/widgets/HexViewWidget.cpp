#include "ui/widgets/HexViewWidget.h"

#include <QColor>
#include <QHeaderView>

namespace rea::ui {

HexTableModel::HexTableModel(QObject *parent)
    : QAbstractTableModel(parent) {}

void HexTableModel::setDocument(const rea::core::BinaryDocument::Ptr &document) {
    beginResetModel();
    m_document = document;
    endResetModel();
}

void HexTableModel::setBytesPerRow(int bytesPerRow) {
    beginResetModel();
    m_bytesPerRow = qBound(8, bytesPerRow, 64);
    endResetModel();
}

void HexTableModel::setShowAscii(bool enabled) {
    beginResetModel();
    m_showAscii = enabled;
    endResetModel();
}

void HexTableModel::setHighlights(const QSet<quint64> &offsets) {
    m_highlights = offsets;
    const int rows = rowCount({});
    const int cols = columnCount({});
    if (rows > 0 && cols > 0) {
        emit dataChanged(index(0, 0), index(rows - 1, cols - 1), {Qt::BackgroundRole});
    }
}

int HexTableModel::rowCount(const QModelIndex &parent) const {
    if (parent.isValid() || !m_document) {
        return 0;
    }
    return static_cast<int>((m_document->metadata().size + m_bytesPerRow - 1) / m_bytesPerRow);
}

int HexTableModel::columnCount(const QModelIndex &parent) const {
    if (parent.isValid()) {
        return 0;
    }
    return m_showAscii ? m_bytesPerRow + 2 : m_bytesPerRow + 1;
}

QVariant HexTableModel::data(const QModelIndex &index, int role) const {
    if (!index.isValid() || !m_document) {
        return {};
    }

    const auto rowOffset = static_cast<quint64>(index.row()) * m_bytesPerRow;
    if (role == Qt::BackgroundRole && index.column() > 0 && index.column() <= m_bytesPerRow) {
        const auto byteOffset = rowOffset + static_cast<quint64>(index.column() - 1);
        if (m_highlights.contains(byteOffset)) {
            return QColor(255, 200, 0, 120);
        }
    }

    if (role != Qt::DisplayRole) {
        return {};
    }

    if (index.column() == 0) {
        return QStringLiteral("%1").arg(rowOffset, 8, 16, QLatin1Char('0'));
    }

    const auto row = m_document->readBytes(rowOffset, m_bytesPerRow);
    if (m_showAscii && index.column() == m_bytesPerRow + 1) {
        QByteArray ascii;
        ascii.reserve(row.size());
        for (char c : row) {
            ascii.push_back((c >= 32 && c <= 126) ? c : '.');
        }
        return QString::fromLatin1(ascii);
    }

    const int byteIndex = index.column() - 1;
    if (byteIndex < row.size()) {
        return QStringLiteral("%1").arg(static_cast<unsigned char>(row[byteIndex]), 2, 16, QLatin1Char('0'));
    }
    return {};
}

QVariant HexTableModel::headerData(int section, Qt::Orientation orientation, int role) const {
    if (role != Qt::DisplayRole || orientation != Qt::Horizontal) {
        return QAbstractTableModel::headerData(section, orientation, role);
    }
    if (section == 0) {
        return QStringLiteral("Address");
    }
    if (m_showAscii && section == m_bytesPerRow + 1) {
        return QStringLiteral("ASCII");
    }
    return QStringLiteral("%1").arg(section - 1, 2, 16, QLatin1Char('0'));
}

HexViewWidget::HexViewWidget(QWidget *parent)
    : QTableView(parent)
    , m_model(new HexTableModel(this)) {
    setModel(m_model);
    horizontalHeader()->setStretchLastSection(true);
    setSelectionBehavior(QAbstractItemView::SelectRows);
}

void HexViewWidget::setDocument(const rea::core::BinaryDocument::Ptr &document) {
    m_model->setDocument(document);
}

void HexViewWidget::applyDisplaySettings(int bytesPerRow, bool showAscii) {
    m_model->setBytesPerRow(bytesPerRow);
    m_model->setShowAscii(showAscii);
}

void HexViewWidget::highlightOffsets(const QList<quint64> &offsets) {
    m_model->setHighlights(QSet<quint64>(offsets.begin(), offsets.end()));
}

} // namespace rea::ui

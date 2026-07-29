import React, { useState } from 'react';
import { LuSlidersHorizontal, LuEye, LuEyeOff } from 'react-icons/lu';
import { Skeleton } from '../Skeleton/Skeleton';
import { EmptyState } from '../EmptyState/EmptyState';
import { useUserPreferencesStore } from '@/store/useUserPreferencesStore';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = "Ma'lumotlar topilmadi",
  emptyDescription = "Hozircha ko'rsatish uchun yozuvlar mavjud emas.",
  onRowClick,
  tableKey = null,
}) => {
  const { tableColumns, setTableColumns } = useUserPreferencesStore();
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  const hiddenColumns = tableKey ? tableColumns[tableKey] || [] : [];

  const toggleColumn = (headerName) => {
    if (!tableKey) return;
    const isHidden = hiddenColumns.includes(headerName);
    const updated = isHidden
      ? hiddenColumns.filter((h) => h !== headerName)
      : [...hiddenColumns, headerName];
    setTableColumns(tableKey, updated);
  };

  const visibleColumns = columns.filter((col) => !hiddenColumns.includes(col.header));

  if (isLoading) {
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    <Skeleton height="16px" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="smart-table-container">
      {/* Smart Table Header Toolbar (Column Selector) */}
      {tableKey && (
        <div className="d-flex align-items-center justify-content-end mb-2 position-relative">
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fs-8 py-1 px-2"
              type="button"
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              title="Ustunlar ko'rinishini moslashtirish"
            >
              <LuSlidersHorizontal className="fs-8" />
              <span>⚙️ Ustunlar ({visibleColumns.length}/{columns.length})</span>
            </button>

            {isColumnDropdownOpen && (
              <div
                className="dropdown-menu show dropdown-menu-end shadow-sm border-custom p-2 fs-7 position-absolute"
                style={{ minWidth: '220px', zIndex: 1050, right: 0 }}
              >
                <div className="fw-bold fs-8 text-muted-custom border-bottom border-custom pb-1 mb-2">
                  Ko'rinadigan Ustunlar:
                </div>
                {columns.map((col, idx) => {
                  const isVisible = !hiddenColumns.includes(col.header);
                  return (
                    <div
                      key={idx}
                      className="form-check form-check-sm d-flex align-items-center justify-content-between py-1 px-2 hover-bg-custom rounded cursor-pointer"
                      onClick={() => toggleColumn(col.header)}
                    >
                      <label className="form-check-label fs-8 text-main mb-0 me-2 cursor-pointer">
                        {col.header}
                      </label>
                      {isVisible ? (
                        <LuEye className="text-primary fs-7" />
                      ) : (
                        <LuEyeOff className="text-muted-custom fs-7" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Table Render */}
      <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="table table-hover align-middle mb-0" style={{ width: '100%', minWidth: 'max-content' }}>
          <thead className="table-light">
            <tr>
              {visibleColumns.map((col, idx) => (
                <th key={idx} style={{ width: col.width || 'auto', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={row.id ? `${row.id}-${rowIdx}` : `row-${rowIdx}`}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {visibleColumns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {col.cell ? col.cell(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

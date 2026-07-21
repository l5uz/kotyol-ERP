import React from 'react';
import { PAGE_SIZE_OPTIONS } from '@/constants/app.constants';
import { ERP_ICONS } from '@/shared/icons';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pt-3">
      <div className="d-flex align-items-center gap-2 text-muted-custom fs-7">
        <span>
          Showing <span className="fw-semibold text-main">{totalItems > 0 ? startItem : 0}</span> to{' '}
          <span className="fw-semibold text-main">{endItem}</span> of{' '}
          <span className="fw-semibold text-main">{totalItems}</span> entries
        </span>
        {onPageSizeChange && (
          <select
            className="form-select form-select-sm ms-2"
            style={{ width: '75px' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-item-btn btn btn-sm btn-outline-secondary me-1"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className={`bi ${ERP_ICONS.CHEVRON_LEFT}`}></i>
            </button>
          </li>
          <li className="page-item disabled">
            <span className="btn btn-sm btn-light disabled text-main fw-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
          </li>
          <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
            <button
              className="page-item-btn btn btn-sm btn-outline-secondary ms-1"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <i className={`bi ${ERP_ICONS.CHEVRON_RIGHT}`}></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

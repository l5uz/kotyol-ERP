import React, { useState, useEffect, useRef } from 'react';
import { LuChevronDown, LuSearch, LuPlus, LuPencil, LuArchive, LuCheck, LuSettings } from 'react-icons/lu';
import { QuickAddModal } from '../DynamicSelect/QuickAddModal';
import { ArchiveManagementModal } from './ArchiveManagementModal';

export const DynamicDropdown = ({
  label,
  value,
  onChange,
  options = [],
  onAddNew = null,
  onEdit = null,
  onRefresh = null,
  entityKey = null,
  entityTitle = 'Element',
  placeholder = 'Tanlang...',
  required = false,
  disabled = false,
  error = null,
  helperText = null,
  canCreate = true,
  canEdit = true,
  canArchive = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const containerRef = useRef(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || opt.id === value);

  const filteredOptions = options.filter((opt) =>
    opt.label ? opt.label.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const handleSelectOption = (opt) => {
    const val = opt.value !== undefined ? opt.value : opt.id;
    if (onChange) {
      onChange({ target: { value: val } });
    }
    setIsOpen(false);
  };

  const handleAddSubmit = (newRecord) => {
    if (onAddNew) {
      const created = onAddNew(newRecord);
      if (created && (created.value || created.id)) {
        onChange({ target: { value: created.value || created.id } });
      }
    }
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (updatedRecord) => {
    if (onEdit && value) {
      const updated = onEdit(value, updatedRecord);
      if (updated && (updated.value || updated.id)) {
        onChange({ target: { value: updated.value || updated.id } });
      }
    }
    setIsEditModalOpen(false);
  };

  const handleRestored = (restoredId) => {
    if (onRefresh) {
      onRefresh();
    }
    if (onChange && restoredId) {
      onChange({ target: { value: restoredId } });
    }
  };

  return (
    <div ref={containerRef} className="dynamic-dropdown-wrapper position-relative mb-3">
      {/* Label Area with Icon-Only Action Buttons (No text) */}
      <div className="d-flex align-items-center justify-content-between mb-1">
        {label && (
          <label className="form-label fs-7 fw-medium text-main mb-0">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        <div className="d-flex align-items-center gap-1">
          {canCreate && (onAddNew || entityKey) && (
            <button
              type="button"
              className="btn btn-link p-0 text-primary text-decoration-none fs-7 p-1 d-inline-flex align-items-center justify-content-center rounded-2 hover-bg-light"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddModalOpen(true);
              }}
              title="Yangi qo'shish"
            >
              <LuPlus className="fs-6" />
            </button>
          )}
          {canArchive && (entityKey || onAddNew) && (
            <button
              type="button"
              className="btn btn-link p-0 text-muted text-decoration-none fs-7 p-1 d-inline-flex align-items-center justify-content-center rounded-2 hover-bg-light"
              onClick={(e) => {
                e.stopPropagation();
                setIsArchiveModalOpen(true);
              }}
              title="Boshqarish"
            >
              <LuSettings className="fs-6" />
            </button>
          )}
        </div>
      </div>

      {/* Trigger Button (Closed State) */}
      <button
        type="button"
        className={`form-select text-start fs-7 d-flex align-items-center justify-content-between border-custom ${
          error ? 'is-invalid' : ''
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span className={`text-truncate ${selectedOption ? 'text-main fw-medium' : 'text-muted'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown className="fs-6 text-muted flex-shrink-0 ms-2" />
      </button>

      {error && <div className="invalid-feedback fs-8 d-block mt-1">{error}</div>}
      {helperText && !error && <small className="text-muted fs-8 d-block mt-1">{helperText}</small>}

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          className="position-absolute start-0 w-100 shadow-lg rounded-3 p-2 bg-body border z-3 animate-fade-in"
          style={{ top: '100%', marginTop: '4px', zIndex: 1050 }}
        >
          {/* 1. Search Input */}
          <div className="input-group input-group-sm mb-2">
            <span className="input-group-text bg-body-tertiary">
              <LuSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* 2. Available Records List */}
          <div className="dropdown-options-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <div className="text-center py-2 text-muted fs-8">Yozuvlar topilmadi</div>
            ) : (
              filteredOptions.map((opt) => {
                const optVal = opt.value !== undefined ? opt.value : opt.id;
                const isSelected = value === optVal;
                return (
                  <div
                    key={optVal}
                    className={`d-flex align-items-center justify-content-between p-2 rounded-2 fs-7 cursor-pointer transition-all ${
                      isSelected ? 'bg-primary text-white fw-semibold' : 'text-main hover-bg-light'
                    }`}
                    onClick={() => handleSelectOption(opt)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="text-truncate">{opt.label}</span>
                    {isSelected && <LuCheck className="fs-6 flex-shrink-0 ms-2" />}
                  </div>
                );
              })
            )}
          </div>

          {/* 3. Divider */}
          <hr className="my-2 border-secondary opacity-25" />

          {/* 4. In-Menu Action Items */}
          <div className="d-flex flex-column gap-1">
            {/* Yangi qo'shish */}
            {canCreate && (onAddNew || entityKey) && (
              <button
                type="button"
                className="btn btn-sm btn-link text-primary text-decoration-none text-start d-flex align-items-center flex-nowrap gap-2 p-1 px-2 rounded-2 hover-bg-light fs-7 fw-semibold border-0 w-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsAddModalOpen(true);
                }}
              >
                <LuPlus className="fs-6 flex-shrink-0" />
                <span className="text-nowrap">Yangi qo'shish</span>
              </button>
            )}

            {/* Tanlanganni tahrirlash (Only visible when a value is selected) */}
            {canEdit && value && (onEdit || entityKey) && (
              <button
                type="button"
                className="btn btn-sm btn-link text-warning text-decoration-none text-start d-flex align-items-center flex-nowrap gap-2 p-1 px-2 rounded-2 hover-bg-light fs-7 fw-semibold border-0 w-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                <LuPencil className="fs-6 flex-shrink-0" />
                <span className="text-nowrap">Tanlanganni tahrirlash</span>
              </button>
            )}

            {/* Arxivlanganlarni boshqarish */}
            {canArchive && (entityKey || onAddNew) && (
              <button
                type="button"
                className="btn btn-sm btn-link text-muted text-decoration-none text-start d-flex align-items-center flex-nowrap gap-2 p-1 px-2 rounded-2 hover-bg-light fs-7 fw-medium border-0 w-100"
                onClick={() => {
                  setIsOpen(false);
                  setIsArchiveModalOpen(true);
                }}
              >
                <LuArchive className="fs-6 flex-shrink-0" />
                <span className="text-nowrap">Arxivlanganlarni boshqarish</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {isAddModalOpen && (
        <QuickAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          entityTitle={entityTitle}
        />
      )}

      {/* Edit Selected Modal */}
      {isEditModalOpen && (
        <QuickAddModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          entityTitle={`${entityTitle}ni tahrirlash`}
          initialData={selectedOption ? { name: selectedOption.label } : null}
        />
      )}

      {/* Archive Management Modal */}
      {isArchiveModalOpen && (
        <ArchiveManagementModal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          entityKey={entityKey}
          entityTitle={entityTitle}
          onRestored={handleRestored}
        />
      )}
    </div>
  );
};

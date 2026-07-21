import React from 'react';
import { MOCK_PERMISSION_MODULES } from '../constants/settings.mock';

export const PermissionMatrixTable = ({ matrix = {}, onTogglePermission }) => {
  const actions = [
    { key: 'view', label: "Ko'rish" },
    { key: 'create', label: 'Yaratish' },
    { key: 'update', label: 'Yangilash' },
    { key: 'delete', label: "O'chirish" },
    { key: 'export', label: 'Eksport Qilish' },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0 fs-7">
        <thead className="bg-body-custom">
          <tr>
            <th>Modul Nomi</th>
            {actions.map((act) => (
              <th key={act.key} className="text-center" style={{ width: '130px' }}>
                {act.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_PERMISSION_MODULES.map((mod) => (
            <tr key={mod.key}>
              <td className="fw-semibold text-main">{mod.name}</td>
              {actions.map((act) => {
                const isChecked = matrix[mod.key]?.[act.key] ?? false;
                return (
                  <td key={act.key} className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onTogglePermission && onTogglePermission(mod.key, act.key)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

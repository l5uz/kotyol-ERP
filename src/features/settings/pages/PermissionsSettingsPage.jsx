import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Select } from '@/components/common/Select/Select';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { PermissionMatrixTable } from '../components/PermissionMatrixTable';
import { settingsApi } from '../api/settingsApi';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { notifySuccess } from '@/services/notification.service';
import { LuCheck } from 'react-icons/lu';

export const PermissionsSettingsPage = () => {
  const roleOptions = dynamicSettingsService.getRoleOptions();
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]?.value || 'Administrator');
  const [matrix, setMatrix] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await settingsApi.getPermissionsMatrix();
    if (res.success && res.data) {
      const data = res.data;
      setMatrix(data.SUPER_ADMIN || data[selectedRole] || data || {});
    }
    setIsLoading(false);
  };

  const handleTogglePermission = (moduleKey, actionKey) => {
    setMatrix((prev) => {
      const currentModule = prev[moduleKey] || { view: false, create: false, update: false, delete: false, export: false };
      return {
        ...prev,
        [moduleKey]: {
          ...currentModule,
          [actionKey]: !currentModule[actionKey],
        },
      };
    });
  };

  const handleSave = () => {
    notifySuccess("Ruxsatlar matritsasi muvaffaqiyatli saqlandi.");
  };

  return (
    <div className="permissions-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <PageHeader
        title="Ruxsatlar Matritsasi"
        subtitle="Rollar bo'yicha modullarga kirish va amallar huquqlarini sozlash"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Sozlamalar', path: '/settings' },
          { label: 'Ruxsatlar' },
        ]}
        actions={
          <div className="d-flex align-items-center gap-2" style={{ minWidth: '220px' }}>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              options={roleOptions}
            />
            <Button variant="primary" size="sm" icon={<LuCheck />} onClick={handleSave}>
              Saqlash
            </Button>
          </div>
        }
      />

      <Card title={`'${selectedRole}' Roli uchun Modullar Huquqlari Matritsasi`} isLoading={isLoading}>
        <PermissionMatrixTable matrix={matrix} onTogglePermission={handleTogglePermission} />
      </Card>
    </div>
  );
};

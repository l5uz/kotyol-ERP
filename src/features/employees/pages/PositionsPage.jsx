import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { EmployeeSubNav } from '../components/EmployeeSubNav';
import { employeesApi } from '../api/employeesApi';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: 'Ishlab Chiqarish', code: '', description: '' });

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    const res = await employeesApi.getPositions();
    if (res.success) setPositions(res.data);
  };

  const handleCreatePosition = async (e) => {
    e.preventDefault();
    const res = await employeesApi.createPosition(formData);
    notifySuccess(res.message);
    setIsModalOpen(false);
    setFormData({ name: '', department: 'Ishlab Chiqarish', code: '', description: '' });
    loadPositions();
  };

  const columns = [
    { header: 'Lavozim Kodi', accessor: 'code' },
    { header: 'Lavozim Nomi', accessor: 'name' },
    { header: "Bo'lim / Sex", cell: (row) => <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">{row.department}</span> },
    { header: 'Vazifa Tavsifi', accessor: 'description' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="positions-page animate-fade-in pb-5">
      <EmployeeSubNav />

      <PageHeader
        title="Lavozimlar Boshqaruvi (Dynamic Positions)"
        subtitle="Korxona va sexlar lavozimlari katalogi. Bu yerga qo'shilgan lavozimlar xodim yaratishda avtomatik ko'rinadi."
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Xodimlar', path: '/employees' },
          { label: 'Lavozimlar' },
        ]}
        actions={
          <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
            Yangi Lavozim Yaratish
          </Button>
        }
      />

      <Card title={`Dinamik Lavozimlar Ro'yxati (${positions.length} ta)`}>
        <Table columns={columns} data={positions} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Lavozim Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreatePosition}>
              Saqlash
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreatePosition}>
          <Input
            label="Lavozim Nomi (masalan: Gidravlik Nasos Ustasi)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Lavozim Kodi (masalan: PUMP-01)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Bo'lim / Sex (masalan: Yig'ish Sexi)"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
          <Input
            label="Lavozim Tavsifi"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

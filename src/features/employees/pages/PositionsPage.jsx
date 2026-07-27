import React, { useState, useEffect } from 'react';
import { LuPlus, LuPencil, LuTrash2, LuPower } from 'react-icons/lu';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { Button } from '@/components/common/Button/Button';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SearchInput } from '@/components/common/SearchInput/SearchInput';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { employeesApi } from '../api/employeesApi';
import { dataIntegrityService } from '@/services/dataIntegrity.service';
import { notifySuccess, notifyError } from '@/services/notification.service';

const PERMISSION_MODULES = [
  { key: 'SALES', label: 'Savdo bo\'limi' },
  { key: 'PRODUCTION', label: 'Ishlab chiqarish' },
  { key: 'WAREHOUSE', label: 'Ombor tizimi' },
  { key: 'FINANCE', label: 'Moliya bo\'limi' },
  { key: 'EMPLOYEES', label: 'Kadrlar bo\'limi (Xodimlar)' },
  { key: 'SERVICES', label: 'Servis xizmati' }
];

const PERMISSION_ACTIONS = [
  { key: 'VIEW', label: 'Ko\'rish' },
  { key: 'CREATE', label: 'Yaratish' },
  { key: 'EDIT', label: 'Tahrirlash' },
  { key: 'DELETE', label: 'O\'chirish' }
];

export const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [posName, setPosName] = useState('');
  const [posDesc, setPosDesc] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [deletingPos, setDeletingPos] = useState(null);
  const [blockedReason, setBlockedReason] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    const res = await employeesApi.getPositions();
    if (res.success) setPositions(res.data);
  };

  const handleOpenModal = (pos = null) => {
    setEditingPos(pos);
    if (pos) {
      setPosName(pos.name);
      setPosDesc(pos.description || '');
      setStatus(pos.status || 'ACTIVE');
      let perms = [];
      try {
        perms = pos.permissions ? JSON.parse(pos.permissions) : [];
      } catch {
        perms = pos.permissions ? pos.permissions.split(',') : [];
      }
      setSelectedPermissions(perms);
    } else {
      setPosName('');
      setPosDesc('');
      setStatus('ACTIVE');
      setSelectedPermissions([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posName.trim()) return;

    const payload = {
      name: posName,
      description: posDesc,
      status,
      permissions: JSON.stringify(selectedPermissions)
    };

    if (editingPos) {
      const res = await employeesApi.updatePosition(editingPos.id, payload);
      notifySuccess(res.message);
    } else {
      const res = await employeesApi.createPosition({
        ...payload,
        status: 'ACTIVE',
      });
      notifySuccess(res.message);
    }

    setIsModalOpen(false);
    loadPositions();
  };

  const handlePromptDelete = (pos) => {
    setDeletingPos(pos);
    const integrityCheck = dataIntegrityService.canDelete('POSITION', pos.id);
    if (!integrityCheck.allowed) {
      setBlockedReason(integrityCheck.reason);
    } else {
      setBlockedReason(null);
    }
    setIsConfirmOpen(true);
  };

  const handleHardDelete = async () => {
    if (deletingPos) {
      const res = await employeesApi.deletePosition(deletingPos.id);
      notifySuccess(res.message);
      setIsConfirmOpen(false);
      setDeletingPos(null);
      loadPositions();
    }
  };

  const handleSoftDelete = async () => {
    if (deletingPos) {
      const res = await employeesApi.updatePosition(deletingPos.id, {
        ...deletingPos,
        status: 'INACTIVE',
      });
      notifySuccess("Lavozim holati 'NOFAOL' deb o'zgartirildi.");
      setIsConfirmOpen(false);
      setDeletingPos(null);
      loadPositions();
    }
  };

  const filtered = positions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const columns = [
    {
      header: 'Lavozim Nomi',
      cell: (row) => (
        <div>
          <strong className="text-main fs-7">{row.name}</strong>
          <small className="d-block text-muted-custom fs-8">{row.description || 'Izohsiz'}</small>
        </div>
      ),
    },
    {
      header: 'Xodimlar Soni',
      cell: (row) => <span className="badge bg-primary bg-opacity-10 text-primary fs-8">{row.employeeCount || 0} ta</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`badge ${row.status === 'INACTIVE' ? 'bg-secondary' : 'bg-success'} fs-8`}>
          {row.status === 'INACTIVE' ? 'Nofaol' : 'Faol'}
        </span>
      ),
    },
    {
      header: 'Amallar',
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <button
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            onClick={() => handleOpenModal(row)}
            title="Tahrirlash"
          >
            <LuPencil />
          </button>
          <button
            className="btn btn-sm btn-outline-danger p-1 border-0"
            onClick={() => handlePromptDelete(row)}
            title="O'chirish"
          >
            <LuTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="positions-page animate-fade-in pb-5">
      <PageHeader
        title="Lavozimlar va Mansablar Reyestri"
        subtitle="Kompaniyaning barcha shtat lavozimlari va xodimlar birikmasi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Xodimlar', path: '/employees' },
          { label: 'Lavozimlar' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
            <LuPlus className="me-1" /> Yangi Lavozim Qo'shish
          </Button>
        }
      />

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Lavozim nomi bo'yicha..."
          />
        </div>
      </div>

      <Card title={`Mavjud Lavozimlar (${filtered.length} ta)`}>
        <Table columns={columns} data={filtered} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPos ? "Lavozimni Tahrirlash" : "Yangi Lavozim Qo'shish"}
        size="lg"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              Saqlash
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input
              label="Lavozim Nomi"
              placeholder="Bosh Injener"
              value={posName}
              onChange={(e) => setPosName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fs-7 fw-medium text-main">Lavozim Izohi va Vazifalari</label>
            <textarea
              className="form-control fs-7"
              rows="3"
              value={posDesc}
              onChange={(e) => setPosDesc(e.target.value)}
              placeholder="Asosiy majburiyatlari va huquqlari..."
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label fs-7 fw-bold text-main d-block border-bottom pb-1 mb-2">Tizim Huquqlari Matritsasi (Ruxsatnomalar)</label>
            <div className="table-responsive">
              <table className="table table-sm table-bordered fs-7 align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th>Modul / Bo'lim</th>
                    {PERMISSION_ACTIONS.map(act => (
                      <th key={act.key} className="text-center" style={{ width: '80px' }}>{act.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_MODULES.map(mod => (
                    <tr key={mod.key}>
                      <td className="fw-semibold text-main">{mod.label}</td>
                      {PERMISSION_ACTIONS.map(act => {
                        const permKey = `${mod.key}_${act.key}`;
                        const isChecked = selectedPermissions.includes(permKey);
                        return (
                          <td key={act.key} className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPermissions([...selectedPermissions, permKey]);
                                } else {
                                  setSelectedPermissions(selectedPermissions.filter(p => p !== permKey));
                                }
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editingPos && (
            <div className="mb-2">
              <label className="form-label fs-7 fw-medium text-main">Status</label>
              <select
                className="form-select fs-7"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ACTIVE">Faol</option>
                <option value="INACTIVE">Nofaol</option>
              </select>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleHardDelete}
        onSoftDelete={handleSoftDelete}
        title="Lavozimni O'chirish"
        message={`Haqiqatan ham '${deletingPos?.name}' lavozimi o'chirilsinmi?`}
        blockedReason={blockedReason}
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Yopish"
      />
    </div>
  );
};

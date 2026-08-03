import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ROUTES } from '@/constants/routes.constants';
import {
  LuGripVertical,
  LuEye,
  LuUsers,
  LuClock,
  LuChevronDown,
  LuChevronRight,
  LuArrowRight,
  LuCircleCheck,
  LuDollarSign,
  LuSettings,
  LuPencil,
  LuTrash2,
  LuPlus,
} from 'react-icons/lu';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { productionApi } from '@/features/production/api/productionApi';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';
import { notifySuccess } from '@/services/notification.service';

export const ProductionKanbanBoard = ({
  orders = [],
  stages = [],
  employees = [],
  onCardClick,
  onStageChange,
  onStagesUpdated,
}) => {
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [draggedOrderId, setDraggedOrderId] = useState(null);

  // Confirmation dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [stageToDeleteId, setStageToDeleteId] = useState(null);

  // Column management state
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageCode, setNewStageCode] = useState('');

  const [activeDropdownColId, setActiveDropdownColId] = useState(null);
  const [editingStageId, setEditingStageId] = useState(null);
  const [editingStageName, setEditingStageName] = useState('');
  const [editingStageCode, setEditingStageCode] = useState('');

  const handleCreateStage = async () => {
    if (!newStageName.trim()) return;
    const code = newStageCode.trim() || newStageName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const newStage = {
      name: newStageName.trim(),
      code,
      stageOrder: stages.length + 1,
      defaultPrice: 150000,
    };
    await settingsApi.createProductionStage(newStage);
    setIsAddingStage(false);
    setNewStageName('');
    setNewStageCode('');
    if (onStagesUpdated) onStagesUpdated();
  };

  const handleSaveStageName = async (stageId) => {
    if (!editingStageName.trim()) return;
    const targetStage = stages.find((s) => s.id === stageId);
    if (!targetStage) return;
    await settingsApi.updateProductionStage(stageId, {
      name: editingStageName.trim(),
      code: targetStage.code,
      stageOrder: targetStage.stageOrder,
      defaultPrice: targetStage.defaultPrice,
    });
    setEditingStageId(null);
    if (onStagesUpdated) onStagesUpdated();
  };

  const handleDeleteStage = (stageId) => {
    setStageToDeleteId(stageId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteStage = async () => {
    if (!stageToDeleteId) return;
    await settingsApi.deleteProductionStage(stageToDeleteId);
    setIsDeleteConfirmOpen(false);
    setStageToDeleteId(null);
    if (onStagesUpdated) onStagesUpdated();
  };

  const toggleColumnCollapse = (colCode) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [colCode]: !prev[colCode],
    }));
  };

  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStageCode) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (!orderId) return;

    const targetOrder = orders.find((o) => o.id === orderId || o.productionNumber === orderId);
    if (targetOrder && targetOrder.status !== targetStageCode) {
      if (onStageChange) {
        onStageChange(orderId, targetStageCode);
      }

      // If moved to COMPLETED column, credit salary automatically
      if (targetStageCode === 'COMPLETED' || targetStageCode === 'COMPLETED_STAGE') {
        const empName = targetOrder.assignedEmployees?.[0] || 'Usta (Ishchi)';
        const amount = (targetOrder.quantity || 1) * 150000;
        notifySuccess(
          `'${targetOrder.title}' bajarildi ustuniga o'tkazildi! Xodim (${empName}) hisobiga ${amount.toLocaleString()} UZS maosh avtomatik qo'shildi!`
        );
      }
    }
    setDraggedOrderId(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <div className="d-flex gap-3 pb-4 align-items-start" style={{ minWidth: 'max-content' }}>
        {stages.map((col, idx) => {
          const colOrders = orders.filter((o) => o.status === col.code || o.stage === col.code);
          const isCollapsed = !!collapsedColumns[col.code];
          const totalUnits = colOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
          const isFinalStage = idx === stages.length - 1 || col.code === 'COMPLETED';

          return (
            <div
              key={col.code}
              style={{ width: isCollapsed ? '72px' : '320px', minWidth: isCollapsed ? '72px' : '320px' }}
              className="transition-all"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.code)}
            >
              <div
                className={`card h-100 border-custom bg-body-custom rounded-3 shadow-sm ${
                  isFinalStage ? 'border-success border-opacity-50' : ''
                }`}
              >
                {/* Column Header */}
                <div
                  className={`card-header border-bottom border-custom p-3 d-flex align-items-center justify-content-between cursor-pointer ${
                    isFinalStage ? 'bg-success bg-opacity-10' : 'bg-surface'
                  }`}
                  onClick={() => toggleColumnCollapse(col.code)}
                >
                  <div className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1 me-2">
                    <span className="text-muted-custom fs-7">
                      {isCollapsed ? <LuChevronRight /> : <LuChevronDown />}
                    </span>
                    {!isCollapsed && (
                      <div className="text-truncate flex-grow-1">
                        {editingStageId === col.id ? (
                          <div className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="form-control form-control-sm py-0 px-1 fs-7 fw-bold text-start text-main"
                              value={editingStageName}
                              onChange={(e) => setEditingStageName(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveStageName(col.id);
                                if (e.key === 'Escape') setEditingStageId(null);
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-success p-1 py-0 fs-8"
                              onClick={() => handleSaveStageName(col.id)}
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <span className="fw-bold fs-7 font-heading text-main d-block text-truncate">
                            {col.name} {isFinalStage && <span className="badge bg-success ms-1 fs-9">Maosh Hisoblanadi</span>}
                          </span>
                        )}
                        <small className="text-muted-custom fs-8">Yuklama: {totalUnits} dona</small>
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`badge border-custom rounded-pill fs-8 fw-semibold px-2 ${
                        isFinalStage ? 'bg-success text-white' : 'bg-primary bg-opacity-10 text-primary'
                      }`}
                    >
                      {colOrders.length}
                    </span>
                    {!isCollapsed && (
                      <div className="dropdown position-relative">
                        <button
                          className="btn btn-sm btn-outline-secondary p-1 border-0 dropdown-toggle no-caret"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownColId(activeDropdownColId === col.id ? null : col.id);
                          }}
                        >
                          <LuSettings size={14} />
                        </button>
                        {activeDropdownColId === col.id && (
                          <ul className="dropdown-menu show position-absolute end-0 mt-1 py-1 shadow-lg border-custom fs-8 bg-surface z-3" style={{ display: 'block', minWidth: '120px' }}>
                            <li>
                              <button
                                className="dropdown-item py-1 px-3 d-flex align-items-center gap-2 text-main"
                                type="button"
                                onClick={() => {
                                  setEditingStageId(col.id);
                                  setEditingStageName(col.name);
                                  setEditingStageCode(col.code);
                                  setActiveDropdownColId(null);
                                }}
                              >
                                <LuPencil size={12} className="text-primary" /> Tahrirlash
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item py-1 px-3 d-flex align-items-center gap-2 text-danger"
                                type="button"
                                onClick={() => handleDeleteStage(col.id)}
                              >
                                <LuTrash2 size={12} /> O'chirish
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Column Body */}
                {!isCollapsed && (
                  <div className="card-body p-2 d-flex flex-column gap-2 min-vh-50 overflow-y-auto">
                    {colOrders.length === 0 ? (
                      <div className="text-center py-4 text-muted-custom fs-8 border border-dashed rounded-3 border-custom">
                        Topshiriqlar mavjud emas
                      </div>
                    ) : (
                      colOrders.map((order) => (
                        <KanbanCard
                          key={order.id}
                          order={order}
                          onClick={() => onCardClick && onCardClick(order)}
                          onDragStart={(e) => handleDragStart(e, order.id)}
                          stages={stages}
                          employees={employees}
                          onStagesUpdated={onStagesUpdated}
                          onMoveStage={(newStage) => {
                            if (onStageChange) onStageChange(order.id, newStage);
                            if (newStage === 'COMPLETED') {
                              const empName = order.assignedEmployees?.[0] || 'Usta (Ishchi)';
                              const amount = (order.quantity || 1) * 150000;
                              notifySuccess(
                                `'${order.title}' topshirig'i bajarildi! Xodim (${empName}) hisobiga ${amount.toLocaleString()} UZS ish haqi qo'shildi!`
                              );
                            }
                          }}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Stage Column */}
        <div style={{ width: '320px', minWidth: '320px' }} className="p-2">
          {isAddingStage ? (
            <div className="card p-3 border-custom bg-surface rounded-3 shadow-sm">
              <h6 className="fs-7 fw-bold text-main mb-3">Yangi Ish Bosqichi</h6>
              <div className="mb-2 text-start">
                <label className="form-label fs-8 fw-medium text-main mb-1">Nomi</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-start"
                  placeholder="Masalan, Payvandlash"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-3 text-start">
                <label className="form-label fs-8 fw-medium text-main mb-1">Kodi (Tanlanma)</label>
                <input
                  type="text"
                  className="form-control form-control-sm text-start"
                  placeholder="Masalan, WELDING"
                  value={newStageCode}
                  onChange={(e) => setNewStageCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-primary flex-grow-1"
                  onClick={handleCreateStage}
                >
                  Qo'shish
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setIsAddingStage(false)}
                >
                  Bekor
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-outline-primary border-dashed w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fs-7 fw-semibold"
              onClick={() => {
                setIsAddingStage(true);
                setNewStageName('');
                setNewStageCode('');
              }}
            >
              <LuPlus /> Yangi Bosqich Qo'shish
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setStageToDeleteId(null);
        }}
        onConfirm={handleConfirmDeleteStage}
        title="Kanban Ustunini O'chirish"
        message="Haqiqatan ham ushbu ishlab chiqarish bosqichini o'chirmoqchimisiz? Bu bosqichdagi barcha topshiriqlar avvalgi bosqichga qaytadi."
        isDanger={true}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
      />
    </div>
  );
};

const KanbanCard = ({ order, onClick, onDragStart, stages = [], onMoveStage, employees = [], onStagesUpdated }) => {
  const [showStageMenu, setShowStageMenu] = useState(false);

  const currentStageIndex = stages.findIndex((s) => s.code === order.status || s.code === order.stage);
  const nextStage = stages[currentStageIndex + 1];

  const estimatedSalary = (order.quantity || 1) * 150000;

  return (
    <div
      className="card border-custom rounded-3 p-3 bg-surface shadow-sm cursor-grab position-relative hover-shadow"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-1">
          <LuGripVertical className="text-muted-custom fs-6" />
          <Link
            to={`${ROUTES.PROTECTED.PRODUCTION}/${order.id}`}
            className="fw-bold text-primary text-decoration-none fs-7"
            onClick={(e) => e.stopPropagation()}
          >
            {order.productionNumber}
          </Link>
        </div>
        <div className="d-flex align-items-center gap-1">
          {nextStage && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary py-0 px-2 fs-8 d-flex align-items-center gap-1"
              title={`Keyingi bosqich: ${nextStage.name}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveStage) onMoveStage(nextStage.code);
              }}
            >
              <span>{nextStage.name}</span>
              <LuArrowRight />
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            title="Tezkor Ko'rish"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            <LuEye />
          </button>
        </div>
      </div>

      <h6 className="fw-semibold text-main fs-7 mb-2 line-clamp-2">{order.title}</h6>

      <div className="d-flex align-items-center justify-content-between text-muted-custom fs-8 mb-2">
        <span>Mijoz: <strong className="text-main">{order.customerName}</strong></span>
        <span>Reja: <strong className="text-main">{order.quantity} dona</strong></span>
      </div>

      {/* Operation Rate Tag */}
      <div className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-body-custom border border-custom mb-2 fs-8">
        <span className="text-muted-custom d-flex align-items-center gap-1">
          <LuDollarSign className="text-success fs-7" /> Operatsiya Ish Haqi:
        </span>
        <strong className="text-success fw-bold font-mono">{estimatedSalary.toLocaleString()} UZS</strong>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="d-flex justify-content-between fs-8 text-muted-custom mb-1">
          <span>Bajarilish:</span>
          <strong className="text-primary">{order.progressPercent}%</strong>
        </div>
        <div className="progress" style={{ height: '5px' }}>
          <div
            className={`progress-bar ${order.progressPercent === 100 ? 'bg-success' : 'bg-primary'}`}
            role="progressbar"
            style={{ width: `${order.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top border-custom fs-8">
        <div className="d-flex align-items-center gap-1 text-muted-custom flex-grow-1 me-2" onClick={(e) => e.stopPropagation()}>
          <LuUsers className="text-info flex-shrink-0" />
          <select
            className="form-select form-select-sm py-0 px-1 fs-8 text-main border-0 bg-transparent"
            style={{ minWidth: '100px', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
            value={order.assignedEmployees?.[0] || ''}
            onChange={async (e) => {
              const val = e.target.value;
              if (val) {
                await productionApi.updateProductionOrder(order.id, {
                  ...order,
                  assignedEmployees: [val],
                });
                notifySuccess(`Topshiriq xodimga biriktirildi: ${val}`);
                if (onStagesUpdated) onStagesUpdated();
              }
            }}
          >
            <option value="" disabled>{order.assignedEmployees?.[0] || 'Usta biriktirish'}</option>
            {employees.map((emp) => {
              const fullName = `${emp.firstName || emp.full_name?.split(' ')[0]} ${emp.lastName || ''}`;
              return (
                <option key={emp.id} value={fullName}>
                  {fullName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="d-flex align-items-center gap-1 text-muted-custom flex-shrink-0">
          <LuClock className="text-warning" />
          <span>v{order.version || 1}</span>
        </div>
      </div>
    </div>
  );
};

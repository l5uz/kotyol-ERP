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
} from 'react-icons/lu';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { notifySuccess } from '@/services/notification.service';

export const ProductionKanbanBoard = ({
  orders = [],
  onCardClick,
  onStageChange,
}) => {
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [draggedOrderId, setDraggedOrderId] = useState(null);

  // Dynamic Production Stages from Settings
  const dynamicStages = dynamicSettingsService.getProductionStages();

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
        {dynamicStages.map((col, idx) => {
          const colOrders = orders.filter((o) => o.status === col.code || o.stage === col.code);
          const isCollapsed = !!collapsedColumns[col.code];
          const totalUnits = colOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);
          const isFinalStage = idx === dynamicStages.length - 1 || col.code === 'COMPLETED';

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
                  <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <span className="text-muted-custom fs-7">
                      {isCollapsed ? <LuChevronRight /> : <LuChevronDown />}
                    </span>
                    {!isCollapsed && (
                      <div className="text-truncate">
                        <span className="fw-bold fs-7 font-heading text-main d-block text-truncate">
                          {col.name} {isFinalStage && <span className="badge bg-success ms-1 fs-9">Maosh Hisoblanadi</span>}
                        </span>
                        <small className="text-muted-custom fs-8">Yuklama: {totalUnits} dona</small>
                      </div>
                    )}
                  </div>
                  <span
                    className={`badge border-custom rounded-pill fs-8 fw-semibold px-2 ${
                      isFinalStage ? 'bg-success text-white' : 'bg-primary bg-opacity-10 text-primary'
                    }`}
                  >
                    {colOrders.length}
                  </span>
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
                          stages={dynamicStages}
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
      </div>
    </div>
  );
};

const KanbanCard = ({ order, onClick, onDragStart, stages = [], onMoveStage }) => {
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
        <div className="d-flex align-items-center gap-1 text-muted-custom">
          <LuUsers className="text-info" />
          <span>{order.assignedEmployees?.[0] || '1 usta'}</span>
        </div>
        <div className="d-flex align-items-center gap-1 text-muted-custom">
          <LuClock className="text-warning" />
          <span>v{order.version || 1}</span>
        </div>
      </div>
    </div>
  );
};

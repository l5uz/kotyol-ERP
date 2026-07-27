import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/common/StatusBadge/StatusBadge';
import { ROUTES } from '@/constants/routes.constants';
import { LuGripVertical, LuEye, LuUsers, LuClock, LuChevronDown, LuChevronRight, LuCpu, LuCircleAlert } from 'react-icons/lu';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

export const ProductionKanbanBoard = ({
  orders = [],
  onCardClick,
}) => {
  const [collapsedColumns, setCollapsedColumns] = useState({});

  // Dynamic Production Stages from Settings
  const dynamicStages = dynamicSettingsService.getProductionStages();

  const toggleColumnCollapse = (colCode) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [colCode]: !prev[colCode],
    }));
  };

  return (
    <div className="d-flex gap-3 overflow-x-auto pb-4 align-items-start">
      {dynamicStages.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.code || o.stage === col.code);
        const isCollapsed = !!collapsedColumns[col.code];
        const totalUnits = colOrders.reduce((sum, o) => sum + (o.quantity || 0), 0);

        return (
          <div
            key={col.code}
            style={{ width: isCollapsed ? '72px' : '320px', minWidth: isCollapsed ? '72px' : '320px' }}
            className="transition-all"
          >
            <div className="card h-100 border-custom bg-body-custom rounded-3 shadow-sm">
              {/* Column Header */}
              <div
                className="card-header border-bottom border-custom p-3 d-flex align-items-center justify-content-between bg-surface cursor-pointer"
                onClick={() => toggleColumnCollapse(col.code)}
              >
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <span className="text-muted-custom fs-7">
                    {isCollapsed ? <LuChevronRight /> : <LuChevronDown />}
                  </span>
                  {!isCollapsed && (
                    <div className="text-truncate">
                      <span className="fw-bold fs-7 font-heading text-main d-block text-truncate">
                        {col.name}
                      </span>
                      <small className="text-muted-custom fs-8">Yuklama: {totalUnits} dona</small>
                    </div>
                  )}
                </div>
                <span className="badge bg-primary bg-opacity-10 text-primary border-custom rounded-pill fs-8 fw-semibold px-2">
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
                      <KanbanCard key={order.id} order={order} onClick={() => onCardClick && onCardClick(order)} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const KanbanCard = ({ order, onClick }) => {
  return (
    <div
      className="card border-custom rounded-3 p-3 bg-surface shadow-sm cursor-pointer"
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

      <h6 className="fw-semibold text-main fs-7 mb-2 line-clamp-2">{order.title}</h6>

      <div className="d-flex align-items-center justify-content-between text-muted-custom fs-8 mb-2">
        <span>Mijoz: <strong className="text-main">{order.customerName}</strong></span>
        <span>Reja: <strong className="text-main">{order.quantity} dona</strong></span>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="d-flex justify-content-between fs-8 text-muted-custom mb-1">
          <span>Bajarilish:</span>
          <strong className="text-primary">{order.progressPercent}%</strong>
        </div>
        <div className="progress" style={{ height: '5px' }}>
          <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${order.progressPercent}%` }}></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="d-flex align-items-center justify-content-between pt-2 border-top border-custom fs-8">
        <div className="d-flex align-items-center gap-1 text-muted-custom">
          <LuUsers className="text-info" />
          <span>{order.assignedEmployees?.length || 0} usta</span>
        </div>
        <div className="d-flex align-items-center gap-1 text-muted-custom">
          <LuClock className="text-warning" />
          <span>v{order.version || 1}</span>
        </div>
      </div>
    </div>
  );
};

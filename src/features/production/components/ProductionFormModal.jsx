import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { documentNumberingService } from '@/services/documentNumbering.service';
import { useFormDraftStore } from '@/store/useFormDraftStore';
import { ROUTES } from '@/constants/routes.constants';
import { LuChevronDown, LuChevronUp, LuSlidersHorizontal, LuFileCheck } from 'react-icons/lu';

export const ProductionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  productionOrder = null,
  orders = [],
  employees = [],
}) => {
  const FORM_KEY = productionOrder ? `draft_production_${productionOrder.id}` : 'draft_production_new';
  const { saveDraft, getDraft, clearDraft } = useFormDraftStore();

  const [orderOptions, setOrderOptions] = useState(
    orders.map((o) => ({ value: o.id, label: `${o.orderNumber} — ${o.customerName} (${o.boilerModelName})` }))
  );
  const [employeeOptions, setEmployeeOptions] = useState(
    employees.map((e) => ({
      value: `${e.firstName} ${e.lastName}`,
      label: `${e.firstName} ${e.lastName} (${e.positionName || 'Xodim'})`,
    }))
  );
  const [priorityOptions, setPriorityOptions] = useState(dynamicSettingsService.getOrderPriorityOptions());

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  const [formData, setFormData] = useState({
    productionNumber: '',
    orderId: '',
    title: '',
    line: 'Liniya A-1 (Payvandlash sex)',
    quantity: 1,
    priority: 'NORMAL',
    assignedEmployee: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedFinishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (orders.length > 0) {
      setOrderOptions(
        orders.map((o) => ({ value: o.id, label: `${o.orderNumber} — ${o.customerName} (${o.boilerModelName})` }))
      );
    }
    if (employees.length > 0) {
      setEmployeeOptions(
        employees.map((e) => ({
          value: `${e.firstName} ${e.lastName}`,
          label: `${e.firstName} ${e.lastName} (${e.positionName || 'Xodim'})`,
        }))
      );
    }
  }, [orders.length, employees.length]);

  useEffect(() => {
    if (productionOrder) {
      setFormData({
        productionNumber: productionOrder.productionNumber || '',
        orderId: productionOrder.orderId || orderOptions[0]?.value || '',
        title: productionOrder.title || '',
        line: productionOrder.line || 'Liniya A-1 (Payvandlash sex)',
        quantity: productionOrder.quantity || 1,
        priority: productionOrder.priority || 'NORMAL',
        assignedEmployee: productionOrder.assignedEmployees?.[0] || '',
        startDate: productionOrder.startDate || new Date().toISOString().split('T')[0],
        expectedFinishDate: productionOrder.expectedFinishDate || new Date().toISOString().split('T')[0],
        notes: productionOrder.notes || '',
      });
      setIsDraftRestored(false);
    } else if (isOpen) {
      // Clear old cached form draft
      clearDraft(FORM_KEY);
      const firstOrder = orderOptions[0]?.value || '';
      setFormData({
        productionNumber: documentNumberingService.generateNumber('PRODUCTION'),
        orderId: firstOrder,
        title: '',
        line: 'Liniya A-1 (Payvandlash sex)',
        quantity: 1,
        priority: 'NORMAL',
        assignedEmployee: employeeOptions[0]?.value || '',
        startDate: new Date().toISOString().split('T')[0],
        expectedFinishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        notes: '',
      });
      setIsDraftRestored(false);
      setShowAdvanced(false);
    }
  }, [productionOrder, isOpen]);

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (!productionOrder) {
      saveDraft(FORM_KEY, updated);
    }
  };

  const handleAddNewOrder = (newRecord) => {
    const newO = { value: `ord_${Date.now()}`, label: newRecord.name };
    setOrderOptions((prev) => [...prev, newO]);
    handleFieldChange('orderId', newO.value);
    return newO;
  };

  const handleAddNewEmployee = (newRecord) => {
    const newE = { value: newRecord.name, label: newRecord.name };
    setEmployeeOptions((prev) => [...prev, newE]);
    handleFieldChange('assignedEmployee', newE.value);
    return newE;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedOrd = orders.find((o) => o.id === formData.orderId);

    clearDraft(FORM_KEY);
    onSubmit({
      ...formData,
      orderNumber: selectedOrd ? selectedOrd.orderNumber : 'ORD-2026-8801',
      customerName: selectedOrd ? selectedOrd.customerName : 'Mijoz MCHJ',
      boilerModelName: selectedOrd ? selectedOrd.boilerModelName : 'Sanoat Kotyoli',
      assignedEmployees: formData.assignedEmployee ? [formData.assignedEmployee] : [],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="d-flex align-items-center gap-2">
          <span>
            {productionOrder
              ? "Ishlab Chiqarish Topshirig'ini Tahrirlash"
              : "Yangi Ishlab Chiqarish Topshirig'i Yaratish"}
          </span>
          {isDraftRestored && (
            <span className="badge bg-success bg-opacity-10 text-success fs-8 d-flex align-items-center gap-1">
              <LuFileCheck /> 📝 Qoralama saqlangan ma'lumotdan tiklandi
            </span>
          )}
        </div>
      }
      size="xl"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {productionOrder ? 'Saqlash' : "Ishlab Chiqarishni Biriktirish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Core Primary Header Fields */}
        <div className="row g-3 mb-3">
          {/* Dynamic Order Select */}
          <div className="col-12 col-md-5">
            <DynamicSelect
              label="Tegishli Buyurtma №"
              value={formData.orderId}
              onChange={(e) => handleFieldChange('orderId', e.target.value)}
              options={orderOptions}
              managePath={ROUTES.PROTECTED.ORDERS}
              onAddNew={handleAddNewOrder}
              entityTitle="Buyurtma"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Texnologik Operatsiya va Mahsulot Nomi"
              placeholder="Masalan: Kotyol yig'ish va payvandlash"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <Input
              label="Reja Miqdori (dona)"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleFieldChange('quantity', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Collapsible Section for Progressive Disclosure */}
        <div className="border-custom rounded-3 p-2 mb-3 bg-body-custom">
          <button
            type="button"
            className="btn btn-link text-decoration-none text-main fs-7 fw-semibold d-flex align-items-center justify-content-between w-100 p-1"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <div className="d-flex align-items-center gap-2">
              <LuSlidersHorizontal className="text-primary" />
              <span>Qo'shimcha Parametrlar (Sex Liniyasi, Xodimlar va Muddatlar)</span>
            </div>
            {showAdvanced ? <LuChevronUp /> : <LuChevronDown />}
          </button>

          {showAdvanced && (
            <div className="row g-3 pt-3 border-top border-custom mt-2">
              <div className="col-12 col-md-4">
                <Input
                  label="Biriktirilgan Sex / Liniya Nomi"
                  placeholder="Liniya A-1 (Payvandlash sex)"
                  value={formData.line}
                  onChange={(e) => handleFieldChange('line', e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Employee Multi-Select */}
              <div className="col-12 col-md-4">
                <DynamicSelect
                  label="Biriktirilgan Usta / Ishchi Xodim"
                  value={formData.assignedEmployee}
                  onChange={(e) => handleFieldChange('assignedEmployee', e.target.value)}
                  options={employeeOptions}
                  managePath={ROUTES.PROTECTED.EMPLOYEES}
                  onAddNew={handleAddNewEmployee}
                  entityTitle="Xodim"
                />
              </div>

              <div className="col-12 col-md-4">
                <Select
                  label="Prioritet"
                  value={formData.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  options={priorityOptions}
                />
              </div>

              <div className="col-12 col-md-6">
                <Input
                  label="Boshlanish Sanasi"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <Input
                  label="Kutilayotgan Yakunlanish Sanasi"
                  type="date"
                  value={formData.expectedFinishDate}
                  onChange={(e) => handleFieldChange('expectedFinishDate', e.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Texnologik Izoh va Instruksiya</label>
                <textarea
                  className="form-control fs-7"
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Sex ustalari uchun maxsus yo'riqnoma..."
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Chizmalar va Texnik Xaritalarni Yuklash</label>
                <FileUpload label="Texnik chizmalarni yuklash" maxSizeMB={10} />
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

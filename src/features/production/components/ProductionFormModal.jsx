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
import { settingsApi } from '@/features/settings/api/settingsApi';
import { formatCurrency } from '@/utils/currency.utils';
import { notifyError } from '@/services/notification.service';
import { ROUTES } from '@/constants/routes.constants';
import { LuChevronDown, LuChevronUp, LuSlidersHorizontal, LuFileCheck, LuUserCheck, LuDollarSign, LuCalculator, LuCircleCheck } from 'react-icons/lu';

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
      value: `${e.firstName || e.fullName?.split(' ')[0]} ${e.lastName || ''}`.trim(),
      label: `${e.fullName || `${e.firstName} ${e.lastName}`} (${e.positionName || 'Xodim'})`,
    }))
  );
  const [priorityOptions, setPriorityOptions] = useState(dynamicSettingsService.getOrderPriorityOptions());

  // GET API fetched stages and salary rates
  const [stageOptions, setStageOptions] = useState([]);
  const [stagesList, setStagesList] = useState([]);

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
    stageId: '',
    stagePrice: 150000,
    startDate: new Date().toISOString().split('T')[0],
    expectedFinishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  // GET production stages & salary rates dynamically via API
  useEffect(() => {
    const fetchStagesApi = async () => {
      try {
        const res = await settingsApi.getProductionStages();
        if (res.success && Array.isArray(res.data)) {
          setStagesList(res.data);
          const mapped = res.data.map((s) => ({
            value: s.id || s.code,
            label: `${s.name} — ${formatCurrency(s.defaultPrice || 150000)} / dona`,
            price: s.defaultPrice || 150000,
          }));
          setStageOptions(mapped);

          if (!formData.stageId && mapped.length > 0) {
            setFormData((prev) => ({
              ...prev,
              stageId: mapped[0].value,
              stagePrice: mapped[0].price,
            }));
          }
        }
      } catch (err) {
        console.error("fetchStagesApi error:", err);
      }
    };

    if (isOpen) {
      fetchStagesApi();
    }
  }, [isOpen]);

  useEffect(() => {
    if (orders.length > 0) {
      setOrderOptions(
        orders.map((o) => ({ value: o.id, label: `${o.orderNumber} — ${o.customerName} (${o.boilerModelName})` }))
      );
    }
    if (employees.length > 0) {
      setEmployeeOptions(
        employees.map((e) => ({
          value: `${e.firstName || e.fullName?.split(' ')[0]} ${e.lastName || ''}`.trim(),
          label: `${e.fullName || `${e.firstName} ${e.lastName}`} (${e.positionName || 'Xodim'})`,
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
        assignedEmployee: productionOrder.assignedEmployees?.[0] || employeeOptions[0]?.value || '',
        stageId: productionOrder.stageId || '',
        stagePrice: productionOrder.stagePrice || 150000,
        startDate: productionOrder.startDate || new Date().toISOString().split('T')[0],
        expectedFinishDate: productionOrder.expectedFinishDate || new Date().toISOString().split('T')[0],
        notes: productionOrder.notes || '',
      });
      setIsDraftRestored(false);
    } else if (isOpen) {
      clearDraft(FORM_KEY);
      const firstOrder = orderOptions[0]?.value || '';
      const firstEmp = employeeOptions[0]?.value || '';
      setFormData({
        productionNumber: documentNumberingService.generateNumber('PRODUCTION'),
        orderId: firstOrder,
        title: '',
        line: 'Liniya A-1 (Payvandlash sex)',
        quantity: 1,
        priority: 'NORMAL',
        assignedEmployee: firstEmp,
        stageId: stageOptions[0]?.value || '',
        stagePrice: stageOptions[0]?.price || 150000,
        startDate: new Date().toISOString().split('T')[0],
        expectedFinishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        notes: '',
      });
      setIsDraftRestored(false);
      setShowAdvanced(false);
    }
  }, [productionOrder, isOpen]);

  const handleFieldChange = (field, value) => {
    let updated = { ...formData, [field]: value };

    // If stage selection changed, update stage price automatically from GET API list
    if (field === 'stageId') {
      const selectedStageObj = stageOptions.find((s) => s.value === value);
      if (selectedStageObj) {
        updated.stagePrice = selectedStageObj.price;
      }
    }

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

  // Calculate live wage amount based on GET API stage price and quantity
  const calculatedTotalSalary = (Number(formData.quantity) || 1) * (Number(formData.stagePrice) || 150000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assignedEmployee || !formData.assignedEmployee.trim()) {
      notifyError("Ishlab chiqarish topshirig'iga kamida 1 ta mas'ul xodim biriktirish MAJBURIY!");
      return;
    }

    const selectedOrd = orders.find((o) => o.id === formData.orderId);

    clearDraft(FORM_KEY);
    onSubmit({
      ...formData,
      orderNumber: selectedOrd ? selectedOrd.orderNumber : 'ORD-2026-8801',
      customerName: selectedOrd ? selectedOrd.customerName : 'Mijoz MCHJ',
      boilerModelName: selectedOrd ? selectedOrd.boilerModelName : 'Sanoat Kotyoli',
      assignedEmployees: [formData.assignedEmployee.trim()],
      totalSalaryAmount: calculatedTotalSalary,
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
          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Tegishli Buyurtma № (Mijoz Zakazi)"
              value={formData.orderId}
              onChange={(e) => handleFieldChange('orderId', e.target.value)}
              options={orderOptions}
              managePath={ROUTES.PROTECTED.ORDERS}
              onAddNew={handleAddNewOrder}
              entityTitle="Buyurtma"
              required
            />
          </div>

          <div className="col-12 col-md-5">
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

        {/* Mandatory Employee & GET Salary Stage Tarif Select */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <DynamicSelect
              label="👤 Biriktirilgan Mas'ul Usta / Xodim (MAJBURIY)"
              value={formData.assignedEmployee}
              onChange={(e) => handleFieldChange('assignedEmployee', e.target.value)}
              options={employeeOptions}
              managePath={ROUTES.PROTECTED.EMPLOYEES}
              onAddNew={handleAddNewEmployee}
              entityTitle="Xodim"
              required
            />
          </div>

          {/* GET API Salary Stage Tarif Selection */}
          <div className="col-12 col-md-5">
            <Select
              label="💰 Ish Haqi Tarifi (GET API orqali olindi)"
              value={formData.stageId}
              onChange={(e) => handleFieldChange('stageId', e.target.value)}
              options={stageOptions}
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <Input
              label="Bir dona mahsulot tarifi (UZS)"
              type="number"
              value={formData.stagePrice}
              onChange={(e) => handleFieldChange('stagePrice', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Live Calculated Salary Wage Display Banner */}
        <div className="p-3 bg-success bg-opacity-10 border border-2 border-success border-opacity-25 rounded-3 mb-3 text-dark">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 bg-success text-white rounded-circle d-flex align-items-center justify-content-center">
                <LuDollarSign className="fs-5" />
              </div>
              <div>
                <span className="fs-8 text-muted d-block fw-semibold">Bosqich va Reja Miqdoriga Qarab Hisoblangan Xodim Maoshi:</span>
                <strong className="fs-6 text-success fw-bold">
                  {formatCurrency(calculatedTotalSalary)}
                </strong>
                <small className="text-muted ms-2">
                  ({formData.quantity} dona × {formatCurrency(formData.stagePrice)})
                </small>
              </div>
            </div>

            <div className="badge bg-success text-white px-3 py-2 fs-8 fw-semibold rounded-pill d-flex align-items-center gap-1">
              <LuCircleCheck /> Kanban bajarilganda xodim balansiga tushadi
            </div>
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
              <span>Qo'shimcha Parametrlar (Sex Liniyasi, Prioritet va Muddatlar)</span>
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

              <div className="col-12 col-md-4">
                <Select
                  label="Prioritet"
                  value={formData.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value)}
                  options={priorityOptions}
                />
              </div>

              <div className="col-12 col-md-4">
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

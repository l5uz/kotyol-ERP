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
import { LuChevronDown, LuChevronUp, LuSlidersHorizontal, LuShieldCheck, LuFileCheck, LuFlame } from 'react-icons/lu';

export const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  serviceRecord = null,
  customers = [],
  boilers = [],
  employees = [],
}) => {
  const FORM_KEY = serviceRecord ? `draft_service_${serviceRecord.id}` : 'draft_service_new';
  const { saveDraft, getDraft, clearDraft } = useFormDraftStore();

  const [customerOptions, setCustomerOptions] = useState(customers.map((c) => ({ value: c.id, label: c.customerName })));
  const [boilerOptions, setBoilerOptions] = useState(boilers.map((b) => ({ value: b.id, label: `${b.modelName} (${b.internalCode})` })));
  const [serviceTypeOptions, setServiceTypeOptions] = useState(dynamicSettingsService.getServiceTypeOptions());
  const [employeeOptions, setEmployeeOptions] = useState(employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} (${e.positionName || 'Usta'})` })));

  const [priorityOptions, setPriorityOptions] = useState(dynamicSettingsService.getOrderPriorityOptions());
  const [statusOptions, setStatusOptions] = useState(dynamicSettingsService.getServiceStatusOptions());

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [selectedBoilerPreview, setSelectedBoilerPreview] = useState(null);

  const [formData, setFormData] = useState({
    serviceNumber: '',
    customerId: '',
    boilerId: '',
    serviceTypeId: serviceTypeOptions[0]?.value || '',
    assignedEmployeeId: '',
    serviceDate: new Date().toISOString().split('T')[0],
    priority: 'NORMAL',
    status: 'NEW',
    notes: '',
  });

  useEffect(() => {
    if (customers.length > 0) {
      setCustomerOptions(customers.map((c) => ({ value: c.id, label: c.customerName })));
    }
    if (boilers.length > 0) {
      setBoilerOptions(boilers.map((b) => ({ value: b.id, label: `${b.modelName} (${b.internalCode})` })));
    }
    if (employees.length > 0) {
      setEmployeeOptions(employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} (${e.positionName || 'Usta'})` })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers.length, boilers.length, employees.length]);

  useEffect(() => {
    if (serviceRecord) {
      setFormData({
        serviceNumber: serviceRecord.serviceNumber || '',
        customerId: serviceRecord.customerId || (customerOptions[0]?.value || ''),
        boilerId: serviceRecord.boilerId || (boilerOptions[0]?.value || ''),
        serviceTypeId: serviceRecord.serviceTypeId || (serviceTypeOptions[0]?.value || ''),
        assignedEmployeeId: serviceRecord.assignedEmployeeId || '',
        serviceDate: serviceRecord.serviceDate || new Date().toISOString().split('T')[0],
        priority: serviceRecord.priority || 'NORMAL',
        status: serviceRecord.status || 'NEW',
        notes: serviceRecord.notes || '',
      });
      setIsDraftRestored(false);
    } else if (isOpen) {
      const savedDraft = getDraft(FORM_KEY);
      if (savedDraft) {
        setFormData(savedDraft);
        setIsDraftRestored(true);
      } else {
        setFormData({
          serviceNumber: documentNumberingService.generateNumber('SERVICE'),
          customerId: customerOptions[0]?.value || '',
          boilerId: boilerOptions[0]?.value || '',
          serviceTypeId: serviceTypeOptions[0]?.value || '',
          assignedEmployeeId: employeeOptions[0]?.value || '',
          serviceDate: new Date().toISOString().split('T')[0],
          priority: 'NORMAL',
          status: 'NEW',
          notes: '',
        });
        setIsDraftRestored(false);
      }
      setShowAdvanced(false);
    }
  }, [serviceRecord, isOpen]);

  // Read-only automatic preview card when selecting a Boiler
  useEffect(() => {
    if (isOpen && formData.boilerId) {
      const foundBoiler = boilers.find((b) => b.id === formData.boilerId);
      const foundCust = customers.find((c) => c.id === formData.customerId);

      setSelectedBoilerPreview({
        boilerName: foundBoiler?.modelName || 'Sanoat Kotyoli Heavy KV-200',
        customerName: foundCust?.customerName || 'Samarqand Issiqlik Manbai MChJ',
        saleDate: '2026-07-20',
        isUnderWarranty: true,
        warrantyText: 'Zavod Kafolati Ostida (24 oy)',
        orderNumber: 'ORD-2026-8801',
        productionNumber: 'PRD-2026-9001',
      });
    }
  }, [formData.boilerId, formData.customerId, boilers, customers, isOpen]);

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (!serviceRecord) {
      saveDraft(FORM_KEY, updated);
    }
  };

  const handleAddNewCustomer = (newRecord) => {
    const newC = { value: `cust_${Date.now()}`, label: newRecord.name };
    setCustomerOptions((prev) => [...prev, newC]);
    handleFieldChange('customerId', newC.value);
    return newC;
  };

  const handleAddNewBoiler = (newRecord) => {
    const newB = { value: `boil_${Date.now()}`, label: newRecord.name };
    setBoilerOptions((prev) => [...prev, newB]);
    handleFieldChange('boilerId', newB.value);
    return newB;
  };

  const handleAddNewServiceType = (newRecord) => {
    const newST = { value: `st_${Date.now()}`, label: newRecord.name };
    setServiceTypeOptions((prev) => [...prev, newST]);
    handleFieldChange('serviceTypeId', newST.value);
    return newST;
  };

  const handleAddNewEmployee = (newRecord) => {
    const newE = { value: `emp_${Date.now()}`, label: newRecord.name };
    setEmployeeOptions((prev) => [...prev, newE]);
    handleFieldChange('assignedEmployeeId', newE.value);
    return newE;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCust = customerOptions.find((c) => c.value === formData.customerId);
    const selectedBoil = boilerOptions.find((b) => b.value === formData.boilerId);
    const selectedType = serviceTypeOptions.find((t) => t.value === formData.serviceTypeId);
    const selectedEmp = employeeOptions.find((e) => e.value === formData.assignedEmployeeId);

    clearDraft(FORM_KEY);
    onSubmit({
      ...formData,
      customerName: selectedCust ? selectedCust.label : '',
      boilerModelName: selectedBoil ? selectedBoil.label : '',
      serviceTypeName: selectedType ? selectedType.label : '',
      assignedEmployeeName: selectedEmp ? selectedEmp.label : 'Biriktirilmagan',
      isUnderWarranty: selectedBoilerPreview?.isUnderWarranty ?? true,
      warrantyPeriod: selectedBoilerPreview?.warrantyText || '24 oy',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="d-flex align-items-center gap-2">
          <span>{serviceRecord ? "Servis Arizasini Tahrirlash" : "Yangi Servis Arizasi Rasmiylashtirish"}</span>
          {isDraftRestored && (
            <span className="badge bg-success bg-opacity-10 text-success fs-8 d-flex align-items-center gap-1">
              <LuFileCheck /> 📝 Qoralama tiklandi
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
            {serviceRecord ? 'Saqlash' : "Arizani Saqlash"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Core Header Fields */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <Input
              label="Servis Hujjati №"
              placeholder="SRV-2026-000601"
              value={formData.serviceNumber}
              onChange={(e) => handleFieldChange('serviceNumber', e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Mijoz Korxona"
              value={formData.customerId}
              onChange={(e) => handleFieldChange('customerId', e.target.value)}
              options={customerOptions}
              managePath={ROUTES.PROTECTED.CUSTOMERS}
              onAddNew={handleAddNewCustomer}
              entityTitle="Mijoz"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Kotyol Modeli"
              value={formData.boilerId}
              onChange={(e) => handleFieldChange('boilerId', e.target.value)}
              options={boilerOptions}
              managePath={ROUTES.PROTECTED.BOILERS}
              onAddNew={handleAddNewBoiler}
              entityTitle="Kotyol Modeli"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Servis / Xizmat Turi"
              value={formData.serviceTypeId}
              onChange={(e) => handleFieldChange('serviceTypeId', e.target.value)}
              options={serviceTypeOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_SERVICE_TYPES}
              onAddNew={handleAddNewServiceType}
              entityTitle="Servis Turi"
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Biriktirilgan Usta Xodim"
              value={formData.assignedEmployeeId}
              onChange={(e) => handleFieldChange('assignedEmployeeId', e.target.value)}
              options={employeeOptions}
              managePath={ROUTES.PROTECTED.EMPLOYEES}
              onAddNew={handleAddNewEmployee}
              entityTitle="Xodim"
            />
          </div>
        </div>

        {/* Automatic Read-Only Warranty & Order Preview Card */}
        {selectedBoilerPreview && (
          <div className="p-3 bg-body-custom border-custom rounded-3 mb-3 fs-7">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold text-main d-flex align-items-center gap-1 font-heading">
                <LuFlame className="text-primary" /> Avtomatik Kotyol va Kafolat Ma'lumotlari
              </span>
              <span className={`badge ${selectedBoilerPreview.isUnderWarranty ? 'bg-success' : 'bg-secondary'} fs-8 d-flex align-items-center gap-1`}>
                <LuShieldCheck /> {selectedBoilerPreview.warrantyText}
              </span>
            </div>

            <div className="row g-2 text-main">
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">Mijoz:</small>
                <strong>{selectedBoilerPreview.customerName}</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">Sotilgan Sana:</small>
                <strong>{selectedBoilerPreview.saleDate}</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">Ishlab Chiqarish №:</small>
                <strong>{selectedBoilerPreview.productionNumber}</strong>
              </div>
              <div className="col-6 col-md-3 text-end">
                <small className="text-muted-custom d-block">Buyurtma №:</small>
                <strong className="text-primary">{selectedBoilerPreview.orderNumber}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Collapsible Section for Progressive Disclosure */}
        <div className="border-custom rounded-3 p-2 mb-3 bg-body-custom">
          <button
            type="button"
            className="btn btn-link text-decoration-none text-main fs-7 fw-semibold d-flex align-items-center justify-content-between w-100 p-1"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <div className="d-flex align-items-center gap-2">
              <LuSlidersHorizontal className="text-primary" />
              <span>Qo'shimcha Parametrlar (Servis Sanasi, Prioritet, Status va Izoh)</span>
            </div>
            {showAdvanced ? <LuChevronUp /> : <LuChevronDown />}
          </button>

          {showAdvanced && (
            <div className="row g-3 pt-3 border-top border-custom mt-2">
              <div className="col-12 col-md-4">
                <Input
                  label="Rejalashtirilgan Servis Sanasi"
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => handleFieldChange('serviceDate', e.target.value)}
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
                <Select
                  label="Servis Holati (Status)"
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  options={statusOptions}
                />
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Nosozlik Eslatmasi va Usta Izohi</label>
                <textarea
                  className="form-control fs-7"
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Mijoz arizasi bo'yicha nosozlik tavsifi va usta xulosasi..."
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Diagnostika Foto va Dalolatnomalarni Yuklash</label>
                <FileUpload label="Kotyol diagnostikasi fotosuratlarini yuklash" maxSizeMB={10} />
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

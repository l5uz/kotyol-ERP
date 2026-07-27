import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { CalculationBreakdown } from '@/components/common/CalculationBreakdown/CalculationBreakdown';
import { ordersApi } from '../api/ordersApi';
import { businessRulesService } from '@/services/businessRules.service';
import { documentNumberingService } from '@/services/documentNumbering.service';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { ROUTES } from '@/constants/routes.constants';
import { LuChevronDown, LuChevronUp, LuSlidersHorizontal, LuBoxes, LuBookmarkCheck } from 'react-icons/lu';

export const OrderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  order = null,
  customers = [],
  boilers = [],
}) => {
  const [customerOptions, setCustomerOptions] = useState(customers.map((c) => ({ value: c.id, label: c.name })));
  const [boilerOptions, setBoilerOptions] = useState(boilers.map((b) => ({ value: b.id, label: `${b.modelName} v${b.version}` })));
  const [customerList, setCustomerList] = useState(customers);
  const [boilerList, setBoilerList] = useState(boilers);

  const [priorityOptions, setPriorityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availabilityCheck, setAvailabilityCheck] = useState(null);

  useEffect(() => {
    setCustomerOptions(customers.map((c) => ({ value: c.id, label: c.name })));
    setCustomerList(customers);
    setBoilerOptions(boilers.map((b) => ({ value: b.id, label: `${b.modelName} v${b.version}` })));
    setBoilerList(boilers);

    setPriorityOptions(dynamicSettingsService.getOrderPriorityOptions());
    setStatusOptions(dynamicSettingsService.getOrderStatusOptions());
  }, [customers, boilers]);

  const [formData, setFormData] = useState({
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    customerId: '',
    boilerId: '',
    quantity: 1,
    priority: 'MEDIUM',
    expectedDeliveryDate: '',
    notes: '',
    isReserved: false,
    status: 'PENDING',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber || '',
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        customerId: order.customerId || (customerOptions[0]?.value || ''),
        boilerId: order.boilerId || (boilerOptions[0]?.value || ''),
        quantity: order.quantity || 1,
        priority: order.priority || 'MEDIUM',
        expectedDeliveryDate: order.expectedDeliveryDate || '',
        notes: order.notes || '',
        isReserved: order.isReserved || false,
        status: order.status || 'PENDING',
      });
    } else if (isOpen) {
      const autoNum = documentNumberingService.generateNumber('ORDERS');
      const firstCust = customerList[0];
      const firstBoil = boilerList[0];

      // Auto-set delivery date to +14 days
      const d = new Date();
      d.setDate(d.getDate() + 14);
      const deliveryDateStr = d.toISOString().split('T')[0];

      setFormData({
        orderNumber: autoNum,
        orderDate: new Date().toISOString().split('T')[0],
        customerId: firstCust ? firstCust.id : '',
        boilerId: firstBoil ? firstBoil.id : '',
        quantity: 1,
        priority: 'MEDIUM',
        expectedDeliveryDate: deliveryDateStr,
        notes: '',
        isReserved: true,
        status: 'PENDING',
      });
      setShowAdvanced(false);
    }
  }, [order, isOpen]);

  // Live Auto Availability Check & Cost Calculation
  useEffect(() => {
    if (formData.boilerId && formData.quantity > 0) {
      runAvailabilityCheck();
    }
  }, [formData.boilerId, formData.quantity]);

  const runAvailabilityCheck = async () => {
    const res = await ordersApi.checkMaterialAvailability(formData.boilerId, formData.quantity);
    if (res.success) {
      setAvailabilityCheck(res.data);
    }
  };

  const handleAddNewCustomer = (newRecord) => {
    const newCust = { id: `c_${Date.now()}`, name: newRecord.name };
    setCustomerList((prev) => [...prev, newCust]);
    const opt = { value: newCust.id, label: newCust.name };
    setCustomerOptions((prev) => [...prev, opt]);
    setFormData((prev) => ({ ...prev, customerId: opt.value }));
    return opt;
  };

  const handleAddNewBoiler = (newRecord) => {
    const newBoil = { id: `boiler_${Date.now()}`, modelName: newRecord.name, version: '1.0', basePrice: 15000 };
    setBoilerList((prev) => [...prev, newBoil]);
    const opt = { value: newBoil.id, label: `${newBoil.modelName} v1.0` };
    setBoilerOptions((prev) => [...prev, opt]);
    setFormData((prev) => ({ ...prev, boilerId: opt.value }));
    return opt;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.boilerId || formData.quantity <= 0) return;

    const selectedCust = customerList.find((c) => c.id === formData.customerId);
    const selectedBoil = boilerList.find((b) => b.id === formData.boilerId);

    const unitPrice = availabilityCheck ? availabilityCheck.unitPrice : (selectedBoil?.basePrice || 15000);
    const totalAmount = availabilityCheck ? availabilityCheck.totalAmount : (unitPrice * formData.quantity);

    onSubmit({
      ...formData,
      customerName: selectedCust ? selectedCust.name : '',
      boilerModelName: selectedBoil ? selectedBoil.modelName : '',
      unitPrice,
      totalAmount,
      materialAvailabilityStatus: availabilityCheck ? availabilityCheck.materialAvailabilityStatus : 'AVAILABLE',
    });
  };

  // Financial Breakdown calculations
  const taxBreakdown = availabilityCheck
    ? businessRulesService.calculateOrderTax(availabilityCheck.totalAmount, 12)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={order ? "Buyurtmani Tahrirlash" : "Yangi Buyurtma Rasmiylashtirish"}
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {order ? 'Saqlash' : "Buyurtmani Rasmiylashtirish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Document Auto-Number & Core Fields */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <Input label="Buyurtma Hujjati №" value={formData.orderNumber} readOnly />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Buyurtma Sanasi"
              type="date"
              value={formData.orderDate}
              onChange={(e) => handleFieldChange('orderDate', e.target.value)}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Select
              label="Buyurtma Statusi"
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          {/* Dynamic Customer Select */}
          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Buyurtmachi Mijoz Korxona"
              value={formData.customerId}
              onChange={(e) => handleFieldChange('customerId', e.target.value)}
              options={customerOptions}
              managePath={ROUTES.PROTECTED.CUSTOMERS}
              onAddNew={handleAddNewCustomer}
              entityTitle="Mijoz"
              required
            />
          </div>

          {/* Dynamic Boiler Model Select */}
          <div className="col-12 col-md-5">
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

          <div className="col-12 col-md-3">
            <Input
              label="Buyurtma Miqdori (dona)"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleFieldChange('quantity', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Automatic Read-Only Material & Cost Availability Check Card */}
        {availabilityCheck && (
          <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 mb-3 fs-7">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold text-primary d-flex align-items-center gap-1 font-heading">
                <LuBoxes /> Avtomatik Resurs va Materiallar Yetarliligi Tekshiruvi
              </span>
              <span className={`badge ${availabilityCheck.materialAvailabilityStatus === 'AVAILABLE' ? 'bg-success' : 'bg-warning text-dark'} fs-8`}>
                {availabilityCheck.materialAvailabilityStatus === 'AVAILABLE' ? 'Materiallar Mavjud' : 'Qisman Yetarli'}
              </span>
            </div>

            <div className="row g-2 text-main">
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">Retsept Versiyasi:</small>
                <strong>v{availabilityCheck.recipeVersion} ({availabilityCheck.recipeName || 'Standart'})</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">Taxminiy Ishlab Chiqarish:</small>
                <strong>{availabilityCheck.estimatedProductionDays} ish kuni</strong>
              </div>
              <div className="col-6 col-md-3">
                <small className="text-muted-custom d-block">1 Birlik Narxi:</small>
                <strong>${availabilityCheck.unitPrice.toFixed(2)}</strong>
              </div>
              <div className="col-6 col-md-3 text-end">
                <small className="text-muted-custom d-block">Baza Summasi:</small>
                <strong className="text-primary fs-6">${availabilityCheck.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Breakdown Component */}
        {taxBreakdown && (
          <CalculationBreakdown
            title="Buyurtma Summasi va QQS (12%) Kalkulyatsiyasi"
            formula={taxBreakdown.formula}
            totalLabel="Yakuniy Shartnoma Summasi"
            totalValue={taxBreakdown.grandTotal}
            defaultExpanded={false}
            items={[
              { label: "Mahsulot Baza Summasi:", value: `$${taxBreakdown.subtotal.toLocaleString()}` },
              { label: "Qo'llanilgan Chegirma (0%):", value: `$${taxBreakdown.discountAmount.toLocaleString()}` },
              { label: "QQS Solig'i (12%):", value: `$${taxBreakdown.taxAmount.toLocaleString()}` },
            ]}
          />
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
              <span>Qo'shimcha Parametrlar</span>
            </div>
            {showAdvanced ? <LuChevronUp /> : <LuChevronDown />}
          </button>

          {showAdvanced && (
            <div className="row g-3 pt-3 border-top border-custom mt-2">
              <div className="col-12 col-md-4">
                <Input
                  label="Kutilayotgan Topshirish Sanasi"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => handleFieldChange('expectedDeliveryDate', e.target.value)}
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

              <div className="col-12 col-md-4 d-flex align-items-center pt-4">
                <div className="form-check form-switch cursor-pointer">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    id="reservationSwitch"
                    checked={formData.isReserved}
                    onChange={(e) => handleFieldChange('isReserved', e.target.checked)}
                  />
                  <label className="form-check-label fs-7 fw-semibold text-main ms-2 cursor-pointer" htmlFor="reservationSwitch">
                    <LuBookmarkCheck className="text-info me-1" /> Materiallarni Rezerv Qilish
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Shartnoma Izohi va Eslatmalar</label>
                <textarea
                  className="form-control fs-7"
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Maxsus qadoqlash yoki obyektga yetkazish shartlari..."
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fs-7 fw-medium text-main">Buyurtma Shartnomasi va Ilovalarni Yuklash</label>
                <FileUpload label="Shartnoma fayllarini yuklash" maxSizeMB={5} />
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

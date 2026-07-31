import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { EntityPreviewCard } from '@/components/common/EntityPreviewCard/EntityPreviewCard';
import { CalculationBreakdown } from '@/components/common/CalculationBreakdown/CalculationBreakdown';
import { salesApi } from '../api/salesApi';
import { businessRulesService } from '@/services/businessRules.service';
import { documentNumberingService } from '@/services/documentNumbering.service';
import { formatCurrency, getCurrencySymbol } from '@/utils/currency.utils';
import { LuPlus, LuTrash2, LuSave } from 'react-icons/lu';

export const SaleFormModal = ({ isOpen, onClose, sale, onSave }) => {
  const [customers, setCustomers] = useState([]);
  const [boilers, setBoilers] = useState([]);
  const [salesStatuses, setSalesStatuses] = useState([]);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    boilerId: '',
    quantity: 1,
    unitPrice: 0,
    discountAmount: 0,
    taxRate: 12,
    status: 'COMPLETED',
    saleDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSelectData();
  }, []);

  useEffect(() => {
    if (sale) {
      setFormData({
        invoiceNumber: sale.invoiceNumber || '',
        customerId: sale.customerId || '',
        boilerId: sale.boilerId || '',
        quantity: sale.quantity || 1,
        unitPrice: sale.unitPrice || 0,
        discountAmount: sale.discountAmount || 0,
        taxRate: sale.taxRate || 12,
        status: sale.status || 'COMPLETED',
        saleDate: sale.saleDate || new Date().toISOString().split('T')[0],
      });
    } else {
      const autoNumber = documentNumberingService.generateNumber('SALES');
      setFormData({
        invoiceNumber: autoNumber,
        customerId: '',
        boilerId: '',
        quantity: 1,
        unitPrice: 0,
        discountAmount: 0,
        taxRate: 12,
        status: 'COMPLETED',
        saleDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [sale, isOpen]);

  const loadSelectData = async () => {
    const [custRes, boilRes, stRes] = await Promise.all([
      salesApi.getCustomersList(),
      salesApi.getBoilersList(),
      salesApi.getSalesStatuses(),
    ]);

    if (custRes.success) setCustomers(custRes.data);
    if (boilRes.success) setBoilers(boilRes.data);
    if (stRes.success) setSalesStatuses(stRes.data);
  };

  const selectedBoiler = boilers.find((b) => b.id === formData.boilerId);

  useEffect(() => {
    if (selectedBoiler && !sale) {
      setFormData((prev) => ({ ...prev, unitPrice: selectedBoiler.basePrice }));
    }
  }, [formData.boilerId, selectedBoiler, sale]);

  const subtotal = formData.quantity * formData.unitPrice;
  const financialTotals = businessRulesService.calculateFinancialTotals({
    subtotal,
    discountAmount: Number(formData.discountAmount),
    taxRate: Number(formData.taxRate),
  });

  const validate = () => {
    const errs = {};
    if (!formData.customerId) errs.customerId = 'Mijoz korxonani tanlang';
    if (!formData.boilerId) errs.boilerId = 'Kotyol modelini tanlang';
    if (formData.quantity <= 0) errs.quantity = "Sotuv miqdori 0 dan katta bo'lishi kerak";
    if (formData.unitPrice <= 0) errs.unitPrice = 'Sotuv narxi 0 dan katta bo\'lishi kerak';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      subtotal: financialTotals.subtotal,
      taxAmount: financialTotals.taxAmount,
      totalAmount: financialTotals.totalAmount,
    };

    if (sale) {
      await salesApi.updateSale(sale.id, payload);
    } else {
      await salesApi.createSale(payload);
    }

    onSave();
    onClose();
  };

  const selectedCustomerObj = customers.find((c) => c.id === formData.customerId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sale ? "Sotuv Hujjatini Tahrirlash" : "Yangi Sotuv Hujjatini Rasmiylashtirish"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <Input label="Schyot-Faktura №" value={formData.invoiceNumber} readOnly />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Sotuv Sanasi"
              type="date"
              value={formData.saleDate}
              onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={salesStatuses.map((s) => ({ value: s.code, label: s.name }))}
            />
          </div>
        </div>

          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Mijoz Korxona"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              error={errors.customerId}
              options={customers.map((c) => ({ value: c.id, label: c.customerName || c.name }))}
              placeholder="Mijozni tanlang"
              required
              managePath="/customers"
              entityType="Customer"
            />
          </div>

          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Kotyol Modeli"
              value={formData.boilerId}
              onChange={(e) => setFormData({ ...formData, boilerId: e.target.value })}
              error={errors.boilerId}
              options={boilers.map((b) => ({ value: b.id, label: b.name || b.modelName }))}
              placeholder="Kotyol modelini tanlang"
              required
              managePath="/boilers"
              entityType="Boiler"
            />
          </div>

        {selectedCustomerObj && (
          <EntityPreviewCard
            type="CUSTOMER"
            data={selectedCustomerObj}
          />
        )}

        <div className="row g-2">
          <div className="col-12 col-md-4">
            <Input
              label="Sotuv Miqdori"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              error={errors.quantity}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label={`Sotuv Narxi (${getCurrencySymbol()})`}
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
              error={errors.unitPrice}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label={`Chegirma (${getCurrencySymbol()})`}
              type="number"
              value={formData.discountAmount}
              onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
            />
          </div>
        </div>

        <hr className="border-custom my-2" />

        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-7">
            <CalculationBreakdown
              title="Sotuv Hisob-Kitobi va Soliq"
              formula="Jami = (Oraliq - Chegirma) + QQS (12%)"
              totalLabel="Jami Sotuv Summasi"
              totalValue={financialTotals.totalAmount}
              items={[
                { label: 'Boshlang\'ich Qiymat', value: formatCurrency(subtotal) },
                { label: 'Chegirma', value: `-${formatCurrency(formData.discountAmount)}` },
                { label: `Soliq (QQS ${formData.taxRate}%)`, value: formatCurrency(financialTotals.taxAmount) },
              ]}
            />
          </div>

          <div className="col-12 col-md-5 text-end">
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                Bekor Qilish
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                <LuSave className="me-1" /> Saqlash
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  suppliers = [],
}) => {
  const categoryOptions = dynamicSettingsService.getCategoryOptions();
  const materialOptions = dynamicSettingsService.getMaterialTypeOptions();
  const unitOptions = dynamicSettingsService.getUnitOptions();
  const currencyOptions = dynamicSettingsService.getCurrencyOptions();
  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.companyName }));

  const [formData, setFormData] = useState({
    name: '',
    internalCode: '',
    barcode: '',
    categoryId: categoryOptions[0]?.value || '',
    materialTypeId: materialOptions[0]?.value || '',
    unitId: unitOptions[0]?.value || '',
    supplierId: supplierOptions[0]?.value || '',
    purchasePrice: '',
    currency: 'USD',
    minStock: '100',
    currentStock: '0',
    status: 'ACTIVE',
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        internalCode: product.internalCode || '',
        barcode: product.barcode || '',
        categoryId: product.categoryId || (categoryOptions[0]?.value || ''),
        materialTypeId: product.materialTypeId || (materialOptions[0]?.value || ''),
        unitId: product.unitId || (unitOptions[0]?.value || ''),
        supplierId: product.supplierId || (supplierOptions[0]?.value || ''),
        purchasePrice: product.purchasePrice || '',
        currency: product.currency || 'USD',
        minStock: product.minStock || '100',
        currentStock: product.currentStock || '0',
        status: product.status || 'ACTIVE',
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        internalCode: `SKU-MAT-${Math.floor(100 + Math.random() * 900)}`,
        barcode: '',
        categoryId: categoryOptions[0]?.value || '',
        materialTypeId: materialOptions[0]?.value || '',
        unitId: unitOptions[0]?.value || '',
        supplierId: supplierOptions[0]?.value || '',
        purchasePrice: '',
        currency: 'USD',
        minStock: '100',
        currentStock: '0',
        status: 'ACTIVE',
        description: '',
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCat = categoryOptions.find((c) => c.value === formData.categoryId);
    const selectedMat = materialOptions.find((m) => m.value === formData.materialTypeId);
    const selectedUnit = unitOptions.find((u) => u.value === formData.unitId);
    const selectedSup = supplierOptions.find((s) => s.value === formData.supplierId);

    onSubmit({
      ...formData,
      categoryName: selectedCat ? selectedCat.label : '',
      materialTypeName: selectedMat ? selectedMat.label : '',
      unitName: selectedUnit ? selectedUnit.label : '',
      supplierName: selectedSup ? selectedSup.label : '',
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      minStock: parseInt(formData.minStock) || 0,
      currentStock: parseInt(formData.currentStock) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Mahsulot / Xomashyoni Tahrirlash" : "Yangi Xomashyo yoki Mahsulot Qo'shish"}
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {product ? 'Saqlash' : "Qo'shish"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <Input
              label="Mahsulot / Xomashyo Nomi"
              placeholder="Zanglamaydigan Po'lat Plita 10mm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-4">
            <Input
              label="Ichki Kodi (Nomenklatura SKU)"
              placeholder="SKU-ST-1001"
              value={formData.internalCode}
              onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Kategoriya (Sozlamalardan Dinamik)"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categoryOptions}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Material Turi (Sozlamalardan Dinamik)"
              value={formData.materialTypeId}
              onChange={(e) => setFormData({ ...formData, materialTypeId: e.target.value })}
              options={materialOptions}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="O'lchov Birligi (Dinamik)"
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              options={unitOptions}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Ta'minotchi Korxona (Dinamik)"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              options={supplierOptions}
            />
          </div>
          <div className="col-12 col-md-4">
            <Input
              label="Xarid Narxi Stavkasi"
              placeholder="4.80"
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-4">
            <Select
              label="Valyuta (Dinamik)"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              options={currencyOptions}
            />
          </div>
          <div className="col-12 col-md-4">
            <Input
              label="Eng Kam Zaxira Chegarasi (Min Stock)"
              placeholder="100"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Shtrix-kod (Barcode)"
              placeholder="4780001234567"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />
          </div>
          <div className="col-12 col-md-6">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'ACTIVE', label: 'Faol' },
                { value: 'INACTIVE', label: 'Nofaol' },
              ]}
            />
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Texnik Parametrlari va Tavsifi</label>
            <textarea
              className="form-control fs-7"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Markasi, GOST standarti va o'lchamlari..."
            ></textarea>
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Mahsulot/Xomashyo Suratini Yuklash</label>
            <FileUpload label="Tasvirlar va texnik chizmalarni yuklash" maxSizeMB={5} />
          </div>
        </div>
      </form>
    </Modal>
  );
};

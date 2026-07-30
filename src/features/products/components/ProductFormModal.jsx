import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { DynamicSelect } from '@/components/common/DynamicSelect/DynamicSelect';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { ROUTES } from '@/constants/routes.constants';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  suppliers = [],
}) => {
  const [categoryOptions, setCategoryOptions] = useState(dynamicSettingsService.getCategoryOptions());
  const [materialOptions, setMaterialOptions] = useState(dynamicSettingsService.getMaterialTypeOptions());
  const [unitOptions, setUnitOptions] = useState(dynamicSettingsService.getUnitOptions());
  const [currencyOptions, setCurrencyOptions] = useState(dynamicSettingsService.getCurrencyOptions());
  const [supplierOptions, setSupplierOptions] = useState(suppliers.map((s) => ({ value: s.id, label: s.companyName })));

  useEffect(() => {
    setSupplierOptions(suppliers.map((s) => ({ value: s.id, label: s.companyName })));
  }, [suppliers]);

  const [formData, setFormData] = useState({
    name: '',
    internalCode: '',
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

  const handleAddNewCategory = (newRecord) => {
    const newCat = { value: `cat_${Date.now()}`, label: newRecord.name };
    setCategoryOptions((prev) => [...prev, newCat]);
    setFormData((prev) => ({ ...prev, categoryId: newCat.value }));
    return newCat;
  };

  const handleAddNewMaterial = (newRecord) => {
    const newMat = { value: `mat_${Date.now()}`, label: newRecord.name };
    setMaterialOptions((prev) => [...prev, newMat]);
    setFormData((prev) => ({ ...prev, materialTypeId: newMat.value }));
    return newMat;
  };

  const handleAddNewUnit = (newRecord) => {
    const newUnit = { value: `unit_${Date.now()}`, label: newRecord.name };
    setUnitOptions((prev) => [...prev, newUnit]);
    setFormData((prev) => ({ ...prev, unitId: newUnit.value }));
    return newUnit;
  };

  const handleAddNewSupplier = (newRecord) => {
    const newSup = { value: `sup_${Date.now()}`, label: newRecord.name };
    setSupplierOptions((prev) => [...prev, newSup]);
    setFormData((prev) => ({ ...prev, supplierId: newSup.value }));
    return newSup;
  };

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
              label="Ichki Kodi"
              placeholder="SKU-ST-1001"
              value={formData.internalCode}
              onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
              required
            />
          </div>

          {/* Dynamic Category Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Kategoriya"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categoryOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_CATEGORIES}
              onAddNew={handleAddNewCategory}
              entityTitle="Kategoriya"
              required
            />
          </div>

          {/* Dynamic Material Type Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Material Turi"
              value={formData.materialTypeId}
              onChange={(e) => setFormData({ ...formData, materialTypeId: e.target.value })}
              options={materialOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_MATERIAL_TYPES}
              onAddNew={handleAddNewMaterial}
              entityTitle="Material Turi"
              required
            />
          </div>

          {/* Dynamic Unit Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="O'lchov Birligi"
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
              options={unitOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_UNITS}
              onAddNew={handleAddNewUnit}
              entityTitle="O'lchov Birligi"
              required
            />
          </div>

          {/* Dynamic Supplier Select */}
          <div className="col-12 col-md-6">
            <DynamicSelect
              label="Ta'minotchi Korxona"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              options={supplierOptions}
              managePath={ROUTES.PROTECTED.SUPPLIERS}
              onAddNew={handleAddNewSupplier}
              entityTitle="Ta'minotchi"
              required
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

          {/* Dynamic Currency Select */}
          <div className="col-12 col-md-4">
            <DynamicSelect
              label="Valyuta"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              options={currencyOptions}
              managePath={ROUTES.PROTECTED.SETTINGS_CURRENCY}
              entityTitle="Valyuta"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <Input
              label="Eng Kam Zaxira Chegarasi"
              placeholder="100"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              required
            />
          </div>
          <div className="col-12 col-md-12">
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

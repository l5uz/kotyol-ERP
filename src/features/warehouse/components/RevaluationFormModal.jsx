import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { Button } from '@/components/common/Button/Button';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';

export const RevaluationFormModal = ({ isOpen, onClose, onSubmit, products = [] }) => {
  const revaluationReasonOptions = dynamicSettingsService.getRevaluationReasonOptions();
  const productOptions = products.map((p) => ({ value: p.id || p.productId, label: p.productName || p.name }));

  const [selectedProductId, setSelectedProductId] = useState(productOptions[0]?.value || '');
  const [previousPrice, setPreviousPrice] = useState(0);
  const [newPrice, setNewPrice] = useState('');
  const [reason, setReason] = useState(revaluationReasonOptions[0]?.value || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedProductId) {
      const prod = products.find((p) => (p.id || p.productId) === selectedProductId);
      if (prod) setPreviousPrice(prod.unitPrice || prod.purchasePrice || 0);
    }
  }, [selectedProductId, products]);

  useEffect(() => {
    if (isOpen) {
      const firstProdId = productOptions[0]?.value || '';
      setSelectedProductId(firstProdId);
      const prod = products.find((p) => (p.id || p.productId) === firstProdId);
      setPreviousPrice(prod ? (prod.unitPrice || prod.purchasePrice || 0) : 0);
      setNewPrice('');
      setReason(revaluationReasonOptions[0]?.value || '');
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = products.find((p) => (p.id || p.productId) === selectedProductId);

    onSubmit({
      productId: selectedProductId,
      productName: prod ? (prod.productName || prod.name) : '',
      previousPrice: parseFloat(previousPrice) || 0,
      newPrice: parseFloat(newPrice) || 0,
      reason,
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mahsulot Tannarxini Qayta Baholash (Revaluation)"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Narxni Yangilash
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <Select
              label="Qayta Baholanadigan Mahsulot"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              options={productOptions}
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Amaldagi Narx ($)"
              value={previousPrice.toFixed(2)}
              disabled
            />
          </div>
          <div className="col-12 col-md-6">
            <Input
              label="Yangi Narx ($)"
              placeholder="5.20"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <Select
              label="Qayta Baholash Sababi (Sozlamalardan Dinamik)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={revaluationReasonOptions}
            />
          </div>
          <div className="col-12">
            <label className="form-label fs-7 fw-medium text-main">Asoslash va Izohlar</label>
            <textarea
              className="form-control fs-7"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Birja narxi o'zgarishi yoki import shartnomasi ma'lumoti..."
            ></textarea>
          </div>
        </div>
      </form>
    </Modal>
  );
};

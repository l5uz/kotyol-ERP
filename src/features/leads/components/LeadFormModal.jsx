import React, { useState, useEffect } from 'react';

const LeadFormModal = ({ show, handleClose, handleSave, leadToEdit }) => {
  const initialForm = {
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    status: 'NEW',
    source: 'Telegram',
    notes: '',
    nextContactDate: ''
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (leadToEdit) {
      setFormData(leadToEdit);
    } else {
      setFormData(initialForm);
    }
  }, [leadToEdit, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content glass-card border-0 shadow-lg">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title text-white">{leadToEdit ? 'Lidni tahrirlash' : 'Yangi Lid'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={onSubmit} id="leadForm">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white">To'liq ism *</label>
                  <input type="text" className="form-control glass-input" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Telefon *</label>
                  <input type="text" className="form-control glass-input" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Email</label>
                  <input type="email" className="form-control glass-input" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Kompaniya nomi</label>
                  <input type="text" className="form-control glass-input" name="companyName" value={formData.companyName} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Status</label>
                  <select className="form-select glass-input" name="status" value={formData.status} onChange={handleChange}>
                    <option value="NEW">Yangi</option>
                    <option value="CONTACTED">Bog'lanildi</option>
                    <option value="OFFER">Taklif berildi</option>
                    <option value="NEGOTIATION">Muzokara</option>
                    <option value="WON">Yutilgan</option>
                    <option value="LOST">Yo'qotilgan</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Manba</label>
                  <select className="form-select glass-input" name="source" value={formData.source} onChange={handleChange}>
                    <option value="Telegram">Telegram</option>
                    <option value="Telefon">Telefon</option>
                    <option value="Tavsiya">Tavsiya</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white">Keyingi aloqa sanasi</label>
                  <input type="date" className="form-control glass-input" name="nextContactDate" value={formData.nextContactDate} onChange={handleChange} />
                </div>
                <div className="col-md-12">
                  <label className="form-label text-white">Izoh</label>
                  <textarea className="form-control glass-input" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-top-0">
            <button type="button" className="btn btn-secondary glass-button" onClick={handleClose}>Bekor qilish</button>
            <button type="submit" form="leadForm" className="btn btn-primary glass-button-primary">Saqlash</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFormModal;

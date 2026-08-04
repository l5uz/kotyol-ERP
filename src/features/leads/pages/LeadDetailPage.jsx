import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsApi } from '../api/leadsApi';
import LeadFormModal from '../components/LeadFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);

  const loadLead = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.getLeadById(id);
      setLead(data);
    } catch (error) {
      console.error(error);
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLead();
  }, [id]);

  const handleSave = async (leadData) => {
    try {
      await leadsApi.updateLead(id, leadData);
      setShowModal(false);
      loadLead();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await leadsApi.deleteLead(id);
      navigate('/leads');
    } catch (error) {
      console.error(error);
    }
  };

  const handleConvert = async () => {
    try {
      await leadsApi.convertLeadToCustomer(id);
      navigate('/customers'); // Or navigate to new customer detail if id is known
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !lead) {
    return (
      <div className="container-fluid py-4 text-center text-white">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <button className="btn btn-outline-light glass-button" onClick={() => navigate('/leads')}>
          <i className="bi bi-arrow-left me-2"></i>Orqaga
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card glass-card">
            <div className="card-body text-center pt-5">
              <div className="avatar-circle bg-primary text-white mx-auto mb-3" style={{width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'}}>
                {(lead.companyName || lead.fullName).charAt(0).toUpperCase()}
              </div>
              <h4 className="text-white mb-1">{lead.companyName || lead.fullName}</h4>
              <p className="text-muted">{lead.fullName !== lead.companyName ? lead.fullName : ''}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-4">
                <span className="badge bg-info">{lead.status}</span>
                <span className="badge bg-secondary">{lead.source}</span>
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary glass-button-primary" onClick={() => setShowModal(true)}>
                  <i className="bi bi-pencil me-2"></i>Tahrirlash
                </button>
                {lead.status !== 'WON' && (
                  <button className="btn btn-success glass-button-success" onClick={() => setShowConvertConfirm(true)}>
                    <i className="bi bi-check-circle me-2"></i>Mijozga aylantirish
                  </button>
                )}
                <button className="btn btn-danger glass-button-danger" onClick={() => setShowConfirm(true)}>
                  <i className="bi bi-trash me-2"></i>O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card glass-card mb-4">
            <div className="card-header border-bottom-0 pt-4 pb-0">
              <h5 className="text-white mb-0">Lid Ma'lumotlari</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="text-muted small">Telefon</div>
                  <div className="text-white fw-bold">{lead.phone}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Email</div>
                  <div className="text-white fw-bold">{lead.email || '-'}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Yaratilgan sana</div>
                  <div className="text-white fw-bold">{lead.createdDate}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Keyingi aloqa</div>
                  <div className="text-white fw-bold text-warning">{lead.nextContactDate || '-'}</div>
                </div>
                <div className="col-12">
                  <div className="text-muted small">Izohlar</div>
                  <div className="text-white p-3 rounded" style={{backgroundColor: 'rgba(0,0,0,0.2)'}}>
                    {lead.notes || 'Izoh yo\'q'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LeadFormModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSave={handleSave} 
        leadToEdit={lead} 
      />

      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          title="Lidni o'chirish"
          message="Haqiqatan ham bu lidni o'chirmoqchimisiz?"
        />
      )}

      {showConvertConfirm && (
        <ConfirmDialog
          isOpen={showConvertConfirm}
          onClose={() => setShowConvertConfirm(false)}
          onConfirm={handleConvert}
          title="Mijozga aylantirish"
          message="Lidni rasmiy mijozlar ro'yxatiga o'tkazmoqchimisiz? Uning statusi 'Yutilgan' bo'ladi."
        />
      )}
    </div>
  );
};

export default LeadDetailPage;

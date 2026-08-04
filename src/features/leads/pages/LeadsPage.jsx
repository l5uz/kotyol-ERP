import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsApi } from '../api/leadsApi';
import LeadsSubNav from '../components/LeadsSubNav';
import LeadsFilterBar from '../components/LeadsFilterBar';
import LeadFormModal from '../components/LeadFormModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('BOARD'); // 'BOARD' or 'LIST'
  const [filter, setFilter] = useState({ search: '', status: '', source: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null });
  const navigate = useNavigate();

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadsApi.getLeads();
      setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSave = async (leadData) => {
    try {
      if (leadToEdit) {
        await leadsApi.updateLead(leadToEdit.id, leadData);
      } else {
        await leadsApi.createLead(leadData);
      }
      setShowModal(false);
      loadLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await leadsApi.deleteLead(id);
      setConfirmDialog({ show: false, id: null });
      loadLeads();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStageUp = async (lead) => {
    const statuses = ['NEW', 'CONTACTED', 'OFFER', 'NEGOTIATION', 'WON'];
    const currentIndex = statuses.indexOf(lead.status);
    if (currentIndex > -1 && currentIndex < statuses.length - 1) {
      try {
        await leadsApi.updateLead(lead.id, { status: statuses[currentIndex + 1] });
        loadLeads();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStageDown = async (lead) => {
    if (lead.status === 'LOST') {
      try {
        await leadsApi.updateLead(lead.id, { status: 'NEGOTIATION' });
        loadLeads();
      } catch (error) {
        console.error(error);
      }
      return;
    }

    const statuses = ['NEW', 'CONTACTED', 'OFFER', 'NEGOTIATION', 'WON'];
    const currentIndex = statuses.indexOf(lead.status);
    if (currentIndex > 0) {
      try {
        await leadsApi.updateLead(lead.id, { status: statuses[currentIndex - 1] });
        loadLeads();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredLeads = leads.filter(l => {
    const searchMatch = (l.fullName?.toLowerCase().includes(filter.search.toLowerCase()) ||
      l.companyName?.toLowerCase().includes(filter.search.toLowerCase()) ||
      l.phone?.includes(filter.search));
    const statusMatch = filter.status ? l.status === filter.status : true;
    const sourceMatch = filter.source ? l.source === filter.source : true;
    return searchMatch && statusMatch && sourceMatch;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const reminders = leads.filter(l => l.nextContactDate === todayStr && l.status !== 'WON' && l.status !== 'LOST');

  const renderBoard = () => {
    const columns = [
      { id: 'NEW', title: 'Yangi' },
      { id: 'CONTACTED', title: "Bog'lanildi" },
      { id: 'OFFER', title: 'Taklif berildi' },
      { id: 'NEGOTIATION', title: 'Muzokara' },
      { id: 'WON', title: 'Yutilgan' },
      { id: 'LOST', title: "Yo'qotilgan" }
    ];

    return (
      <div className="d-flex overflow-auto pb-3 gap-3" style={{ minHeight: '60vh' }}>
        {columns.map(col => (
          <div key={col.id} className="card glass-card flex-shrink-0" style={{ width: '300px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="card-header border-bottom-0 pb-0">
              <h6 className="text-white mb-0">{col.title} ({filteredLeads.filter(l => l.status === col.id).length})</h6>
            </div>
            <div className="card-body d-flex flex-column gap-3">
              {filteredLeads.filter(l => l.status === col.id).map(lead => (
                <div key={lead.id} className="card glass-card-inner p-3 cursor-pointer" onClick={(e) => {
                  if(!e.target.closest('button')) navigate(`/leads/${lead.id}`);
                }}>
                  <div className="fw-bold text-white mb-1">{lead.companyName || lead.fullName}</div>
                  <div className="text-muted small mb-2">{lead.phone}</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="badge bg-primary bg-opacity-50">{lead.source}</span>
                    <div className="btn-group">
                      {col.id !== 'NEW' && (
                        <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={(e) => { e.stopPropagation(); handleStageDown(lead); }} title="Oldingi bosqichga Qaytarish">
                          <i className="bi bi-arrow-left"></i>
                        </button>
                      )}
                      <button className="btn btn-sm btn-outline-light py-0 px-2" onClick={(e) => { e.stopPropagation(); setLeadToEdit(lead); setShowModal(true); }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      {col.id !== 'WON' && col.id !== 'LOST' && (
                        <button className="btn btn-sm btn-outline-success py-0 px-2" onClick={(e) => { e.stopPropagation(); handleStageUp(lead); }} title="Keyingi bosqichga o'tkazish">
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderList = () => (
    <div className="card glass-card">
      <div className="table-responsive">
        <table className="table table-hover table-dark-glass mb-0">
          <thead>
            <tr>
              <th>Mijoz</th>
              <th>Telefon</th>
              <th>Kompaniya</th>
              <th>Status</th>
              <th>Manba</th>
              <th>Keyingi aloqa</th>
              <th className="text-end">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)} style={{cursor: 'pointer'}}>
                <td>{lead.fullName}</td>
                <td>{lead.phone}</td>
                <td>{lead.companyName}</td>
                <td><span className="badge bg-secondary">{lead.status}</span></td>
                <td>{lead.source}</td>
                <td>{lead.nextContactDate || '-'}</td>
                <td className="text-end" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-sm btn-outline-light me-2" onClick={() => { setLeadToEdit(lead); setShowModal(true); }}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDialog({ show: true, id: lead.id })}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <LeadsSubNav />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white mb-0">Lidlar (Potensial Mijozlar)</h2>
        <div className="d-flex gap-2">
          <div className="btn-group">
            <button className={`btn ${viewMode === 'BOARD' ? 'btn-primary glass-button-primary' : 'btn-outline-light glass-button'}`} onClick={() => setViewMode('BOARD')}>
              <i className="bi bi-kanban"></i> Doska
            </button>
            <button className={`btn ${viewMode === 'LIST' ? 'btn-primary glass-button-primary' : 'btn-outline-light glass-button'}`} onClick={() => setViewMode('LIST')}>
              <i className="bi bi-list-task"></i> Ro'yxat
            </button>
          </div>
          <button className="btn btn-primary glass-button-primary" onClick={() => { setLeadToEdit(null); setShowModal(true); }}>
            <i className="bi bi-plus-lg me-2"></i>Yangi Lid
          </button>
        </div>
      </div>

      {reminders.length > 0 && (
        <div className="alert alert-warning bg-warning bg-opacity-25 text-warning border-warning mb-4">
          <i className="bi bi-bell-fill me-2"></i> 
          <strong>Bugun bog'lanish kerak bo'lgan lidlar:</strong> {reminders.map(r => r.companyName || r.fullName).join(', ')}
        </div>
      )}

      <LeadsFilterBar filter={filter} setFilter={setFilter} />

      {loading ? (
        <div className="text-center text-white my-5">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        viewMode === 'BOARD' ? renderBoard() : renderList()
      )}

      <LeadFormModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSave={handleSave} 
        leadToEdit={leadToEdit} 
      />

      {confirmDialog.show && (
        <ConfirmDialog
          isOpen={confirmDialog.show}
          onClose={() => setConfirmDialog({ show: false, id: null })}
          onConfirm={() => handleDelete(confirmDialog.id)}
          title="Lidni o'chirish"
          message="Haqiqatan ham bu lidni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        />
      )}
    </div>
  );
};

export default LeadsPage;

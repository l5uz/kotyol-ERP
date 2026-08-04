import React from 'react';

const LeadsFilterBar = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="card glass-card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <input 
              type="text" 
              className="form-control glass-input" 
              placeholder="Qidirish (Ism, Kompaniya, Telefon)..." 
              name="search"
              value={filter.search || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <select 
              className="form-select glass-input" 
              name="status"
              value={filter.status || ''}
              onChange={handleChange}
            >
              <option value="">Barcha statuslar</option>
              <option value="NEW">Yangi</option>
              <option value="CONTACTED">Bog'lanildi</option>
              <option value="OFFER">Taklif berildi</option>
              <option value="NEGOTIATION">Muzokara</option>
              <option value="WON">Yutilgan</option>
              <option value="LOST">Yo'qotilgan</option>
            </select>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select glass-input" 
              name="source"
              value={filter.source || ''}
              onChange={handleChange}
            >
              <option value="">Barcha manbalar</option>
              <option value="Telegram">Telegram</option>
              <option value="Telefon">Telefon</option>
              <option value="Tavsiya">Tavsiya</option>
              <option value="Facebook">Facebook</option>
              <option value="Boshqa">Boshqa</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsFilterBar;

import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';
import { Button } from '@/components/common/Button/Button';
import { FileUpload } from '@/components/common/FileUpload/FileUpload';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { MOCK_COMPANY_SETTINGS } from '../constants/settings.mock';
import { dynamicSettingsService } from '@/services/dynamicSettings.service';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const CompanySettingsPage = () => {
  const [formData, setFormData] = useState(MOCK_COMPANY_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  const currencyOptions = dynamicSettingsService.getCurrencyOptions();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      notifySuccess("Kompaniya rekvizitlari va sozlamalari saqlandi.");
    }, 400);
  };

  return (
    <div className="company-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <PageHeader
        title="Kompaniya Rekvizitlari va Sozlamalari"
        subtitle="Korxona rasmiy ma'lumotlari, valyutasi va vaqt mintaqasi"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Sozlamalar', path: '/settings' },
          { label: 'Kompaniya' },
        ]}
      />

      <Card title="Kompaniya Profil Sozlamalari">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Input
                label="Kompaniya Rasmiy Nomi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <Input
                label="Telefon Raqami"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <Input
                label="Email Manzili"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-12 col-md-6">
              <Input
                label="Rasmiy Vebsayt"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="col-12">
              <Input
                label="Yuridik va Sex Manzili"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="col-12">
              <label className="form-label fs-7 fw-medium text-main">Korxona Faoliyati Tavsifi</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="col-12 col-md-4">
              <Select
                label="Asosiy Hisob Valyutasi (Dinamik)"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                options={currencyOptions}
              />
            </div>
            <div className="col-12 col-md-4">
              <Select
                label="Vaqt Mintaqasi (Timezone)"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                options={[
                  { value: 'Asia/Tashkent (UTC+5)', label: 'Toshkent (UTC+5)' },
                  { value: 'UTC', label: 'UTC Universal' },
                ]}
              />
            </div>
            <div className="col-12 col-md-4">
              <Select
                label="Sana Formati"
                value={formData.dateFormat}
                onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                options={[
                  { value: 'YYYY-MM-DD', label: '2026-07-20 (YYYY-MM-DD)' },
                  { value: 'DD.MM.YYYY', label: '20.07.2026 (DD.MM.YYYY)' },
                ]}
              />
            </div>
            <div className="col-12">
              <label className="form-label fs-7 fw-medium text-main">Kompaniya Logotipi</label>
              <FileUpload label="Kompaniya logotipini yuklash uchun bosing" maxSizeMB={2} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-top border-custom d-flex justify-content-end">
            <Button type="submit" variant="primary" isLoading={isLoading} icon={ERP_ICONS.CHECK}>
              Sozlamalarni Saqlash
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

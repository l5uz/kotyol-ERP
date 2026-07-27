import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { NumberingConfigCard } from '../components/NumberingConfigCard';
import { systemApi } from '../api/systemApi';
import { usePageAutoRefresh } from '@/hooks/usePageAutoRefresh';

export const SystemPage = () => {
  const [numberingConfigs, setNumberingConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    const numRes = await systemApi.getNumberingConfigs();
    if (numRes.success) setNumberingConfigs(numRes.data);
    setIsLoading(false);
  };

  usePageAutoRefresh(loadSystemData, { intervalMs: 15000 });

  if (isLoading && numberingConfigs.length === 0) {
    return (
      <div className="system-page animate-fade-in pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-page animate-fade-in pb-5">
      <PageHeader
        title="Tizim Boshqaruvi va Administratsiyasi"
        subtitle="ERP dvigateli holati, backend indikatorlari va markaziy sozlamalar"
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Tizim' },
        ]}
      />

      {/* Numbering Configurations Table */}
      <NumberingConfigCard configs={numberingConfigs} />
    </div>
  );
};

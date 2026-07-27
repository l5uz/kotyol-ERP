import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Table } from '@/components/common/Table/Table';
import { LuListOrdered } from 'react-icons/lu';

export const NumberingConfigCard = ({ configs = [] }) => {
  const columns = [
    {
      header: 'Hujjat Turi',
      cell: (row) => <strong className="text-main fs-7">{row.documentType}</strong>,
    },
    {
      header: 'Prefiks',
      cell: (row) => <code className="bg-body-custom px-2 py-1 rounded text-primary">{row.prefix}</code>,
    },
    {
      header: 'Kengaytma',
      cell: (row) => <span className="text-muted-custom">{row.suffix || '—'}</span>,
    },
    {
      header: 'Nomer Uzunligi',
      cell: (row) => <span className="fw-semibold text-main">{row.sequenceLength} xona</span>,
    },
    {
      header: 'Nollash Qoidasi',
      cell: (row) => <span className="badge bg-secondary bg-opacity-10 text-secondary">{row.resetRule}</span>,
    },
    {
      header: 'Hozirgi Ko\'rinish',
      cell: (row) => <strong className="text-success font-mono fs-7">{row.currentPreview}</strong>,
    },
  ];

  return (
    <Card
      title={
        <div className="d-flex align-items-center gap-2">
          <LuListOrdered className="text-primary" />
          <span>Hujjatlarni Nomerlash Sozlamalari va Ko'rinishi</span>
        </div>
      }
    >
      <Table columns={columns} data={configs} tableKey="numbering_configs" />
    </Card>
  );
};

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/common/Card/Card';
import { MOCK_SALES_EXPENSES_CHART } from '../constants/dashboard.mock';

export const SalesExpensesChart = () => {
  return (
    <Card title="Oylik Sotuvlar va Xarajatlar Dinamikasi">
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={MOCK_SALES_EXPENSES_CHART} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--erp-border-color)" />
            <XAxis dataKey="month" stroke="var(--erp-text-muted)" fontSize={12} />
            <YAxis stroke="var(--erp-text-muted)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--erp-bg-card)',
                borderColor: 'var(--erp-border-color)',
                color: 'var(--erp-text-main)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              name="Sotuvlar ($)"
              dataKey="sales"
              stroke="var(--erp-primary)"
              fill="var(--erp-primary-light)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              name="Xarajatlar ($)"
              dataKey="expenses"
              stroke="var(--erp-danger)"
              fill="var(--erp-danger-bg)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

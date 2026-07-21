import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/common/Card/Card';
import { MOCK_PRODUCTION_WAREHOUSE_CHART } from '../constants/dashboard.mock';

export const ProductionWarehouseChart = () => {
  return (
    <Card title="Kategoriyalar Bo'yicha Ishlab Chiqarish va Ombor Zaxiralari">
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={MOCK_PRODUCTION_WAREHOUSE_CHART} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--erp-border-color)" />
            <XAxis dataKey="category" stroke="var(--erp-text-muted)" fontSize={12} />
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
            <Bar name="Ishlab Chiqarilgan (Birlik)" dataKey="production" fill="var(--erp-primary)" radius={[4, 4, 0, 0]} />
            <Bar name="Omborda Mavjud (Birlik)" dataKey="warehouse" fill="var(--erp-info)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

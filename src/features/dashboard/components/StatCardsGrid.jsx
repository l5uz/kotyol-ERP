import React from 'react';
import { StatCard } from '@/components/common/StatCard/StatCard';
import { MOCK_STAT_CARDS } from '../constants/dashboard.mock';

export const StatCardsGrid = () => {
  return (
    <div className="row g-3 mb-4">
      {MOCK_STAT_CARDS.map((stat) => (
        <div key={stat.id} className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title={stat.title}
            value={stat.value}
            trendPercentage={stat.trendPercentage}
            trendLabel={stat.trendLabel}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        </div>
      ))}
    </div>
  );
};

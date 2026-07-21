import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Timeline } from '@/components/common/Timeline/Timeline';
import { MOCK_RECENT_ACTIVITIES } from '../constants/dashboard.mock';

export const RecentActivitiesWidget = () => {
  return (
    <Card title="So'nggi Harakatlar va Operatsiyalar Jurnali">
      <Timeline items={MOCK_RECENT_ACTIVITIES} />
    </Card>
  );
};

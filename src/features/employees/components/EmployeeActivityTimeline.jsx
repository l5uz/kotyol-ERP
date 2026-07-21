import React from 'react';
import { Timeline } from '@/components/common/Timeline/Timeline';

export const EmployeeActivityTimeline = ({ activities = [] }) => {
  const formattedItems = activities.map((act) => ({
    id: act.id,
    title: act.title,
    timestamp: act.timestamp,
    description: `${act.employeeName ? act.employeeName + ' — ' : ''}${act.description}`,
    icon: act.icon,
  }));

  return <Timeline items={formattedItems} />;
};

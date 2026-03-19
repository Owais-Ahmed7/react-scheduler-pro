import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Scheduler } from '../index';
import { SchedulerProps, fieldsType } from '../types';

// Default fields mapping for tests
export const defaultFields: fieldsType = {
  id: '_id',
  subject: 'name',
  start: 'startDate',
  end: 'endDate',
  backgroundColor: 'backgroundColor',
  allDay: 'allDay',
};

// Generate test events
export const createTestEvent = (overrides: Record<string, any> = {}) => {
  const today = new Date();
  return {
    _id: Math.random().toString(36).substr(2, 9),
    name: 'Test Event',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
    backgroundColor: '#0079ff',
    allDay: false,
    ...overrides,
  };
};

// Generate multiple test events
export const createTestEvents = (count: number, baseOverrides: Record<string, any> = {}) => {
  return Array.from({ length: count }, (_, i) => {
    const today = new Date();
    return createTestEvent({
      _id: `event-${i}`,
      name: `Event ${i + 1}`,
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + Math.floor(i / 3), 9 + (i % 4), 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + Math.floor(i / 3), 10 + (i % 4), 0),
      ...baseOverrides,
    });
  });
};

// Create test resources
export const createTestResources = () => [
  { resourceId: 1, title: 'Room A', backgroundColor: '#ff6b6b' },
  { resourceId: 2, title: 'Room B', backgroundColor: '#4ecdc4' },
  { resourceId: 3, title: 'Room C', backgroundColor: '#45b7d1' },
];

// Default scheduler props
export const defaultSchedulerProps: SchedulerProps = {
  events: [],
  fields: defaultFields,
  view: 'week',
  views: ['day', 'week', 'month', 'workweek'],
  selectedDate: new Date(),
  startHour: 0,
  endHour: 23,
  step: 60,
  hourFormat: 12,
};

// Render Scheduler with test defaults
export const renderScheduler = (
  props: Partial<SchedulerProps> = {},
  options?: RenderOptions
) => {
  const mergedProps = { ...defaultSchedulerProps, ...props };
  return render(<Scheduler {...mergedProps} />, options);
};

// Helper to create a multi-day event
export const createMultiDayEvent = (daysSpan: number = 3) => {
  const today = new Date();
  return createTestEvent({
    name: 'Multi-day Event',
    startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysSpan, 15, 0),
    allDay: true,
  });
};

// Helper to create overlapping events
export const createOverlappingEvents = () => {
  const today = new Date();
  return [
    createTestEvent({
      _id: 'overlap-1',
      name: 'Overlap 1',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
    }),
    createTestEvent({
      _id: 'overlap-2',
      name: 'Overlap 2',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
    }),
    createTestEvent({
      _id: 'overlap-3',
      name: 'Overlap 3',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
    }),
  ];
};

// Wait for async operations
export const waitForScheduler = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

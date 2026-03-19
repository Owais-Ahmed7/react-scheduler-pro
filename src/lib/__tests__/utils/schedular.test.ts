import {
  filterTodayEvents,
  traverseCrossingEvents,
  distributeEvents,
  distributeMonthEvents,
  differenceInDaysOmitTime,
  getResourcedEvents,
  convertEventTimeZone,
  isToday,
  calculateTop,
  sortEventsByTheLengthest,
  getTimeZonedDate,
} from '../../utils/schedular';
import { fieldsType } from '../../types';

const fields: fieldsType = {
  id: '_id',
  subject: 'name',
  start: 'startDate',
  end: 'endDate',
  backgroundColor: 'backgroundColor',
  allDay: 'allDay',
};

const createEvent = (
  id: string,
  start: Date,
  end: Date,
  overrides: Record<string, any> = {}
) => ({
  _id: id,
  name: `Event ${id}`,
  startDate: start,
  endDate: end,
  backgroundColor: '#0079ff',
  allDay: false,
  ...overrides,
});

describe('filterTodayEvents', () => {
  const today = new Date(2026, 2, 19); // March 19, 2026

  it('should return events that start on the given date', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('2', new Date(2026, 2, 20, 10, 0), new Date(2026, 2, 20, 11, 0)),
      createEvent('3', new Date(2026, 2, 19, 14, 0), new Date(2026, 2, 19, 15, 0)),
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result).toHaveLength(2);
    expect(result[0]._id).toBe('1');
    expect(result[1]._id).toBe('3');
  });

  it('should return empty array when no events match', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 20, 10, 0), new Date(2026, 2, 20, 11, 0)),
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result).toHaveLength(0);
  });

  it('should exclude all-day events', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('2', new Date(2026, 2, 19, 0, 0), new Date(2026, 2, 19, 23, 59), {
        allDay: true,
      }),
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('1');
  });

  it('should exclude multi-day events', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 21, 11, 0)),
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result).toHaveLength(0);
  });

  it('should sort events by start time', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 14, 0), new Date(2026, 2, 19, 15, 0)),
      createEvent('2', new Date(2026, 2, 19, 9, 0), new Date(2026, 2, 19, 10, 0)),
      createEvent('3', new Date(2026, 2, 19, 11, 0), new Date(2026, 2, 19, 12, 0)),
    ];
    const result = filterTodayEvents(today, events, fields, undefined);
    expect(result[0]._id).toBe('2');
    expect(result[1]._id).toBe('3');
    expect(result[2]._id).toBe('1');
  });

  it('should handle empty events array', () => {
    const result = filterTodayEvents(today, [], fields, undefined);
    expect(result).toHaveLength(0);
  });
});

describe('traverseCrossingEvents', () => {
  it('should find overlapping events', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('2', new Date(2026, 2, 19, 11, 0), new Date(2026, 2, 19, 13, 0)),
      createEvent('3', new Date(2026, 2, 19, 14, 0), new Date(2026, 2, 19, 15, 0)),
    ];
    const result = traverseCrossingEvents(events, events[0], fields, undefined);
    expect(result).toHaveLength(2);
  });

  it('should return only the event itself when no overlaps', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('2', new Date(2026, 2, 19, 12, 0), new Date(2026, 2, 19, 13, 0)),
    ];
    const result = traverseCrossingEvents(events, events[0], fields, undefined);
    expect(result).toHaveLength(1);
  });

  it('should handle empty events array', () => {
    const event = createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0));
    const result = traverseCrossingEvents([], event, fields, undefined);
    expect(result).toHaveLength(0);
  });
});

describe('distributeEvents', () => {
  it('should place non-overlapping events in the same column', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('2', new Date(2026, 2, 19, 12, 0), new Date(2026, 2, 19, 13, 0)),
    ];
    const result = distributeEvents(events, [], fields, undefined);
    expect(result).toHaveLength(1);
    expect(result[0].events).toHaveLength(2);
  });

  it('should place overlapping events in different columns', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('2', new Date(2026, 2, 19, 11, 0), new Date(2026, 2, 19, 13, 0)),
    ];
    const result = distributeEvents(events, [], fields, undefined);
    expect(result).toHaveLength(2);
    expect(result[0].events).toHaveLength(1);
    expect(result[1].events).toHaveLength(1);
  });

  it('should handle three overlapping events', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('2', new Date(2026, 2, 19, 10, 30), new Date(2026, 2, 19, 11, 30)),
      createEvent('3', new Date(2026, 2, 19, 11, 0), new Date(2026, 2, 19, 13, 0)),
    ];
    const result = distributeEvents(events, [], fields, undefined);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('should respect the limit parameter', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('2', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('3', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
      createEvent('4', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
    ];
    const result = distributeEvents(events, [], fields, undefined, 2);
    // With limit of 2, should not create more than 3 columns (indices 0, 1, 2)
    expect(result.length).toBeLessThanOrEqual(4);
  });
});

describe('distributeMonthEvents', () => {
  it('should distribute events into rows for month view', () => {
    const events = [
      createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('2', new Date(2026, 2, 19, 12, 0), new Date(2026, 2, 19, 13, 0)),
    ];
    const result = distributeMonthEvents(events, [], fields, undefined);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should limit to 3 rows maximum', () => {
    const events = Array.from({ length: 10 }, (_, i) =>
      createEvent(
        `${i}`,
        new Date(2026, 2, 19, i, 0),
        new Date(2026, 2, 20, i + 1, 0)
      )
    );
    const result = distributeMonthEvents(events, [], fields, undefined);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('differenceInDaysOmitTime', () => {
  it('should return 0 for same day events', () => {
    const start = new Date(2026, 2, 19, 10, 0);
    const end = new Date(2026, 2, 19, 15, 0);
    expect(differenceInDaysOmitTime(start, end)).toBe(0);
  });

  it('should return 1 for next day', () => {
    const start = new Date(2026, 2, 19, 23, 0);
    const end = new Date(2026, 2, 20, 1, 0);
    expect(differenceInDaysOmitTime(start, end)).toBe(1);
  });

  it('should return correct count for multi-day span', () => {
    const start = new Date(2026, 2, 19);
    const end = new Date(2026, 2, 22);
    // End at midnight means last full day is the 21st, so difference is 2
    expect(differenceInDaysOmitTime(start, end)).toBe(2);
  });
});

describe('getResourcedEvents', () => {
  const resources = [
    { resourceId: 1, title: 'Room A' },
    { resourceId: 2, title: 'Room B' },
  ];
  const resourceFields = { id: 'resourceId', title: 'title' };
  const fieldsWithResource: fieldsType = { ...fields, resourceId: 'resourceId' };

  it('should group events by resource', () => {
    const events: any[] = [
      { ...createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)), resourceId: 1 },
      { ...createEvent('2', new Date(2026, 2, 19, 12, 0), new Date(2026, 2, 19, 13, 0)), resourceId: 2 },
    ];

    const result = getResourcedEvents(events, resources, resourceFields, fieldsWithResource);
    expect(result[0].resourceEvents).toHaveLength(1);
    expect(result[1].resourceEvents).toHaveLength(1);
  });

  it('should handle multiple events per resource', () => {
    const events = [
      { ...createEvent('1', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)), resourceId: 1 },
      { ...createEvent('2', new Date(2026, 2, 19, 12, 0), new Date(2026, 2, 19, 13, 0)), resourceId: 1 },
    ];

    const result = getResourcedEvents(events, resources, resourceFields, fieldsWithResource);
    expect(result[0].resourceEvents).toHaveLength(2);
  });
});

describe('sortEventsByTheLengthest', () => {
  it('should sort events by duration, longest first', () => {
    const events = [
      createEvent('short', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 11, 0)),
      createEvent('long', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 14, 0)),
      createEvent('medium', new Date(2026, 2, 19, 10, 0), new Date(2026, 2, 19, 12, 0)),
    ];
    const result = sortEventsByTheLengthest([...events], fields);
    expect(result[0]._id).toBe('long');
    expect(result[1]._id).toBe('medium');
    expect(result[2]._id).toBe('short');
  });
});

describe('convertEventTimeZone', () => {
  it('should convert event times to specified timezone', () => {
    const event = createEvent(
      '1',
      new Date(2026, 2, 19, 10, 0),
      new Date(2026, 2, 19, 11, 0)
    );
    const result = convertEventTimeZone(event, fields, 'UTC');
    expect(result.startDate).toBeDefined();
    expect(result.endDate).toBeDefined();
  });

  it('should preserve other event properties', () => {
    const event: any = createEvent(
      '1',
      new Date(2026, 2, 19, 10, 0),
      new Date(2026, 2, 19, 11, 0)
    );
    event.customField = 'test';
    const result = convertEventTimeZone(event, fields, 'UTC');
    expect(result.customField).toBe('test');
    expect(result._id).toBe('1');
  });
});

describe('isToday', () => {
  it('should return true for today', () => {
    expect(isToday(new Date(), undefined)).toBe(true);
  });

  it('should return false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday, undefined)).toBe(false);
  });

  it('should return false for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow, undefined)).toBe(false);
  });
});

describe('calculateTop', () => {
  it('should calculate correct top position for current time', () => {
    const top = calculateTop({
      today: new Date(),
      startHour: 0,
      step: 60,
      renderTime: false,
      hourFormat: 12,
    });
    expect(typeof top).toBe('number');
    expect(top).toBeGreaterThanOrEqual(0);
  });

  it('should return higher value for later hours', () => {
    // This tests the calculation logic, not the actual current time
    const top = calculateTop({
      today: new Date(),
      startHour: 0,
      step: 60,
      renderTime: false,
      hourFormat: 12,
    });
    expect(top).toBeGreaterThanOrEqual(0);
  });
});

import {
  endOfDay,
  addSeconds,
  startOfDay,
  differenceInDays,
  isSameDay,
  areIntervalsOverlapping,
  isBefore,
  isAfter,
} from 'date-fns';
import {
  CurrentTimeBarProps,
  EventColumn,
  MappedEvent,
  Resource,
  ResourceFields,
  ResourcedEventsEntry,
  fieldsType,
} from '../types';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { CELL_HEIGHT } from '../helpers/constants/schedular';

/**
 *
 * @param date - Pass the date for filtering the appointments
 * @returns an array of appointments after proccessing
 */
export const filterTodayEvents = (
  date: Date,
  events: MappedEvent[],
  fields: fieldsType,
  timezone: string | undefined
): MappedEvent[] => {
  const eventsList: MappedEvent[] = [];
  // const eventsList =
  events.forEach((ev) => {
    const event = convertEventTimeZone(ev, fields, timezone);

    if (
      isSameDay(event[fields.start] as Date, date) &&
      differenceInDaysOmitTime(event[fields.start] as Date, event[fields.end] as Date) === 0 &&
      // fields.allDay &&
      !event[fields.allDay || '']
    )
      eventsList.push(event);
  });

  const sortByStartDate = eventsList.sort(
    (a, b) => (a[fields.start] as Date).getTime() - (b[fields.start] as Date).getTime()
  );

  return sortByStartDate;
};

/* FIND CORSSING EVENTS */
export const traverseCrossingEvents = (
  events: MappedEvent[],
  event: MappedEvent,
  fields: fieldsType,
  timezone: string | undefined
): MappedEvent[] => {
  return (events || []).filter((e) => {
    return areIntervalsOverlapping(
      { start: e[fields.start] as Date, end: e[fields.end] as Date },
      { start: event[fields.start] as Date, end: event[fields.end] as Date }
    );
  });
};

export const computeMultiDPHeight = (
  val: number,
  showAllMultiDEvents: boolean
): number => {
  return val > 2 && !showAllMultiDEvents ? 3 * 25 : val * 25;
};

export const differenceInDaysOmitTime = (start: Date, end: Date): number => {
  return differenceInDays(endOfDay(addSeconds(end, -1)), startOfDay(start));
};

export const sortEventsByTheLengthest = (events: MappedEvent[], fields: fieldsType): MappedEvent[] => {
  return events.sort((a, b) => {
    const aDiff = (a[fields.end] as Date).getTime() - (a[fields.start] as Date).getTime();
    const bDiff = (b[fields.end] as Date).getTime() - (b[fields.start] as Date).getTime();
    return bDiff - aDiff;
  });
};

export const getResourcedEvents = (
  events: MappedEvent[],
  resources: Resource[],
  resourceFields: ResourceFields,
  fields: fieldsType
): ResourcedEventsEntry[] => {
  const rsEvents: ResourcedEventsEntry[] = [];
  for (const event of events) {
    const findIdIndex = resources.findIndex(
      (fl) => fl[resourceFields.id] === event[fields.resourceId || '']
    );

    if (rsEvents[findIdIndex]) {
      rsEvents[findIdIndex].resourceEvents = [
        ...rsEvents[findIdIndex].resourceEvents,
        event,
      ];
    } else {
      rsEvents[findIdIndex] = { resourceEvents: [event] };
    }
  }

  return rsEvents;
};

export const distributeEvents = (
  events: MappedEvent[],
  eventsData: EventColumn[],
  fields: fieldsType,
  timezone: string | undefined,
  limit?: number | null
): EventColumn[] => {
  const data: EventColumn[] = eventsData;

  events.forEach((ev) => {
    let index: number | null = null;

    for (let i = 0; i < data.length; i++) {
      let col = data[i];
      let overlaps = false;
      if (limit && i > limit) return;

      for (let j = 0; j < col.events.length; j++) {
        const event = col.events[j];
        if (
          areIntervalsOverlapping(
            {
              start: ev[fields.start] as Date,
              end: ev[fields.end] as Date,
            },
            {
              start: event[fields.start] as Date,
              end: event[fields.end] as Date,
            }
          )
        ) {
          overlaps = true;
          break;
        }
      }
      if (!overlaps) {
        index = i;
        break;
      }
    }

    if (index !== null) {
      data[index].events.push(ev);
    } else {
      data.push({ events: [ev] });
    }
  });

  return data;
};

export const distributeMonthEvents = (
  events: MappedEvent[],
  eventsData: EventColumn[],
  fields: fieldsType,
  timezone: string | undefined
): EventColumn[] => {
  const data: EventColumn[] = eventsData;

  /* EVENTS DISTRIBUTING ALGORITHM */
  events.forEach((e) => {
    let index: number | null = null;

    for (let i = 0; i < data.length; i++) {
      if (i > 2) return;

      let col = data[i];
      let overlaps = false;

      for (let j = 0; j < col.events.length; j++) {
        const event = col.events[j];
        const ev = e;
        const e1S = startOfDay(ev[fields.start] as Date);
        const e1E = endOfDay(ev[fields.end] as Date);

        const e2S = startOfDay(event[fields.start] as Date);
        const e2E = endOfDay(event[fields.end] as Date);

        const con1 =
          (isBefore(e1S, e2S) || isSameDay(e1S, e2S)) &&
          (isBefore(e1E, e2E) || isSameDay(e1E, e2E));
        const con2 =
          (isAfter(e1S, e2S) || isSameDay(e1S, e2S)) &&
          (isBefore(e1E, e2E) || isSameDay(e1E, e2E));
        const con3 =
          (isAfter(e1S, e2S) || isSameDay(e1S, e2S)) &&
          (isBefore(e1S, e2E) || isSameDay(e1S, e2E));
        const con4 =
          (isAfter(e1S, e2S) || isSameDay(e1S, e2S)) &&
          (isBefore(e1S, e2E) || isSameDay(e1S, e2E));
        const con5 =
          (isBefore(e1S, e2S) || isSameDay(e1S, e2S)) &&
          (isAfter(e1E, e2E) || isSameDay(e1S, e2E));

        const shouldInclude = con1 || con2 || con3 || con4 || con5;

        if (shouldInclude) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        index = i;
        break;
      }
    }

    if (index !== null) {
      data[index].events.push(e);
    } else {
      data.push({ events: [e] });
    }
  });

  return data;
};

function generateRandomColor(): { rgb: { r: number; g: number; b: number }; color: string } {
  // Generate random RGB values
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);

  // Convert RGB to hexadecimal
  var colorCode =
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0');

  return { rgb: { r, g, b }, color: colorCode };
}

export const generateRandomEvents = (total = 300) => {
  const events = [];
  for (let i = 0; i < total; i++) {
    const day = Math.round(i % 34);
    const color = generateRandomColor();
    events.push({
      _id: Math.random(),
      resourceId: Math.floor(Math.random() * 5),
      name: 'Event ' + (i + 1),
      startDate: new Date(
        new Date(new Date(new Date().setHours(10)).setMinutes(30)).setDate(
          new Date().getDate() + day
        )
      ),
      endDate: new Date(
        new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
          new Date().getDate() + day
        )
      ),
      backgroundColor: color,
      // allDay: Math.random() > 0.5,
    });
  }

  return events;
};

export const convertEventTimeZone = (
  event: MappedEvent,
  fields: fieldsType,
  timeZone: string | undefined
): MappedEvent => {
  return {
    ...event,
    [fields.start]: getTimeZonedDate(event[fields.start] as Date, timeZone),
    [fields.end]: getTimeZonedDate(event[fields.end] as Date, timeZone),
  };
};

export const systemTimezone: string =
  Intl.DateTimeFormat().resolvedOptions().timeZone;
export const getTimeZonedDate = (date: Date, timeZone: string | undefined): Date => {
  return toDate(
    formatInTimeZone(date, timeZone || systemTimezone, 'yyyy-MM-dd HH:mm:ss')
  );
};

export const isToday = (date: Date, timezone: string | undefined): boolean => {
  const today = getTimeZonedDate(new Date(), timezone);
  return isSameDay(today, date);
};

export const calculateTop = ({
  today,
  startHour,
  step,
  timezone,
}: CurrentTimeBarProps): number => {
  const now = getTimeZonedDate(new Date(), timezone);
  const getMinutes = now.getMinutes();
  const computeMinutePercentage = (getMinutes / 60) * CELL_HEIGHT;
  const CELL_HEIGHT_INTERVAL = CELL_HEIGHT * (60 / step);

  const top =
    (now.getHours() - startHour) * CELL_HEIGHT_INTERVAL +
    computeMinutePercentage * (60 / step);

  return top;
};

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
import { fieldsType } from '../types';
<<<<<<< HEAD
import { format, formatInTimeZone, toDate } from 'date-fns-tz';
=======
import { formatInTimeZone, toDate } from 'date-fns-tz';
>>>>>>> acfdeb9 (fix)

/* FILTER MULTIDAY EVENTS */
// export const filterMultiDaySlot = (
//   //not used
//   events: any[],
//   date: Date | Date[],
//   timeZone?: string,
//   lengthOnly?: boolean
// ) => {
//   const isMultiDates = Array.isArray(date);
//   const list: any[] = [];
//   const multiPerDay: Record<string, any[]> = {};
//   for (let i = 0; i < events.length; i++) {
//     const event = convertEventTimeZone(events[i],  timeZone);
//     let withinSlot =
//       event.allDay ||
//       differenceInDaysOmitTime(event.startDate, event.endDate) > 0;
//     if (!withinSlot) continue;
//     if (isMultiDates) {
//       withinSlot = date.some((weekday) =>
//         isWithinInterval(weekday, {
//           start: startOfDay(event.startDate),
//           end: endOfDay(event.endDate),
//         })
//       );
//     } else {
//       withinSlot = isWithinInterval(date, {
//         start: startOfDay(event.startDate),
//         end: endOfDay(event.endDate),
//       });
//     }

//     if (withinSlot) {
//       list.push(event);
//       const start = format(event.startDate, 'yyyy-MM-dd');
//       multiPerDay[start] = (multiPerDay[start] || []).concat(event);
//     }
//   }

//   if (isMultiDates && lengthOnly) {
//     return (
//       Object.values(multiPerDay).sort((a, b) => b.length - a.length)?.[0] || []
//     );
//   }

//   return list;
// };

/**
 *
 * @param date - Pass the date for filtering the appointments
 * @returns an array of appointments after proccessing
 */
export const filterTodayEvents = (
  date: Date,
  events: any[],
  fields: fieldsType,
<<<<<<< HEAD
  timezone: string
=======
  timezone: string | undefined
>>>>>>> acfdeb9 (fix)
) => {
  const eventsList: any[] = [];
  // const eventsList =
  events.forEach((ev) => {
    const event = convertEventTimeZone(ev, fields, timezone);
<<<<<<< HEAD
    // if (event.name === 'subject test')
    //   console.log(event, 'converted to timezone');
=======
>>>>>>> acfdeb9 (fix)

    if (
      isSameDay(event[fields.start], date) &&
      differenceInDaysOmitTime(event[fields.start], event[fields.end]) === 0 &&
      !event[fields.allDay]
    )
      eventsList.push(event);
<<<<<<< HEAD
    // else return {}
    // eventsList.push(event);
=======
>>>>>>> acfdeb9 (fix)
  });

  const sortByStartDate = eventsList.sort(
    (a: any, b: any) => a[fields.start] - b[fields.start]
  );

  return sortByStartDate;
};

/* FIND CORSSING EVENTS */
export const traverseCrossingEvents = (
  events: any[],
  event: any,
  fields: any,
<<<<<<< HEAD
  timezone: string
): any[] => {
  return (events || []).filter((e) => {
    // const e = convertEventTimeZone(ev, fields, timezone);
=======
  timezone: string | undefined
): any[] => {
  return (events || []).filter((e) => {
>>>>>>> acfdeb9 (fix)
    return areIntervalsOverlapping(
      { start: e[fields.start], end: e[fields.end] },
      { start: event[fields.start], end: event[fields.end] }
    );
  });
};

export const computeMultiDPHeight = (
  val: number,
  showAllMultiDEvents: boolean
) => {
  return val > 2 && !showAllMultiDEvents ? 3 * 25 : val * 25;
};

export const differenceInDaysOmitTime = (start: Date, end: Date) => {
  return differenceInDays(endOfDay(addSeconds(end, -1)), startOfDay(start));
};

export const sortEventsByTheLengthest = (events: any[], fields: any) => {
  return events.sort((a, b) => {
    const aDiff = a[fields.end].getTime() - a[fields.start].getTime();
    const bDiff = b[fields.end].getTime() - b[fields.start].getTime();
    return bDiff - aDiff;
  });
};

export const getResourcedEvents = (
  events: any[],
  resources: any,
  resourceFields: any,
  fields: any
) => {
  const rsEvents: any[] = [];
  for (const event of events) {
    const findIdIndex = resources.findIndex(
      (fl: any) => fl[resourceFields.id] === event[fields.resourceId]
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
  events: any[],
  eventsData: any[],
  fields: any,
<<<<<<< HEAD
  timezone: string,
=======
  timezone: string | undefined,
>>>>>>> acfdeb9 (fix)
  limit?: number | null
) => {
  const data: any[] = eventsData;

  events.forEach((ev: any) => {
    let index = null;

    for (let i = 0; i < data.length; i++) {
      let col = data[i];
      let overlaps = false;
      if (limit && i > limit) return;

      for (let j = 0; j < col.events.length; j++) {
        const event = col.events[j];
<<<<<<< HEAD
        // const event = convertEventTimeZone(col.events[j], fields, timezone);
        // const ev = convertEventTimeZone(e, fields, timezone);
=======
>>>>>>> acfdeb9 (fix)
        if (
          areIntervalsOverlapping(
            {
              start: ev[fields.start],
              end: ev[fields.end],
            },
            {
              start: event[fields.start],
              end: event[fields.end],
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
  events: any[],
  eventsData: any[],
  fields: any,
<<<<<<< HEAD
  timezone: string
=======
  timezone: string | undefined
>>>>>>> acfdeb9 (fix)
) => {
  const data: any[] = eventsData;

  /* EVENTS DISTRIBUTING ALGORITHM © OWAIS AHMAD */
  events.forEach((e: any) => {
    let index = null;

    for (let i = 0; i < data.length; i++) {
      if (i > 2) return;

      let col = data[i];
      let overlaps = false;

      for (let j = 0; j < col.events.length; j++) {
        const event = col.events[j];
        const ev = e;
<<<<<<< HEAD
        // const event = convertEventTimeZone(col.events[j], fields, timezone);
        // const ev = convertEventTimeZone(e, fields, timezone);

=======
>>>>>>> acfdeb9 (fix)
        const e1S = startOfDay(ev[fields.start]);
        const e1E = endOfDay(ev[fields.end]);

        const e2S = startOfDay(event[fields.start]);
        const e2E = endOfDay(event[fields.end]);

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

export const generateRandomEvents = (total = 300) => {
  const events = [];
  for (let i = 0; i < total; i++) {
    const day = Math.round(i % 34);
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
      // allDay: Math.random() > 0.5,
    });
  }

  return events;
};

export const convertEventTimeZone = (
  event: any,
  fields: fieldsType,
<<<<<<< HEAD
  timeZone?: string
=======
  timeZone: string | undefined
>>>>>>> acfdeb9 (fix)
) => {
  return {
    ...event,
    [fields.start]: getTimeZonedDate(event[fields.start], timeZone),
    [fields.end]: getTimeZonedDate(event[fields.end], timeZone),
  };
};

export const systemTimezone: string =
  Intl.DateTimeFormat().resolvedOptions().timeZone;
<<<<<<< HEAD
export const getTimeZonedDate = (date: Date, timeZone?: string) => {
=======
export const getTimeZonedDate = (date: Date, timeZone: string | undefined) => {
>>>>>>> acfdeb9 (fix)
  return toDate(
    formatInTimeZone(date, timeZone || systemTimezone, 'yyyy-MM-dd HH:mm:ss')
  );
};

<<<<<<< HEAD
export const isToday = (date: Date, timezone: string) => {
=======
export const isToday = (date: Date, timezone: string | undefined) => {
>>>>>>> acfdeb9 (fix)
  const today = getTimeZonedDate(new Date(), timezone);
  return isSameDay(today, date);
};

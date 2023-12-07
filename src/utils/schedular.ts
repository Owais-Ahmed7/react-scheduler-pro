import {
  format,
  addDays,
  subDays,
  startOfWeek,
  eachDayOfInterval,
  isEqual,
  isWithinInterval,
  addMinutes,
  endOfDay,
  addSeconds,
  startOfDay,
  differenceInDays,
  isSameDay,
} from 'date-fns';

/* LAYOUTS HELPERS */
const getMonthDates = (trackMonth: Date, actionType: string): Date[] => {
  let getSunday = startOfWeek(trackMonth, { weekStartsOn: 0 });

  const dates =
    actionType === 'init' || actionType === 'next'
      ? eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 41) })
      : eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 41) });

  return dates;
};

const getWeekDates = (currentDate: Date, actionType: string): Date[] => {
  let getSunday = startOfWeek(currentDate, { weekStartsOn: 0 });

  const dates =
    actionType === 'init' || actionType === 'next'
      ? eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 6) })
      : eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 6) });

  return dates;
};

const getDay = (currentDate: Date, actionType: string): Date => {
  const date =
    actionType === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);

  return date;
};
/* LAYOUTS HELPERS */

/* FILTER MULTIDAY EVENTS */
export const filterMultiDaySlot = (
  events: any[],
  date: Date | Date[],
  timeZone?: string,
  lengthOnly?: boolean
) => {
  const isMultiDates = Array.isArray(date);
  const list: any[] = [];
  const multiPerDay: Record<string, any[]> = {};
  for (let i = 0; i < events.length; i++) {
    // const event = convertEventTimeZone(events[i], timeZone);
    const event = events[i];
    let withinSlot =
      event.allDay ||
      differenceInDaysOmitTime(event.startDate, event.endDate) > 0;
    if (!withinSlot) continue;
    if (isMultiDates) {
      withinSlot = date.some((weekday) =>
        isWithinInterval(weekday, {
          start: startOfDay(event.startDate),
          end: endOfDay(event.endDate),
        })
      );
    } else {
      withinSlot = isWithinInterval(date, {
        start: startOfDay(event.startDate),
        end: endOfDay(event.endDate),
      });
    }

    if (withinSlot) {
      list.push(event);
      const start = format(event.startDate, 'yyyy-MM-dd');
      multiPerDay[start] = (multiPerDay[start] || []).concat(event);
    }
  }

  if (isMultiDates && lengthOnly) {
    return (
      Object.values(multiPerDay).sort((a, b) => b.length - a.length)?.[0] || []
    );
  }

  return list;
};

/* FIND CORSSING EVENTS */
const traverseCrossingEvents = (events: any[], event: any): any[] => {
  // { date, name }  [ { date, name } ]
  return (events || []).filter((e) => {
    // console.table(format(event.startDate, 'dd MMMM yyyy h:mm a'));
    // console.table(format(e.startDate, 'dd MMMM yyyy h:mm a'));

    return (
      // event.id !== e.id &&
      isWithinInterval(addMinutes(event.startDate, 1), {
        start: e.startDate,
        end: e.endDate,
      }) ||
      isWithinInterval(addMinutes(event.endDate, -1), {
        start: e.startDate,
        end: e.endDate,
      }) ||
      isWithinInterval(addMinutes(e.startDate, 1), {
        start: event.startDate,
        end: event.endDate,
      }) ||
      isWithinInterval(addMinutes(e.endDate, -1), {
        start: event.startDate,
        end: event.endDate,
      })
    );
  });
};

/* COMPARE AND FIND EVENT CORSSING EVENTS WITH EACH OTHER */
const compareEventCrossingEvents = (events: any[], event: any) => {
  const crossingEvents: any[] = [event];

  const newEvents = events.filter((e) => e.id !== event.id);

  newEvents.forEach((e, i) => {
    newEvents.slice(i + 1, newEvents.length).forEach((ev) => {
      const check = isWithinInterval(ev.startDate, {
        start: e.startDate,
        end: e.endDate,
      });

      const chkEvent1 = crossingEvents.find((val) => val.id === e.id);
      const chkEvent2 = crossingEvents.find((val) => val.id === ev.id);
      if (check) {
        if (chkEvent1 ? false : true) crossingEvents.push(e);
        if (chkEvent2 ? false : true) crossingEvents.push(ev);
      }
    });
  });

  return crossingEvents;
};

const differenceInDaysOmitTime = (start: Date, end: Date) => {
  return differenceInDays(endOfDay(addSeconds(end, -1)), startOfDay(start));
};

const monthCrossingEvents = (events: any[], event: any) => {
  return events.map((e) => {
    return isSameDay(new Date(e.startDate), new Date(event.startDate));
  });
};

export const sortEventsByTheLengthest = (events: any[]) => {
  return events.sort((a, b) => {
    const aDiff = a.endDate.getTime() - a.startDate.getTime();
    const bDiff = b.endDate.getTime() - b.startDate.getTime();
    return bDiff - aDiff;
  });
};

// export const traversCrossingEvents = (
//   todayEvents: ProcessedEvent[],
//   event: ProcessedEvent
// ): ProcessedEvent[] => {
//   return todayEvents.filter(
//     (e) =>
//       e.event_id !== event.event_id &&
//       (isWithinInterval(addMinutes(event.start, 1), {
//         start: e.start,
//         end: e.end,
//       }) ||
//         isWithinInterval(addMinutes(event.end, -1), {
//           start: e.start,
//           end: e.end,
//         }) ||
//         isWithinInterval(addMinutes(e.start, 1), {
//           start: event.start,
//           end: event.end,
//         }) ||
//         isWithinInterval(addMinutes(e.end, -1), {
//           start: event.start,
//           end: event.end,
//         }))
//   );
// };

export {
  getMonthDates,
  getWeekDates,
  getDay,
  traverseCrossingEvents,
  compareEventCrossingEvents,
  differenceInDaysOmitTime,
  monthCrossingEvents,
};

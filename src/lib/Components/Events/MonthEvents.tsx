import React, { useMemo } from 'react';
import {
  convertEventTimeZone,
  differenceInDaysOmitTime,
} from '../../utils/schedular';
import enUS from 'date-fns/locale/en-US';
import {
  Locale,
  closestTo,
  differenceInCalendarWeeks,
  differenceInDays,
  isBefore,
  startOfWeek,
} from 'date-fns';
import EventItem from './EventItem';
import useStore from '../../hooks/useStore';
import { resourceType } from '../../types';

interface Props {
  events: any[];
  allEvents: any[];
  resource?: resourceType;
  eventsIndexes: any[];
  cellWidth: number;
  today: Date;
  dayIndex: number;
  startDay: Date;
  eachWeekStart: Date[];
  prevNextEvents: any[];
  eachFirstDayInCalcRow: Date | null;
  daysList: Date[];
}

const MonthEvents: React.FC<Props> = ({
  events,
  allEvents,
  resource,
  eventsIndexes,
  cellWidth,
  today,
  dayIndex,
  startDay,
  prevNextEvents,
  eachWeekStart,
  eachFirstDayInCalcRow,
  daysList,
}) => {
  const { fields, timezone }: any = useStore();

  const renderEvents = useMemo(() => {
    return events.slice(0, 3).map((ev, idx) => {
      // const event = convertEventTimeZone(ev, fields, timezone);
      const event = ev;
      const fromPrevWeek =
        !!eachFirstDayInCalcRow &&
        isBefore(event[fields.start], eachFirstDayInCalcRow);
      const start =
        fromPrevWeek && eachFirstDayInCalcRow
          ? eachFirstDayInCalcRow
          : event[fields.start];

      const toNextWeek =
        differenceInCalendarWeeks(new Date(event[fields.end]), start, {
          weekStartsOn: 0,
          locale: enUS as unknown as Locale & { customProperty: string },
        }) > 0;

      let eventLength =
        differenceInDaysOmitTime(start, new Date(event[fields.end])) + 1;

      if (toNextWeek) {
        // Rethink it
        const NotAccurateWeekStart = startOfWeek(event[fields.start]);
        const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
        if (closestStart) {
          eventLength =
            daysList.length -
            (!eachFirstDayInCalcRow
              ? differenceInDays(event[fields.start], closestStart)
              : 0);
        }
      }

      const slicedEvents = prevNextEvents?.slice(0, 3);

      if (!slicedEvents.find((val) => val[fields.id] === event[fields.id]))
        return <></>;

      let topFactor = 0;
      for (let i = 0; i < eventsIndexes.length; i++) {
        const eventInColumn = eventsIndexes[i].events.find(
          (e: any) => e[fields.id] === event[fields.id]
        );

        if (i > 2) break;

        if (eventInColumn) {
          topFactor = i;
          break;
        }
      }
      const top = topFactor * 20;

      return (
        <EventItem
          key={idx}
          idx={idx}
          resource={resource}
          className="text-white position-absolute"
          hasPrevious={fromPrevWeek}
          hasNext={toNextWeek}
          event={event}
          timeFormat="dd MMM yyyy hh:mm a"
          showTime={false}
          eventStyles={{
            top: `${top}px`,
            width: `${eventLength * 100 - 10}%`,
            height: '20px',
          }}
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    events,
    eachFirstDayInCalcRow,
    daysList,
    cellWidth,
    eachWeekStart,
    timezone,
    fields,
    prevNextEvents,
  ]);

  return <React.Fragment>{renderEvents}</React.Fragment>;
};

export default MonthEvents;

// width: `${eventLength * cellWidth - 10}px`,

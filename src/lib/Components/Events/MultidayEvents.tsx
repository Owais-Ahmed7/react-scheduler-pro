import { endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import React from 'react';
import { differenceInDaysOmitTime } from '../../utils/schedular';
import EventItem from './EventItem';
import useStore from '../../hooks/useStore';
import { EventColumn, MappedEvent, Resource } from '../../types';

interface MultidayProps {
  multiDayEvents: MappedEvent[];
  resource?: Resource;
  weekStart: Date;
  weekEnd: Date;
  eventsIndexes: EventColumn[];
  prevNextEvents: MappedEvent[];
  hasResource: boolean;
  today: Date;
}

const MultidayEvents: React.FC<MultidayProps> = ({
  multiDayEvents,
  resource,
  weekStart,
  weekEnd,
  eventsIndexes,
  prevNextEvents,
  hasResource,
  today,
}) => {
  const { fields } = useStore();

  return (
    <React.Fragment key={today.getTime()}>
      {(multiDayEvents.slice(0, 2) || []) //showMultiDEvents ? multiDayEvents : multiDayEvents.slice(0, 3)) || []
        .map((event, idx) => {
          const hasPrev = isBefore(startOfDay(event[fields.start] as Date), weekStart);
          const hasNext = isAfter(endOfDay(event[fields.end] as Date), weekEnd);
          const eventLength =
            differenceInDaysOmitTime(
              hasPrev ? weekStart : (event[fields.start] as Date),
              hasNext ? weekEnd : (event[fields.end] as Date)
            ) + 1;

          let topFactor = 0;
          let eventInColumn: MappedEvent | undefined;
          for (let i = 0; i < eventsIndexes?.length; i++) {
            eventInColumn = eventsIndexes[i].events.find(
              (e) => e[fields.id] === event[fields.id]
            );

            if (eventInColumn) {
              topFactor = i;
              break;
            }
          }

          // if (!showMultiDEvents) {
          const findEventIndex = prevNextEvents.findIndex(
            (e) => e[fields.id] === event[fields.id]
          );
          if (findEventIndex > 1) return <></>;
          // }
          const topConstant = hasResource ? 48 : 48;
          const top = topFactor * 18 + topConstant;

          return (
            <EventItem
              key={idx}
              idx={idx}
              hasPrevious={hasPrev}
              hasNext={hasNext}
              resource={resource}
              event={event}
              timeFormat="dd MMM yyyy"
              showTime={false}
              eventStyles={{
                top: `${top}px`,
                height: `18px`,
                width: `${eventLength * 100 - 10}%`,
              }}
            />
          );
        })}
    </React.Fragment>
  );
};

export default MultidayEvents;

import React, { useMemo } from 'react';
import {
  distributeEvents,
  getTimeZonedDate,
  traverseCrossingEvents,
} from '../utils/schedular';
import { differenceInMinutes } from 'date-fns';
import { isToday } from '../utils/schedular';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import useStore from '../hooks/useStore';
import EventItem from './EventItem';
import CurrentTimeBar from './CurrentTimeBar';

interface Props {
  events: any[];
  resource?: any;
  timezone?: string;
  today: Date;
  // day: Date;
  // setPopover: Dispatch<SetStateAction<{ event: any; open: boolean }>>;
  // popover: { event: any; open: boolean };
}

const RenderEvents = ({ events, resource, timezone, today }: Props) => {
  const {
    startHour: START_HOUR,
    endHour: END_HOUR,
    step,
    fields,
    hourFormat,
  } = useStore();

  const INTERVAL = step;

  const renderEvents = useMemo(() => {
    return (events || []).map((event: any, idx) => {
      // const event = convertEventTimeZone(ev, fields, timezone); //remove convert timezone : 1
      const getHour = new Date(event[fields.start]).getHours();
      const getMinutes = new Date(event[fields.start]).getMinutes();
      const computeMinutePercentage = (getMinutes / 60) * CELL_HEIGHT;

      //algorithm
      const crossingEvents = traverseCrossingEvents(
        //remove convert timezone : 2
        events,
        event,
        fields,
        timezone
      );

      let width;
      let left;

      let checkBigger = 0;
      let maxCrossingEvent: any = {};
      crossingEvents.forEach((ev) => {
        // const ev = convertEventTimeZone(e, fields, timezone);
        const cEvents = traverseCrossingEvents(events, ev, fields, timezone);

        if (cEvents.length > checkBigger) {
          maxCrossingEvent = cEvents;
          checkBigger = cEvents.length;
        }
      });
      const totalEvents = maxCrossingEvent || [];
      let widthFactor: any[] = [];
      widthFactor = distributeEvents(
        totalEvents,
        widthFactor,
        fields,
        timezone
      );

      const CELL_HEIGHT_INTERVAL = CELL_HEIGHT * (60 / INTERVAL);

      const top =
        (getHour - START_HOUR) * CELL_HEIGHT_INTERVAL +
        computeMinutePercentage * (60 / INTERVAL);

      const height =
        (differenceInMinutes(
          new Date(event[fields.end]),
          new Date(event[fields.start])
        ) *
          CELL_HEIGHT_INTERVAL) /
        60;
      width = (90 / widthFactor.length || 1) - 1;

      let leftFactor = null;
      let eventInColumn = null;
      for (let i = 0; i < widthFactor.length; i++) {
        eventInColumn = widthFactor[i].events.find(
          (e: any) => e[fields.id] === event[fields.id]
        );

        if (eventInColumn) {
          leftFactor = i;
          break;
        }
      }

      left = (leftFactor ?? 0) * (width + 1);

      return (
        <EventItem
          key={idx}
          idx={idx}
          event={event}
          resource={resource}
          timeFormat={hourFormat === 12 ? 'hh:mm a' : 'dd MMM yyyy HH:mm a'}
          eventStyles={{
            top: `${top}px`,
            left: `${left}%`,
            height: `${height}px`,
            width: `${width}%`,
          }}
        />
      );
    });
  }, [events, fields, timezone, INTERVAL, START_HOUR, resource, hourFormat]);

  return (
    <React.Fragment>
      {isToday(today, timezone) && (
        <CurrentTimeBar
          today={today}
          startHour={START_HOUR}
          step={step}
          minuteHeight={CELL_HEIGHT / step}
          timezone={timezone}
        />
      )}
      {renderEvents}
    </React.Fragment>
  );
};

export default RenderEvents;

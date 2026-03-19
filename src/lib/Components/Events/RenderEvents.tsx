import React, { useMemo } from 'react';
import {
  distributeEvents,
  getTimeZonedDate,
  traverseCrossingEvents,
} from '../../utils/schedular';
import { differenceInMinutes } from 'date-fns';
import { isToday } from '../../utils/schedular';
import { CELL_HEIGHT } from '../../helpers/constants/schedular';
import useStore from '../../hooks/useStore';
import EventItem from './EventItem';
import CurrentTimeBar from '../CurrentTimeBar';
import { EventColumn, MappedEvent, Resource } from '../../types';

interface Props {
  events: MappedEvent[];
  resource?: Resource;
  timezone?: string;
  today: Date;
  onDragStart?: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
  onResizeStart?: (
    event: MappedEvent,
    mouseEvent: React.MouseEvent | React.TouchEvent,
    resource?: Resource,
    eventElement?: HTMLElement
  ) => void;
  draggedEventId?: unknown;
}

const RenderEvents = ({
  events,
  resource,
  timezone,
  today,
  onDragStart,
  onResizeStart,
  draggedEventId,
}: Props) => {
  const {
    startHour: START_HOUR,
    endHour: END_HOUR,
    step,
    fields,
    hourFormat,
  } = useStore();

  const INTERVAL = step;

  const renderEvents = useMemo(() => {
    return (events || []).map((event, idx) => {
      const getHour = new Date(event[fields.start] as Date).getHours();
      const getMinutes = new Date(event[fields.start] as Date).getMinutes();
      const computeMinutePercentage = (getMinutes / 60) * CELL_HEIGHT;

      const crossingEvents = traverseCrossingEvents(
        events,
        event,
        fields,
        timezone
      );

      let width;
      let left;

      let checkBigger = 0;
      let maxCrossingEvent: MappedEvent[] = [];
      crossingEvents.forEach((ev) => {
        const cEvents = traverseCrossingEvents(events, ev, fields, timezone);

        if (cEvents.length > checkBigger) {
          maxCrossingEvent = cEvents;
          checkBigger = cEvents.length;
        }
      });
      const totalEvents = maxCrossingEvent || [];
      let widthFactor: EventColumn[] = [];
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
          new Date(event[fields.end] as Date),
          new Date(event[fields.start] as Date)
        ) *
          CELL_HEIGHT_INTERVAL) /
        60;
      width = (90 / widthFactor.length || 1) - 1;

      let leftFactor: number | null = null;
      let eventInColumn: MappedEvent | undefined = undefined;
      for (let i = 0; i < widthFactor.length; i++) {
        eventInColumn = widthFactor[i].events.find(
          (e) => e[fields.id] === event[fields.id]
        );

        if (eventInColumn) {
          leftFactor = i;
          break;
        }
      }

      left = (leftFactor ?? 0) * (width + 1);

      const isDraggedEvent =
        draggedEventId != null && event[fields.id] === draggedEventId;

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
          onDragStart={onDragStart}
          onResizeStart={onResizeStart}
          isDraggedEvent={isDraggedEvent}
        />
      );
    });
  }, [
    events,
    fields,
    timezone,
    INTERVAL,
    START_HOUR,
    resource,
    hourFormat,
    onDragStart,
    onResizeStart,
    draggedEventId,
  ]);

  return (
    <React.Fragment>
      {isToday(today, timezone) && (
        <CurrentTimeBar
          today={today}
          startHour={START_HOUR}
          step={step}
          renderTime={false}
          hourFormat={hourFormat || 12}
          timezone={timezone}
        />
      )}
      {renderEvents}
    </React.Fragment>
  );
};

export default RenderEvents;

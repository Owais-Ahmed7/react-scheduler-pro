import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  filterTodayEvents,
  getTimeZonedDate,
  systemTimezone,
} from '../utils/schedular';
import {
  addDays,
  addHours,
  addMinutes,
  eachMinuteOfInterval,
  format,
  isSameDay,
  isSameHour,
  set,
  toDate,
} from 'date-fns';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import useStore from '../hooks/useStore';

import RenderEvents from './Events/RenderEvents';
import { getResourcedEvents, isToday } from '../utils/schedular';
import DayGridHeader from './DayGridHeader';
import { MappedEvent, Resource, ResourceFields, ResourcedEventsEntry, SlotPropGetterResult, fieldsType } from '../types';
import { zonedTimeToUtc } from 'date-fns-tz';
import CurrentTimeBar from './CurrentTimeBar';
import useDragAndDrop from '../hooks/useDragAndDrop';
import DragPreview from './DragPreview';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import LiveRegion from './LiveRegion';

interface Props {
  weekDays: number[];
  startOfWk: Date;
  endOfWk: Date;
  schedulerHeight: number;
  startHour: number;
  endHour: number;
  hourFormat: 24 | 12;
  selectedDate: Date;
  step: number;
  events: MappedEvent[];
  locale: Locale;
  timezone: string;
  fields: fieldsType;
  resources: Resource[];
  resourceFields: ResourceFields;
}

const TimeGrid: React.FC<Props> = ({
  weekDays,
  startOfWk,
  endOfWk,
  schedulerHeight: SHEDULER_HEIGHT,
  startHour,
  endHour,
  hourFormat,
  selectedDate,
  step,
  events,
  locale,
  timezone,
  fields,
  resources,
  resourceFields,
}) => {
  const { dispatch, onSlot, slotPropGetter } = useStore();
  const hasResource = Boolean(resources?.length);
  const gridRef = useRef<HTMLDivElement>(null);
  const [liveMessage, setLiveMessage] = useState('');

  useKeyboardNavigation({
    containerRef: gridRef,
  });

  const {
    isDragging,
    isResizing,
    draggedEvent,
    previewStyle,
    previewTitle,
    handleDragStart,
    handleResizeStart,
  } = useDragAndDrop();

  const [popover, setPopover] = useState<{ event: MappedEvent | null; open: boolean }>({
    event: null,
    open: false,
  });
  const resourcedEvents = (index: number): MappedEvent[] | ResourcedEventsEntry[] => {
    if (hasResource && index >= 0) {
      return getResourcedEvents(events, resources, resourceFields, fields)[index]
          ?.resourceEvents || [];
    }
    if (hasResource && index < 0) {
      return getResourcedEvents(events, resources, resourceFields, fields);
    }
    return events;
  };

  useEffect(() => {
    // Get references to the content wrap and time cells wrap
    const contentWrap = document.querySelector('.bs-time-slot');
    const timeCellsWrap = document.querySelector('.bs-time-cells-wrap');
    const dateHeader = document.querySelector('.bs-time-header-content');
    // Add a scroll event listener to the content wrap
    contentWrap?.addEventListener('scroll', function () {
      const scrollTop = contentWrap.scrollTop;
      const scrollLeft = contentWrap.scrollLeft;

      // Set the scroll position of the time cells wrap to match the content wrap
      timeCellsWrap?.scrollTo(scrollLeft, scrollTop);
      dateHeader?.scrollTo(scrollLeft, scrollTop);
      if (popover.event) setPopover({ event: null, open: false });
    });
  }, [popover]);

  const START_TIME = set(selectedDate, {
    hours: startHour,
    minutes: 0,
    seconds: 0,
  });
  const END_TIME = set(selectedDate, {
    hours: endHour,
    minutes: step >= 60 ? 0 : step,
    seconds: 0,
  });
  const hours = eachMinuteOfInterval(
    {
      start: START_TIME,
      end: END_TIME,
    },
    { step: step }
  );

  const draggedEventId = draggedEvent ? draggedEvent[fields.id] : null;

  const RenderDayEvents = ({ resource, index }: { resource?: Resource; index: number }) => {
    const renderEvents = useMemo(() => {
      return (weekDays || []).map((e, i) => {
        const date = addDays(startOfWk, e);

        return (
          <div key={i} className="e-day-wrapper overflow-visible">
            <div className="e-appointment-wrapper">
              <RenderEvents
                today={date}
                events={filterTodayEvents(
                  date,
                  resourcedEvents(index) as MappedEvent[],
                  fields,
                  timezone
                )}
                timezone={timezone}
                resource={resource}
                onDragStart={handleDragStart}
                onResizeStart={handleResizeStart}
                draggedEventId={draggedEventId}
              />
            </div>
          </div>
        );
      });
    }, [index, resource]);

    return (
      <div className="bs-min-width bs-content bs-row bs-column">
        <div className="bs-row position-relative">
          {renderEvents}
          {(isDragging || isResizing) && previewStyle && (
            <DragPreview style={previewStyle} title={previewTitle} />
          )}
        </div>
        <div role="grid" aria-label="Time grid">
          {(hours || []).map((time, idx) => (
            <div className="bs-row" role="row" key={time.getTime()}>
              {weekDays.map((e, i) => {
                const start = addDays(startOfWk, e);
                const concatDate = addMinutes(
                  addHours(start, time.getHours()),
                  time.getMinutes()
                );
                const end = addMinutes(concatDate, step);

                let slotStyles: SlotPropGetterResult = { classnames: '', styles: {} };
                if (slotPropGetter instanceof Function)
                  slotStyles = slotPropGetter({ date: concatDate });
                const style = { height: CELL_HEIGHT, ...slotStyles.styles };

                return (
                  <div
                    key={i}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`${concatDate.toLocaleString('en', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })} - ${end.toLocaleString('en', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })}`}
                    data-date={concatDate.toISOString()}
                    data-hour={time.getHours()}
                    data-minute={time.getMinutes()}
                    data-resource-id={
                      resource ? resource[resourceFields.id] : undefined
                    }
                    style={style}
                    onFocus={() => {
                      setLiveMessage(
                        `${concatDate.toLocaleString('en', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}`
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Don't fire slot click during drag
                        if (isDragging || isResizing) return;
                        const zStart = zonedTimeToUtc(concatDate, timezone);
                        const zEnd = addMinutes(zStart, step);
                        if (onSlot instanceof Function)
                          onSlot({
                            start: zStart,
                            end: zEnd,
                            resource,
                          });
                        else
                          dispatch('eventDialog', {
                            start: zStart,
                            end: zEnd,
                            resource,
                            event: null,
                            isOpen: true,
                          });
                      }
                    }}
                    onClick={() => {
                      // Don't fire slot click during drag
                      if (isDragging || isResizing) return;
                      const zStart = zonedTimeToUtc(concatDate, timezone);
                      const zEnd = addMinutes(zStart, step);
                      if (onSlot instanceof Function)
                        onSlot({
                          start: zStart,
                          end: zEnd,
                          resource,
                        });
                      else
                        dispatch('eventDialog', {
                          start: zStart,
                          end: zEnd,
                          resource,
                          event: null,
                          isOpen: true,
                        });
                    }}
                    className={`border-top bs-date-cells fs-8 py-0 ${slotStyles.classnames}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="w-100" ref={gridRef}>
        <LiveRegion message={liveMessage} />
        <div className="mt-3 e-day-view">
          <div className="bs-time-view">
            <div className="bs-time-header">
              <DayGridHeader
                resources={resources}
                resourceFields={resourceFields}
                hasResource={hasResource}
                weekDays={weekDays}
                startOfWk={startOfWk}
                endOfWk={endOfWk}
                locale={locale}
                resourcedEvents={resourcedEvents(-1)}
                fields={fields}
              />
            </div>

            <div className="bs-time-slots">
              <div className="bs-time-gutter">
                <div
                  style={{ height: SHEDULER_HEIGHT }}
                  className="bs-time-cells-wrap"
                >
                  <div>
                    {weekDays.map((e, i) => {
                      const today = addDays(startOfWk, e);
                      return (
                        <div key={i} className="position-relative">
                          {isToday(today, timezone) && (
                            <CurrentTimeBar
                              today={today}
                              startHour={startHour}
                              renderTime={true}
                              step={step}
                              timezone={timezone}
                              hourFormat={hourFormat || 12}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {(hours || []).map((time, idx) => {
                      let gutterStyles: SlotPropGetterResult = { classnames: '', styles: {} };
                      if (slotPropGetter instanceof Function)
                        gutterStyles = slotPropGetter({ date: time });
                      const style = { height: CELL_HEIGHT, ...gutterStyles.styles };
                      return (
                        <div
                          key={idx}
                          aria-label={time.toISOString()}
                          style={style}
                          className={`border-top fs-12 text-center text-nowrap ${gutterStyles.classnames}`}
                        >
                          <span className="fs-7">
                            {format(
                              time,
                              hourFormat === 12 ? 'h:mm a' : 'HH:mm',
                              {
                                locale,
                              }
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="bs-time-slot">
                <div
                  style={{ height: SHEDULER_HEIGHT }}
                  className="bs-content-wrap"
                >
                  {hasResource ? (
                    resources.map((rs, idx) => (
                      <RenderDayEvents
                        key={rs[resourceFields.id] as string}
                        resource={rs}
                        index={idx}
                      />
                    ))
                  ) : (
                    <RenderDayEvents index={0} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TimeGrid;

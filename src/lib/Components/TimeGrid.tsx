import React, { useEffect, useMemo, useState } from 'react';
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
import { fieldsType } from '../types';
import { zonedTimeToUtc } from 'date-fns-tz';
import CurrentTimeBar from './CurrentTimeBar';

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
  events: any[];
  locale: Locale;
  timezone: string;
  fields: fieldsType;
  resources: any[];
  resourceFields: { id: string; title: string };
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
  const { dispatch, onSlot, slotPropGetter }: any = useStore();
  const hasResource = Boolean(resources?.length);

  const [popover, setPopover] = useState<{ event: any; open: boolean }>({
    event: null,
    open: false,
  });
  const resourcedEvents = (index: number) => {
    return hasResource && index >= 0
      ? getResourcedEvents(events, resources, resourceFields, fields)[index]
          ?.resourceEvents || []
      : hasResource && index < 0
        ? getResourcedEvents(events, resources, resourceFields, fields)
        : events;
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

  const RenderDayEvents = ({ resource, index }: any) => {
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
                  resourcedEvents(index),
                  fields,
                  timezone
                )}
                timezone={timezone}
                resource={resource}
              />
            </div>
          </div>
        );
      });
    }, [index, resource]);

    return (
      <div className="bs-min-width bs-content bs-row bs-column">
        <div className="bs-row position-relative">{renderEvents}</div>
        <div>
          {(hours || []).map((time, idx) => (
            <div className="bs-row" key={time.getTime()}>
              {weekDays.map((e, i) => {
                const start = addDays(startOfWk, e);
                const concatDate = addMinutes(
                  addHours(start, time.getHours()),
                  time.getMinutes()
                );
                const end = addMinutes(concatDate, step);

                let styles = { classnames: '', styles: {} };
                if (slotPropGetter instanceof Function)
                  styles = slotPropGetter({ date: concatDate });
                const style = { height: CELL_HEIGHT, ...styles.styles };

                return (
                  <div
                    key={i}
                    aria-label={`${concatDate.toLocaleString('en', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })} - ${end.toLocaleString('en', {
                      dateStyle: 'full',
                      timeStyle: 'long',
                    })}`}
                    style={style}
                    onClick={() => {
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
                    className={`border-top bs-date-cells fs-8 py-0 ${styles.classnames}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // console.log('render time grid', timezone);

  return (
    <React.Fragment>
      <div className="w-100">
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
                // multiDayPlaceHFactor={multiDayPlaceHFactor}
                // showAllMultiDEvents={showAllMultiDEvents}
                // setShowMultiDEvents={setShowMultiDEvents}
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
                      let styles = { classnames: '', styles: {} };
                      if (slotPropGetter instanceof Function)
                        styles = slotPropGetter({ date: time });
                      const style = { height: CELL_HEIGHT, ...styles.styles };
                      return (
                        <div
                          key={idx}
                          aria-label={time.toISOString()}
                          style={style}
                          className={`border-top fs-12 text-center text-nowrap ${styles.classnames}`} //
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
                    resources.map((rs: any, idx) => (
                      <RenderDayEvents
                        key={rs[resourceFields.id]}
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

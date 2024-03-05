import React, { useEffect, useMemo, useState } from 'react';
import {
  filterTodayEvents,
  getTimeZonedDate,
  systemTimezone,
} from '../utils/schedular';
import {
  addDays,
  addHours,
  addMilliseconds,
  addMinutes,
  eachMinuteOfInterval,
  format,
  toDate,
} from 'date-fns';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import useStore from '../hooks/useStore';

import RenderEvents from '../Components/RenderEvents';
import { getResourcedEvents } from '../utils/schedular';
import DayGridHeader from './DayGridHeader';
import { fieldsType } from '../types';
import { getTimezoneOffset, zonedTimeToUtc } from 'date-fns-tz';

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
  startHour: START_HOUR,
  endHour: END_HOUR,
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
  const { dispatch, onSlot }: any = useStore();
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
    const contentWrap = document.querySelector('.e-content-wrap');
    const timeCellsWrap = document.querySelector('.e-time-cells-wrap');
    const dateHeader = document.querySelector('.e-date-header-wrapper');
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

  const hours = eachMinuteOfInterval(
    {
      start: new Date(new Date().setHours(START_HOUR)).setMinutes(0),
      end: new Date(new Date().setHours(END_HOUR)).setMinutes(0),
    },
    { step }
  );

  const RenderDayEvents = ({ resource, index }: any) => {
    const renderEvents = useMemo(() => {
      return (weekDays || []).map((e, i) => {
        const date = addDays(startOfWk, e);

        return (
          <td key={i} className="e-day-wrapper overflow-visible">
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
          </td>
        );
      });
    }, [index, resource]);

    return (
      <td style={{ minWidth: '300px' }}>
        <div className="e-appointment-wrapper position-relative">
          <table className="e-schedule-table">
            <tbody>
              <tr>{renderEvents}</tr>
            </tbody>
          </table>
        </div>
        <table className="e-schedule-table">
          <tbody>
            {(hours || []).map((time, idx) => (
              <tr key={time.getTime()}>
                {weekDays.map((e, i) => {
                  const start = addDays(startOfWk, e);
                  const concatDate = addMinutes(
                    addHours(start, time.getHours()),
                    time.getMinutes()
                  );

                  return (
                    <td
                      key={i}
                      colSpan={1}
                      // aria-label={`${zStart.toLocaleString('en', {
                      //   dateStyle: 'full',
                      //   timeStyle: 'long',
                      // })} - ${zEnd.toLocaleString('en', {
                      //   dateStyle: 'full',
                      //   timeStyle: 'long',
                      // })}`}
                      style={{ height: CELL_HEIGHT }}
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
                      className="border-top e-date-cells fs-8 py-0 align-middle"
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    );
  };

  return (
    <React.Fragment>
      <div className="w-100">
        <div id="e-table" className="mt-3 e-day-view">
          <table className="e-schedule-table border mb-0">
            <tbody>
              <tr>
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
              </tr>

              <tr>
                <td>
                  <div
                    style={{ height: SHEDULER_HEIGHT }}
                    className="e-time-cells-wrap"
                  >
                    <table>
                      <tbody>
                        {(hours || []).map((time, idx) => (
                          <tr key={idx}>
                            <td
                              aria-label={time.toISOString()}
                              style={{ height: CELL_HEIGHT }}
                              className="border-end border-top fs-12 text-center text-nowrap"
                            >
                              <span className="fs-7">
                                {format(
                                  time,
                                  hourFormat === 12 ? 'h:mm a' : 'HH:mm',
                                  { locale }
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
                <td>
                  <div
                    style={{ height: SHEDULER_HEIGHT }}
                    className="e-content-wrap"
                  >
                    <table
                      style={{ tableLayout: 'auto' }}
                      className="e-schedule-table e-content-table overflow-hidden"
                    >
                      <tbody>
                        <tr>
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
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TimeGrid;

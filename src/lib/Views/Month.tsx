import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  isSameDay,
  format,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  addDays,
  endOfDay,
  startOfDay,
  areIntervalsOverlapping,
  isFirstDayOfMonth,
  addMinutes,
} from 'date-fns';
import { isToday } from '../utils/schedular';
import { usePopper } from 'react-popper';
import useStore from '../hooks/useStore';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import MonthEvents from '../Components/Events/MonthEvents';
import {
  convertEventTimeZone,
  distributeMonthEvents,
  getResourcedEvents,
  sortEventsByTheLengthest,
} from '../utils/schedular';
import ShowMoreEvents from '../Components/Popovers/ShowMoreEvents';

const weekDays = [0, 1, 2, 3, 4, 5, 6];

const Month = () => {
  const {
    weekStartOn,
    selectedDate,
    fields,
    events,
    dispatch,
    locale,
    resources,
    resourceFields,
    resourceTemplate,
    view,
    message,
    timezone,
    onSlot,
  }: any = useStore();
  const hasResource = Boolean(resources?.length);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const eachWeekStart = useMemo(
    () =>
      eachWeekOfInterval(
        {
          start: monthStart,
          end: monthEnd,
        },
        { weekStartsOn: 0 }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthStart.toISOString(), monthEnd.toISOString()]
  );

  const daysList = useMemo(() => {
    return weekDays.map((d) => addDays(eachWeekStart[0], d));
  }, [eachWeekStart]);

  const [cellWidth, setCellWidth] = useState<Number>(0);
  const [dateAllEvents, setDateAllEvents] = useState<{
    events: any[];
    date: Date | null;
    resource: any[] | null;
  }>({ events: [], date: null, resource: null });

  const tableCellRef = useRef(null);

  useEffect(() => {
    // Function to update the width
    const updateWidth = () => {
      if (tableCellRef.current) {
        const currentTd = tableCellRef.current as HTMLTableCellElement;
        const width = currentTd.offsetWidth;
        setCellWidth(width);
      }
    };
    updateWidth();

    function bodyListener(e: any) {
      const popoverContainer = document.querySelector('.more-events-popover');
      // console.log('close event popper 1');
      if (popoverContainer && !popoverContainer.contains(e.target as Node)) {
        if (Boolean(dateAllEvents.events.length)) {
          // console.log('close event popper 2');

          setDateAllEvents({ events: [], date: null, resource: null });
        }
      }
    }

    document.body.addEventListener('click', bodyListener);
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      document.body.removeEventListener('click', bodyListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //popover
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'left-start',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['right-start'],
        },
      },
      {
        name: 'offset',
        options: {
          offset: [-85, 0],
        },
      },
      {
        name: 'popperOffset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const RenderContent = useMemo(
    () => {
      // const sortedEvents = sortEventsByStartDate(events);
      const sortedEvents = sortEventsByTheLengthest(events, fields);
      const resourcedEvents = (index: number) => {
        if (hasResource)
          return getResourcedEvents(
            sortedEvents,
            resources,
            resourceFields,
            fields
          )[index]?.resourceEvents;
        else return sortedEvents;
      };

      const RenderCells = ({ index, resource }: any) => {
        let eventsIndexes: any[] = [];
        return (
          <React.Fragment>
            {Array.from(eachWeekStart).map((startDay, i) => {
              return (
                <tr key={i} style={{ height: 100, width: CELL_HEIGHT }}>
                  {weekDays.map((d, idx) => {
                    const today = addDays(startDay, d);
                    const eachFirstDayInCalcRow = isSameDay(startDay, today)
                      ? today
                      : null;

                    let todayEvents: any[] = [];
                    let prevNextEvents: any[] = [];

                    resourcedEvents(index)?.forEach((ev: any) => {
                      const e = convertEventTimeZone(ev, fields, timezone);
                      const doesIntervalOverlap = areIntervalsOverlapping(
                        {
                          start: e[fields.start],
                          end: e[fields.end],
                        },
                        {
                          start: startOfDay(today),
                          end: endOfDay(today),
                        }
                      );

                      if (
                        (eachFirstDayInCalcRow && doesIntervalOverlap) ||
                        isSameDay(e[fields.start], today)
                      ) {
                        todayEvents.push(e);
                      }

                      if (doesIntervalOverlap) {
                        prevNextEvents.push(e);
                      }
                    });

                    if (todayEvents?.length) {
                      eventsIndexes[i] = {
                        rows: distributeMonthEvents(
                          todayEvents,
                          eventsIndexes[i]?.rows || [],
                          fields,
                          timezone
                        ),
                      };
                    }

                    return (
                      <React.Fragment key={today.getTime()}>
                        <td
                          colSpan={1}
                          className="e-work-cells p-0"
                          aria-label={`${startOfDay(today).toLocaleString(
                            'en',
                            {
                              dateStyle: 'full',
                              timeStyle: 'long',
                            }
                          )} - ${endOfDay(today).toLocaleString('en', {
                            dateStyle: 'full',
                            timeStyle: 'long',
                          })}`}
                          onClick={() => {
                            if (onSlot instanceof Function)
                              onSlot({
                                start: today,
                                end: addMinutes(today, 60),
                                resource,
                              });
                            else
                              dispatch('eventDialog', {
                                start: today,
                                end: addMinutes(today, 60),
                                resource,
                                event: null,
                                isOpen: true,
                              });
                          }}
                        >
                          <div
                            className={
                              isToday(today, timezone)
                                ? 'e-date-header rounded-circle fs-12 text-white bg-primary'
                                : 'e-date-header rounded-circle fs-12'
                            }
                          >
                            {isFirstDayOfMonth(today)
                              ? format(today, 'd MMM', { locale })
                              : format(today, 'd', { locale })}
                          </div>
                          <div className="e-appointment-wrapper position-relative">
                            <MonthEvents
                              events={todayEvents}
                              allEvents={events}
                              resource={resource}
                              eventsIndexes={eventsIndexes[i]?.rows || []}
                              today={today}
                              dayIndex={idx}
                              startDay={startDay}
                              eachWeekStart={eachWeekStart}
                              eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                              prevNextEvents={prevNextEvents}
                              daysList={daysList}
                              cellWidth={Number(cellWidth) || 1}
                            />

                            {prevNextEvents.length > 3 && (
                              <div
                                className={`btn e-more-indicator text-start position-absolute`}
                                data-count="1"
                                data-group-index="0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReferenceElement(e.currentTarget);
                                  setDateAllEvents({
                                    events: prevNextEvents,
                                    date: today,
                                    resource,
                                  });
                                }}
                                style={{
                                  top: '59px',
                                  width: `100%`,
                                  left: 0,
                                }}
                              >
                                +{prevNextEvents.length - 3}&nbsp;{message.more}
                              </div>
                            )}
                          </div>
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </React.Fragment>
        );
      };

      return hasResource ? (
        resources.map((rs: any, idx: number) => (
          <td key={rs[resourceFields.id]} colSpan={7}>
            <table className="e-schedule-table">
              <tbody>{<RenderCells index={idx} resource={rs} />}</tbody>
            </table>
          </td>
        ))
      ) : (
        <td colSpan={7}>
          <table className="e-schedule-table">
            <tbody>{<RenderCells />}</tbody>
          </table>
        </td>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cellWidth, events, daysList, fields]
  );

  return (
    <React.Fragment>
      <div className="e-schedule">
        <div id="e-table" className="mt-3 e-month-view overflow-auto">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td className="p-0">
                  <div className="e-date-header-wrap">
                    <table
                      className="e-schedule-table mb-0"
                      style={{ tableLayout: 'auto' }}
                    >
                      <tbody>
                        <tr>
                          {hasResource ? (
                            resources.map((rs: any) => (
                              <React.Fragment key={rs[resourceFields.id]}>
                                <td style={{ minWidth: '300px' }}>
                                  <table className="e-scheduler-table bs-resource-table">
                                    <tbody>
                                      <tr>
                                        <td
                                          key={rs[resourceFields.id]}
                                          colSpan={7}
                                          className="e-resource-cell"
                                        >
                                          {resourceTemplate instanceof Function
                                            ? resourceTemplate({
                                                resource: rs,
                                                view,
                                              })
                                            : rs[resourceFields.title]}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table className="e-schedule-table bs-header-table">
                                    <tbody>
                                      <tr>
                                        {daysList.map(
                                          (day: Date, idx: number) => (
                                            <td
                                              key={idx}
                                              colSpan={1}
                                              className={
                                                isToday(day, timezone)
                                                  ? 'e-header-cells text-primary'
                                                  : 'e-header-cells'
                                              }
                                            >
                                              {format(day, 'EEE', { locale })}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </React.Fragment>
                            ))
                          ) : (
                            <React.Fragment>
                              <td>
                                <table className="e-schedule-table bs-header-table">
                                  <tbody>
                                    <tr>
                                      {daysList.map(
                                        (day: Date, idx: number) => (
                                          <td
                                            key={idx}
                                            colSpan={1}
                                            className="e-header-cells"
                                          >
                                            {format(day, 'EEE', { locale })}
                                          </td>
                                        )
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </React.Fragment>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-0">
                  <div className="e-content-wrap">
                    <table className="e-schedule-table e-date-cells table table-bordered mb-0">
                      <thead></thead>
                      <tbody>
                        <tr>{RenderContent}</tr>
                        <ShowMoreEvents
                          dateAllEvents={dateAllEvents}
                          setDateAllEvents={setDateAllEvents}
                          setPopperElement={setPopperElement}
                          styles={styles}
                          attributes={attributes}
                        />
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

export default Month;

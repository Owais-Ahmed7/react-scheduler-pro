import React, { useEffect, useRef, useState } from 'react';
import {
  isSameDay,
  format,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  addDays,
  setHours,
  isWithinInterval,
  endOfDay,
  startOfDay,
  areIntervalsOverlapping,
} from 'date-fns';
import useStore from '../hooks/useStore';
import { CELL_HEIGHT } from '../helpers/constants/schedular';
import MonthEvents from '../Components/MonthEvents';
import { sortEventsByTheLengthest } from '../utils/schedular';

const weekDays = [0, 1, 2, 3, 4, 5, 6];
const hFormat = 'hh:mm a';
interface Props {
  events: any[];
  // monthDates: Date[];
  trackMonth: Date;
  toggleForm: () => void;
  currentDate: Date;
}

const Month = ({ events, trackMonth, toggleForm, currentDate }: Props) => {
  const { weekStartOn, startHour, endHour } = useStore();

  const monthStart = startOfMonth(trackMonth);
  const monthEnd = endOfMonth(trackMonth);
  const eachWeekStart = eachWeekOfInterval(
    {
      start: monthStart,
      end: monthEnd,
    },
    { weekStartsOn: 0 }
  );
  const daysList = weekDays.map((d) => addDays(eachWeekStart[0], d));

  const [cellWidth, setCellWidth] = useState<Number>();
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

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const RenderCells = () => {
    const sortedEvents = sortEventsByTheLengthest(events);

    //algorithm
    let eventsIndexes: any[] = [];

    return Array.from(eachWeekStart).map((startDay) => {
      return (
        <tr style={{ height: 100, width: CELL_HEIGHT }}>
          {weekDays.map((d, index) => {
            const today = addDays(startDay, d);
            // const start = new Date(
            //   `${format(setHours(today, startHour), `yyyy/MM/dd ${hFormat}`)}`
            // );
            // const end = new Date(
            //   `${format(setHours(today, endHour), `yyyy/MM/dd ${hFormat}`)}`
            // );
            // const field = resourceFields.idField;
            const eachFirstDayInCalcRow = isSameDay(startDay, today)
              ? today
              : null;
            // const todayEvents = events.filter(
            //   (e: { startDate: number | Date; endDate: any }) =>
            //     // (eachFirstDayInCalcRow &&
            //       areIntervalsOverlapping(
            //         {
            //           start: startOfDay(e.startDate),
            //           end: startOfDay(e.endDate),
            //         },
            //         {
            //           start: startOfDay(today),
            //           end: endOfDay(today),
            //         }
            //       ))
            //     // isSameDay(e.startDate, today)
            // );
            const todayEvents = sortedEvents.filter(
              (e: { startDate: number | Date; endDate: number | Date }) =>
                (eachFirstDayInCalcRow &&
                  areIntervalsOverlapping(
                    {
                      start: e.startDate,
                      end: e.endDate,
                    },
                    {
                      start: startOfDay(today),
                      end: endOfDay(today),
                    }
                  )) ||
                isSameDay(e.startDate, today)
            );

            const prevNextEvents = events.filter((e) => {
              const isWithinToday = areIntervalsOverlapping(
                {
                  start: e.startDate,
                  end: e.endDate,
                },
                {
                  start: startOfDay(today),
                  end: endOfDay(today),
                }
              );

              return isWithinToday;
            });

            prevNextEvents.forEach((e: any) => {
              let index = null;

              for (let i = 0; i < eventsIndexes.length; i++) {
                let col = eventsIndexes[i];
                let overlaps = false;

                for (let j = 0; j < col.events.length; j++) {
                  const event = col.events[j];

                  if (
                    areIntervalsOverlapping(
                      {
                        start: new Date(e.startDate),
                        end: new Date(e.endDate),
                      },
                      {
                        start: new Date(event.startDate),
                        end: new Date(event.endDate),
                      }
                    )
                  ) {
                    overlaps = true;
                    break;
                  } // else overlaps = false;
                }

                if (!overlaps) {
                  index = i;
                  break;
                }
              }

              if (index !== null) {
                eventsIndexes[index].events.push(e);
              } else {
                eventsIndexes.push({ events: [e] });
              }
            });

            // console.log(format(startDay, 'd-M-yyyy'), 'startDate');
            console.log(format(today, 'd-M-yyyy'), 'today');
            console.log(prevNextEvents, 'today events');
            console.log('---------------------------------------');

            return (
              <React.Fragment>
                <td
                  ref={tableCellRef}
                  className="p-0"
                  style={{ width: '36px' }}
                >
                  <div
                    className={
                      isSameDay(today, currentDate)
                        ? 'e-date-header p-2 rounded-circle font-size-14 text-white bg-primary'
                        : 'e-date-header rounded-circle font-size-14'
                    }
                  >
                    {format(today, 'd')}
                  </div>
                  <div className="e-appointment-wrapper position-absolute">
                    <MonthEvents
                      events={todayEvents}
                      allEvents={events}
                      eventsIndexes={eventsIndexes}
                      today={today}
                      dayIndex={index}
                      startDay={startDay}
                      eachWeekStart={eachWeekStart}
                      eachFirstDayInCalcRow={eachFirstDayInCalcRow}
                      prevNextEvents={prevNextEvents}
                      daysList={daysList}
                      cellWidth={Number(cellWidth) || 1}
                    />

                    {prevNextEvents.length > 3 && (
                      <div
                        className="e-more-indicator text-start position-absolute"
                        data-count="1"
                        data-group-index="0"
                        style={{ top: '60px', width: `${cellWidth}px` }}
                      >
                        +{prevNextEvents.length - 3}&nbsp;more
                      </div>
                    )}
                  </div>
                </td>
              </React.Fragment>
            );
          })}
        </tr>
      );

      // rows.push(<Fragment key={startDay.toString()}>{cells}</Fragment>);
    });
  };

  return (
    <React.Fragment>
      <div>
        <div className="mt-3 e-month-view">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td className="p-0">
                  <div>
                    <table
                      className="table table-bordered mb-0"
                      style={{ tableLayout: 'fixed' }}
                    >
                      <tbody>
                        <tr>
                          <td colSpan={1} className="fw-normal">
                            Sun
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Mon
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Tue
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Wed
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Thu
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Fri
                          </td>
                          <td colSpan={1} className="fw-normal">
                            Sat
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-0">
                  <div>
                    <table className="table table-bordered mb-0">
                      <thead></thead>
                      <tbody>
                        <RenderCells />
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

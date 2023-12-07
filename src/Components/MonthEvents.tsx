import React from 'react';
import { differenceInDaysOmitTime } from '../utils/schedular';
import enUS from 'date-fns/locale/en-US';
import {
  closestTo,
  differenceInCalendarWeeks,
  differenceInDays,
  isBefore,
  startOfWeek,
} from 'date-fns';
import { CELL_HEIGHT } from '../helpers/constants/schedular';

interface Props {
  events: any[];
  allEvents: any[];
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
  // console.log(eachFirstDayInCalcRow, 'first day in calc row');
  // console.log(eachWeekStart, 'each week start');

  return (
    <React.Fragment>
      {events.slice(0, 3).map((event, idx) => {
        const fromPrevWeek =
          !!eachFirstDayInCalcRow &&
          isBefore(event.startDate, eachFirstDayInCalcRow);
        const start =
          fromPrevWeek && eachFirstDayInCalcRow
            ? eachFirstDayInCalcRow
            : event.startDate;

        // console.log(start && format(start, 'd-M-yyyy'), 'start ');
        // console.log(event.endDate && format(event.endDate, 'd-M-yyyy'), 'end ');

        const toNextWeek =
          differenceInCalendarWeeks(event.endDate, start, {
            weekStartsOn: 0,
            locale: enUS,
          }) > 0;

        // console.log(toNextWeek, 'to next week');

        let eventLength = differenceInDaysOmitTime(start, event.endDate) + 1;

        // console.log(format(event.startDate, 'd-M-yyyy'), 'event date');
        // console.log(format(event.endDate, 'd-M-yyyy'), 'end date');
        // console.log(format(today, 'd-M-yyyy'), 'today date');
        // console.log(eventLength, 'event length');
        // console.log(toNextWeek, 'to next week');
        // console.log(differenceInDays(today, event.startDate), 'diff in days');

        if (toNextWeek) {
          // Rethink it
          const NotAccurateWeekStart = startOfWeek(event.startDate);
          const closestStart = closestTo(NotAccurateWeekStart, eachWeekStart);
          if (closestStart) {
            eventLength =
              daysList.length -
              (!eachFirstDayInCalcRow
                ? differenceInDays(event.startDate, closestStart)
                : 0);
          }
        }

        const slicedEvents = prevNextEvents?.slice(0, 3);

        if (!slicedEvents.find((val) => val._id === event._id)) return <></>;

        let eventInColumn;
        let topFactor;
        for (let i = 0; i < eventsIndexes.length; i++) {
          eventInColumn = eventsIndexes[i].events.find(
            (e: any) => e._id === event._id
          );

          if (eventInColumn) {
            topFactor = i;
            break;
          }
        }
        const top = (topFactor ?? 0) * 20;

        // console.log(events, 'prev Next events', event.name, idx);
        // console.log('------------------------------------------------------');

        return (
          <div
            className="text-white position-absolute e-appointment"
            style={{
              top: `${top}px`,
              width: `${eventLength * cellWidth - 10}px`,
              backgroundColor: 'rgb(196, 48, 129)',
            }}
          >
            <div className="e-appointment-details">
              {fromPrevWeek && (
                <div className="d-flex align-items-center mx-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="12"
                    width="7.5"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="12"
                    width="7.5"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                    />
                  </svg>
                </div>
              )}
              <h6 className="fs-7 mb-0 e-subject">{event.name}</h6>
              {toNextWeek && (
                <div className="d-flex align-items-center mx-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="12"
                    width="7.5"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="12"
                    width="7.5"
                    viewBox="0 0 320 512"
                    className="ms-n2"
                  >
                    <path
                      fill="#ffffff"
                      d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default MonthEvents;

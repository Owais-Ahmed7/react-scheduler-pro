import React, { useEffect } from 'react';
import { isSameDay, format, eachMinuteOfInterval } from 'date-fns';
// import moment from 'moment';
// import chunk from '../../utils/chunk';

//appointment
// import AppointmentsModal from './AppointmentsModal';
// import { appointmentMap, calendarTimes } from '../data';
import AppointmentWidget from '../Components/EventWidget';
// import { getEvents } from '../../utils/schedular';
import chunk from '../utils/chunk';
import useStore from '../hooks/useStore';
import { getAppointmentsByDates } from '../Components/data';
import RenderEvents from '../Components/RenderEvents';
import {
  CELL_HEIGHT,
  DEFAULT_SHEDULAR_HEIGHT,
} from '../helpers/constants/schedular';

interface Props {
  events: any[];
  weekDates: Date[];
  currentDate: Date;
  toggle: () => void;
}

const Week = ({ events, weekDates, currentDate, toggle }: Props) => {
  const { startHour: START_HOUR, endHour: END_HOUR } = useStore();

  useEffect(() => {
    // Get references to the content wrap and time cells wrap
    const contentWrap = document.querySelector('.e-content-wrap');
    const timeCellsWrap = document.querySelector('.e-time-cells-wrap');
    // Add a scroll event listener to the content wrap
    contentWrap?.addEventListener('scroll', function () {
      // Get the current scroll position of the content wrap
      const scrollTop = contentWrap.scrollTop;

      // Set the scroll position of the time cells wrap to match the content wrap
      timeCellsWrap?.scrollTo(0, scrollTop);
    });
  }, []);

  const hours = eachMinuteOfInterval(
    {
      start: new Date(new Date().setHours(START_HOUR)).setMinutes(0),
      end: new Date(new Date().setHours(END_HOUR)).setMinutes(0),
    },
    { step: 60 }
  );

  const weekDate1 = getAppointmentsByDates(weekDates[0], events);
  const weekDate2 = getAppointmentsByDates(weekDates[1], events);
  const weekDate3 = getAppointmentsByDates(weekDates[2], events);
  const weekDate4 = getAppointmentsByDates(weekDates[3], events);
  const weekDate5 = getAppointmentsByDates(weekDates[4], events);
  const weekDate6 = getAppointmentsByDates(weekDates[5], events);
  const weekDate7 = getAppointmentsByDates(weekDates[6], events);

  return (
    <React.Fragment>
      <div>
        <div className="mt-3">
          <table className="table table-bordered">
            {/* <thead>
              <tr>
                <th className="fw-normal text-center align-middle"></th>
                {(weekDates || []).map((date) => (
                  <th
                    key={date.toISOString()}
                    className={
                      isSameDay(date, currentDate)
                        ? 'fw-normal text-center align-middle text-Capitalize bg-primary text-white'
                        : 'fw-normal text-center align-middle text-Capitalize'
                    }
                  >
                    {format(date, 'd EEE')}
                  </th>
                ))}
              </tr>
            </thead> */}
            <tbody>
              <tr>
                <td className="fw-normal text-center align-middle"></td>
                <td className="p-0">
                  <div>
                    <table className="table mb-0">
                      <tbody>
                        <tr>
                          {(weekDates || []).map((date, i) => (
                            <td
                              colSpan={1}
                              key={date.toISOString() + i}
                              className={
                                isSameDay(date, currentDate)
                                  ? 'fw-normal text-center align-middle text-Capitalize text-primary'
                                  : 'fw-normal text-center align-middle text-Capitalize'
                              }
                              style={{ width: '116.6px' }}
                            >
                              {format(date, 'd EEE')}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr className="fs-10">
                <td className="p-0">
                  <div
                    className="e-time-cells-wrap overflow-hidden"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table table-bordered">
                      <tbody>
                        {(hours || []).map((time, idx) => {
                          return (
                            <tr className="borderd">
                              <td
                                key={time.toISOString() + idx}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w text-nowrap day-time-w fs-8 py-0 align-middle"
                              >
                                {format(time, 'hh:mm a')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </td>

                <td className="p-0">
                  <div
                    className="e-content-wrap position-relative"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table schedule-content-table">
                      <thead>
                        <tr>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate1}
                                day={weekDates[0]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate2}
                                day={weekDates[1]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate3}
                                day={weekDates[2]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate4}
                                day={weekDates[3]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate5}
                                day={weekDates[4]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate6}
                                day={weekDates[5]}
                              />
                            </div>
                          </td>
                          <td
                            className="e-day-wrapper w-100 p-0"
                            data-date=""
                            data-group-index="0"
                          >
                            <div
                              className="e-appointment-wrapper"
                              id="e-appointment-wrapper-0"
                            >
                              <RenderEvents
                                events={weekDate7}
                                day={weekDates[6]}
                              />
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {(hours || []).map((time, idx) => {
                          return (
                            <tr>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                style={{ height: CELL_HEIGHT }}
                                className="calendar-td calendar-td-w"
                              ></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <AppointmentsModal
            toggleAppointments={toggleAppointments}
            isAppointmentList={isAppointmentList}
          /> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Week;

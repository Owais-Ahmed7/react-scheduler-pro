import React from 'react';
import { isSameDay, format } from 'date-fns';
// import moment from 'moment';
// import chunk from '../../utils/chunk';

//appointment
// import AppointmentsModal from './AppointmentsModal';
import { appointmentMap, calendarTimes } from '../data';
import AppointmentWidget from '../EventWidget';
import { getEvents } from '../../utils/schedular';
import chunk from '../../utils/chunk';

interface WeekProps {
  weekDates: Date[];
  currentDate: Date;
  toggle: () => void;
}

const Week: React.FC<WeekProps> = ({ weekDates, currentDate, toggle }) => {
  const times = calendarTimes();

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
                    <table className="table table-bordered mb-0">
                      <tbody>
                        <tr>
                          {(weekDates || []).map((date) => (
                            <td
                              colSpan={1}
                              key={date.toISOString()}
                              className={
                                isSameDay(date, currentDate)
                                  ? 'fw-normal text-center align-middle text-Capitalize bg-primary text-white'
                                  : 'fw-normal text-center align-middle text-Capitalize'
                              }
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
                  <div>
                    <table className="table table-bordered">
                      <tbody>
                        {(times || []).map((time, idx) => {
                          return (
                            <tr>
                              <td
                                key={time + idx}
                                className="calendar-td calendar-td-h calendar-td-w day-time-w font-size-14"
                              >
                                {time}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </td>

                <td
                  className="p-0"
                  // onClick={() => {
                  //   toggleForm();
                  //   setDateTime({
                  //     date: new Date(day),
                  //     time: time,
                  //   });
                  // }}
                  // className="calendar-td calendar-td-h calendar-td-w day-block-w"
                >
                  <div className="position-relative">
                    <table className="table table-bordered schedule-content-table">
                      <tbody>
                        {(times || []).map((time, idx) => {
                          return (
                            <tr>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[0])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[1])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[2])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[3])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[4])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[5])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
                              <td
                                colSpan={1}
                                onClick={toggle}
                                className="calendar-td calendar-td-h calendar-td-w"
                              >
                                {(getEvents(weekDates[6])?.events || []).map(
                                  (event: any) => (
                                    <AppointmentWidget key={idx} item={event} />
                                  )
                                )}
                              </td>
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

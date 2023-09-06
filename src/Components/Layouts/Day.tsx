import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  appointmentMap,
  appointments,
  calendarTimes,
  getAppointmentsByDates,
} from '../data';
// import AppointmentWidget from './AppointmentWidget';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import AppointmentWidget from '../EventWidget';
import { getEvents } from '../../utils/schedular';
import { DEFAULT_SHEDULAR_HEIGHT } from '../../helpers/constants/schedular';

interface DayProps {
  // setIsAppointInfo: Dispatch<SetStateAction<boolean>>;
  // isAppointInfo: boolean;
  day: Date;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: Date; time: string }>>;
}

const Day: React.FC<DayProps> = ({
  // setIsAppointInfo,
  // isAppointInfo,
  day,
  toggleForm,
  setDateTime,
  ...rest
}) => {
  // appointment info modal
  // const [appoint, setAppoint] = useState();
  // const toggleAppoint = (e) => {
  //   e?.stopPropagation();
  //   setIsAppointInfo(!isAppointInfo);
  // };

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

  const calTimes = calendarTimes();

  return (
    <React.Fragment>
      <div className="w-100">
        <div id="day-layout-table" className="mt-3">
          <table className="table table-bordered mb-0">
            <tbody style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
              <tr>
                <td className="fw-normal text-center align-middle day-time-w"></td>
                <td className="fw-normal text-center align-middle text-primary day-block-w">
                  {format(day, 'EEEE')}
                </td>
              </tr>
              <tr className="fs-10">
                <td className="p-0">
                  <div
                    className="e-time-cells-wrap overflow-hidden"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table table-bordered mb-0">
                      <tbody>
                        {(calTimes || []).map((time, idx) => {
                          const event = getEvents(day);

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
                  <div
                    className="e-content-wrap position-relative"
                    style={{ height: DEFAULT_SHEDULAR_HEIGHT }}
                  >
                    <table className="table table-bordered schedule-content-table">
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
                              {(getAppointmentsByDates(day) || []).map(
                                (event, idx) => {
                                  const getHour = event.date.getHours();
                                  const getMinutes = event.date.getMinutes();
                                  const computeMinutePercentage =
                                    (getMinutes / 60) * 100;
                                  const computeTop =
                                    getHour * 100 +
                                    computeMinutePercentage -
                                    10; //10 half height of event widget
                                  return (
                                    <div
                                      className="w-75 e-appointment p-1"
                                      style={{
                                        top: `${computeTop}px`,
                                        left: '0%',
                                        backgroundColor: 'palevioletred',
                                      }}
                                      role="button"
                                      data-id={`appointment-${idx}`}
                                    >
                                      <h1 className="fs-10 mb-0">
                                        {event.name}
                                      </h1>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {(calTimes || []).map((time, idx) => {
                          return (
                            <tr>
                              <td
                                key={time + idx}
                                className="calendar-td calendar-td-h calendar-td-w day-time-w font-size-14"
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default Day;

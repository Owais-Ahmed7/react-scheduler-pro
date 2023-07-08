import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import moment from 'moment';
// import _ from "lodash";
import { appointments, calendarTimes } from './data';
import AppointmentWidget from './AppointmentWidget';
// import AppointmentsModal from "./AppointmentsModal";

interface DayProps {
  // setIsAppointInfo: Dispatch<SetStateAction<boolean>>;
  // isAppointInfo: boolean;
  day: string;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: string, time: string }>>;
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
  const [appoint, setAppoint] = useState();
  // const toggleAppoint = (e) => {
  //   e?.stopPropagation();
  //   setIsAppointInfo(!isAppointInfo);
  // };

  const calTimes = calendarTimes();

  return (
    <React.Fragment>
      <div className="w-100">
        <div
          id="day-layout-table"
          style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}
          className="mt-3"
        >
          <table className="table table-bordered mb-0">
            <thead>
              <tr>
                <th className="fw-normal text-center align-middle day-time-w"></th>
                <th className="fw-normal text-center align-middle text-primary day-block-w">
                  {moment(day).format('dddd')}
                </th>
              </tr>
            </thead>
            <tbody>
              {(calTimes || []).map((time, idx) => (
                <tr key={time + idx} className="fs-10">
                  <td className="calendar-td calendar-td-h calendar-td-w day-time-w font-size-14">
                    {time}
                  </td>
                  <td
                    onClick={() => {
                      toggleForm();
                      setDateTime({
                        date: moment(day).toISOString(),
                        time: time,
                      });
                    }}
                    className="calendar-td calendar-td-h calendar-td-w day-block-w"
                  >
                    {(appointments || [])
                      .filter((appoint, index) => {
                        console.log(appoint.date);
                        const appointDate = appoint.date;
                        const dayDate = moment(day).format('DD-MM-YYYY');
                        const date = moment(appointDate).format('DD-MM-YYYY');
                        const appointTime = moment(appointDate).format('HH:mm');
                        const nextTime =
                          calTimes[idx + 1] &&
                          moment(calTimes[idx + 1], 'h:mm A').format('HH:mm');
                        /* check here appointment time and date if the schedular time which is last have appointment 
                        then it will go to first condition which will be true else second condition which will be false 
                        because then schedular time will not be last which have appointment */
                        const check =
                          appointTime >=
                            moment(time, 'h:mm A').format('HH:mm') && !nextTime
                            ? dayDate === date &&
                              appointTime >=
                                moment(time, 'h:mm A').format('HH:mm')
                            : dayDate === date &&
                              appointTime >=
                                moment(time, 'h:mm A').format('HH:mm') &&
                              appointTime < nextTime;

                        if (check) return appoint;
                      })
                      .map((newApp, appIdx) => (
                        <React.Fragment key={appIdx}>
                          <AppointmentWidget
                            key={idx}
                            item={newApp}
                            // setAppoint={setAppoint}
                            // toggleAppoint={toggleAppoint}
                            {...rest}
                          />
                        </React.Fragment>
                      ))}
                    {/* {arr.length > 2 && (
                      <div
                        onClick={toggleAppointments}
                        className='bg-secondary text-white bg-opacity-50 w-75 fs-10'
                      >
                        + See more
                      </div>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <AppointmentsModal
            toggleAppointments={toggleAppointments}
            isAppointmentList={isAppointmentList}
          />
          <AppointmentInfoModal
            appoint={appoint}
            modal={isAppointInfo}
            toggle={toggleAppoint}
            {...props}
          /> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Day;

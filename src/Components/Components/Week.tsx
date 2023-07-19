import React from 'react';
import { isSameDay, format } from 'date-fns';
// import moment from 'moment';
// import chunk from '../../utils/chunk';

//appointment
// import AppointmentsModal from './AppointmentsModal';
import { calendarTimes } from './data';

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
            <thead>
              <tr>
                <th className="fw-normal text-center align-middle"></th>
                {(weekDates || []).map(date => (
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
            </thead>
            <tbody>
              {(times || []).map((time, idx) => (
                <tr key={time + idx} className="fs-10">
                  <td className="calendar-td calendar-td-h calendar-td-w">
                    {time}
                  </td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                  <td
                    onClick={toggle}
                    className="calendar-td calendar-td-h calendar-td-w"
                  ></td>
                </tr>
              ))}
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

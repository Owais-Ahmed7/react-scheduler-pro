import React, { Dispatch, SetStateAction } from 'react';
import { appointments, calendarTimes } from './data';
// import AppointmentWidget from './AppointmentWidget';
import { format } from 'date-fns';

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
                  {format(day, 'EEEE')}
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
                        date: new Date(day),
                        time: time,
                      });
                    }}
                    className="calendar-td calendar-td-h calendar-td-w day-block-w"
                  ></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Day;


/* ---------
Matching Algo Working on building new one which will be more cleaner and faster for day week month which will covers all layout requirments
If you want to use this one in current code then put it inside <td></td> and pass your appointments how ever we have changed it to date-fns as
it is more flexible and powerful instead of moment. 
--------- */


// {(appointments || [])
//   .filter((appoint, index) => {
//     // console.log(appoint.date);
//     const appointDate = appoint.date;
//     const dayDate = moment(day).format('DD-MM-YYYY');
//     const date = moment(appointDate).format('DD-MM-YYYY');
//     const appointTime = moment(appointDate).format('HH:mm');
//     const nextTime =
//       calTimes[idx + 1] &&
//       moment(calTimes[idx + 1], 'h:mm A').format('HH:mm');
//     /* check here appointment time and date if the schedular time which is last have appointment 
//     then it will go to first condition which will be true else second condition which will be false 
//     because then schedular time will not be last which have appointment */
//     const check =
//       appointTime >=
//         moment(time, 'h:mm A').format('HH:mm') && !nextTime
//         ? dayDate === date &&
//           appointTime >=
//             moment(time, 'h:mm A').format('HH:mm')
//         : dayDate === date &&
//           appointTime >=
//             moment(time, 'h:mm A').format('HH:mm') &&
//           appointTime < nextTime;

//     if (check) return appoint;
//   })
//   .map((newApp, appIdx) => (
//     <React.Fragment key={appIdx}>
//       <AppointmentWidget
//         key={idx}
//         item={newApp}
//         // setAppoint={setAppoint}
//         // toggleAppoint={toggleAppoint}
//         {...rest}
//       />
//     </React.Fragment>
//   ))}
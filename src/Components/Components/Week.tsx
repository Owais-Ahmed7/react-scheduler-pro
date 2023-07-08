// import React from 'react';
// import moment from 'moment';
// import chunk from '../../utils/chunk';
// import { hourTimes, fiftenMintTimes, thirtyMintTimes } from './data';

// //appointment
// import AppointmentsModal from './AppointmentsModal';

// //redux
// import { useSelector } from 'react-redux';

// const Week = (props) => {
//   const calendarTime = useSelector((state) => state.settings.calendarTiming);
//   const times =
//     calendarTime === '1 hour'
//       ? hourTimes
//       : calendarTime === '15 minutes'
//       ? fiftenMintTimes
//       : calendarTime === '30 minutes'
//       ? thirtyMintTimes
//       : [];

//   return (
//     <React.Fragment>
//       <div>
//         <div className='mt-3'>
//           <table className='table table-bordered'>
//             <thead>
//               <tr>
//                 <th className='fw-normal text-center align-middle'></th>
//                 {(props.weekDates || []).map((date, idx) => (
//                   <th
//                     key={date + idx}
//                     className={
//                       moment(date).format('DD-MM-YYYY') ===
//                       moment(props.currentDate).format('DD-MM-YYYY')
//                         ? 'fw-normal text-center align-middle text-Capitalize bg-primary text-white'
//                         : 'fw-normal text-center align-middle text-Capitalize'
//                     }
//                   >
//                     {moment(date).format('D ddd')}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {/* {(times || []).map((time, idx) => (
//                 <tr key={time + idx} className='fs-6'>
//                   <td className='calendar-td calendar-td-h calendar-td-w'>
//                     {time}
//                   </td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                   <td
//                     onClick={props.toggle}
//                     className='calendar-td calendar-td-h calendar-td-w'
//                   ></td>
//                 </tr>
//               ))} */}
//             </tbody>
//           </table>
//           <AppointmentsModal
//             toggleAppointments={props.toggleAppointments}
//             isAppointmentList={props.isAppointmentList}
//           />
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Week;

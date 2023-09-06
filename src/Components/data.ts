import {
  parse,
  format,
  addMinutes,
  addHours,
  parseISO,
  isSameDay,
} from 'date-fns';

/**
 *
 * @param {String} startTime - start time of doctor working timing.
 * @param {String} endTime - end time of doctor working timing.
 * @desc - it generate's an array of times from 12:00 AM to 11:55 PM with 5 minute difference in them.
 * @returns an array of times containg all the times form 12:00 AM to next mid night 11:50 PM
 */
const fiveMintTimes = (startTime: string, endTime: string) => {
  const times = [];
  let currentTime = parse(startTime, 'h:mm a', new Date());

  while (format(currentTime, 'h:mm a') !== endTime) {
    times.push(format(currentTime, 'h:mm a'));
    currentTime = addMinutes(currentTime, 5);
  }

  times.push(endTime);
  return times;
};

/**
 *
 * @param {String} startTime - start time of calendar timing.
 * @param {String} endTime - end time of calendar timing.
 * @param {String} timeDuration - time duration for calendar timing.
 * @returns an array of times according to calendar start time and end time via params.
 */
const calendarTimes = (
  startTime = '12:00 AM',
  endTime = '11:00 PM',
  timeDuration = '1 hour'
) => {
  const times = [];
  let currentTime = parse(startTime, 'h:mm a', new Date());

  const timeDiff = () => {
    if (timeDuration === '1 hour') {
      return addHours(currentTime, 1);
    } else if (timeDuration === '15 minutes') {
      return addMinutes(currentTime, 15);
    } else {
      return addMinutes(currentTime, 30);
    }
  };

  while (format(currentTime, 'h:mm a') !== endTime) {
    times.push(format(currentTime, 'h:mm a'));
    currentTime = timeDiff();
  }

  times.push(endTime);
  return times;
};

//For test
const appointments = [
  {
    name: 'First Appointment',
    date: new Date('2023-07-16T04:30:00.000+00:00'),
  },
  // {
  //   name: 'First Appointment',
  //   date: new Date('2023-07-16T04:30:00.000+00:00'),
  // },
  {
    name: 'Second Appointment',
    date: new Date('2023-07-17T06:30:00.000+00:00'),
  },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-17T06:30:00.000+00:00'),
  // },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-18T06:30:00.000+00:00'),
  // },
  {
    name: 'Third Appointment',
    date: new Date('2023-09-07T14:30:00.000+00:00'),
  },
  {
    name: 'Fourth Appointment',
    date: new Date('2023-07-18T20:30:00.000+00:00'),
  },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-18T06:30:00.000+00:00'),
  // },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-19T06:30:00.000+00:00'),
  // },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-20T06:30:00.000+00:00'),
  // },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-21T06:30:00.000+00:00'),
  // },
  // {
  //   name: 'Second Appointment',
  //   date: new Date('2023-07-22T06:30:00.000+00:00'),
  // },
];

/* -------------------------- Distribution Algorithm -------------------------- */

// Create an empty Map to store appointments with dates as keys and arrays as values
const appointmentMap = new Map();

// // Loop through the appointments array and group events with the same date
// appointments.forEach((appointment) => {
//   const { date, ...rest } = appointment;
//   const dateString = date.toISOString().split('T')[0]; // Convert date to string format 'YYYY-MM-DD'
//   // const dateString = date.toISOString();

//   // Check if the date key already exists in the Map
//   if (appointmentMap.has(dateString)) {
//     // If the date key exists, add the current appointment to the existing array
//     appointmentMap.get(dateString).events.push({ ...rest });
//   } else {
//     // If the date key does not exist, create a new array with the current appointment as the first element
//     appointmentMap.set(dateString, { date, events: [{ ...rest }] });
//   }
// });

/* -------------------------- Distribution Algorithm -------------------------- */

/**
 *
 * @param date - Pass the date for filtering the appointments
 * @returns an array of appointments after proccessing
 */
const getAppointmentsByDates = (date: Date) => {
  const appointmentsList = appointments.filter(
    (appointment) =>
      format(appointment.date, 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy')
  );

  return appointmentsList;
};

export {
  fiveMintTimes,
  calendarTimes,
  getAppointmentsByDates,
  appointments,
  appointmentMap,
};

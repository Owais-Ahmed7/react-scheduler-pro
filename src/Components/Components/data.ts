import { parse, format, addMinutes, addHours } from 'date-fns';

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
const calendarTimes = (startTime = '12:00 AM', endTime = '11:00 PM', timeDuration = '1 hour') => {
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
    date: new Date('2023-07-01T04:30:00.000+00:00')
  },
  {
    name: 'Second Appointment',
    date: new Date('2023-07-01T06:30:00.000+00:00')
  }
]

export {
  fiveMintTimes,
  calendarTimes,
  appointments
};

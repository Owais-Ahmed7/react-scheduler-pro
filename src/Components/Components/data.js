import moment from "moment";

/**
 *
 * @param {String} startTime - start time of doctor working timing.
 * @param {String} endTime - end time of doctor working timing.
 * @desc - it generate's an array of times from 12:00 AM to 11:55 PM with 5 minute difference in them.
 * @returns an array of times containg all the times form 12:00 AM to next mid night 11:50 PM
 */
const fiveMintTimes = (startTime, endTime) => {
  var times = [];
  var current = moment(startTime, "h:mm A");

  while (current.format("h:mm A") !== endTime) {
    times.push(current.format("h:mm A"));
    current.add(5, "minutes");
  }
  //we push end time here because we didn't inculded it in loop
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
  var times = [];
  var current = moment(startTime, "h:mm A");

  const timeDiff = () =>
    timeDuration === "1 hour"
      ? current.add(1, "hour")
      : timeDuration === "15 minutes"
      ? current.add(15, "minutes")
      : current.add(30, "minutes");

  while (current.format("h:mm A") !== endTime) {
    times.push(current.format("h:mm A"));
    timeDiff();
  }
  //we push end time here because we didn't inculded it in loop
  times.push(endTime);

  return times;
};

const appointments = [
  {
    name: 'First Appointment',
    date: new Date('2023-05-15T04:30:00.000+00:00')
  },
  {
    name: 'Second Appointment',
    date: new Date('2023-05-15T06:30:00.000+00:00')
  }
]

export {
  fiveMintTimes,
  calendarTimes,
  appointments
};

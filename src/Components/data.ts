import { format } from 'date-fns';

//For test
const appointments = [
  // {
  //   id: '1',
  //   name: 'First Appointment',
  //   startDate: new Date(new Date().setHours(4)),
  //   endDate: new Date(new Date(new Date().setHours(6)).setMinutes(5)),
  // },
  // {
  //   id: '2',
  //   name: 'Second Appointment',
  //   startDate: new Date(new Date(new Date().setHours(6)).setMinutes(50)),
  //   endDate: new Date(new Date(new Date().setHours(7)).setMinutes(50)),
  // },
  // {
  //   id: '22',
  //   name: 'Third Appointment',
  //   startDate: new Date(new Date(new Date().setHours(6)).setMinutes(50)),
  //   endDate: new Date(new Date(new Date().setHours(7)).setMinutes(50)),
  // },
  // {
  //   id: '221',
  //   name: 'Third Appointment h case',
  //   startDate: new Date(new Date(new Date().setHours(6)).setMinutes(50)),
  //   endDate: new Date(new Date(new Date().setHours(7)).setMinutes(50)),
  // },
  // {
  //   id: '23',
  //   name: 'Fourth Appointment',
  //   startDate: new Date(new Date(new Date().setHours(7)).setMinutes(55)),
  //   endDate: new Date(new Date(new Date().setHours(8)).setMinutes(50)),
  // },
  // {
  //   id: '234',
  //   name: 'Fourth Appointment H case',
  //   startDate: new Date(new Date(new Date().setHours(7)).setMinutes(55)),
  //   endDate: new Date(new Date(new Date().setHours(8)).setMinutes(50)),
  // },
  // {
  //   id: '2344',
  //   name: 'Fourth Appointment H case',
  //   startDate: new Date(new Date(new Date().setHours(8)).setMinutes(55)),
  //   endDate: new Date(new Date(new Date().setHours(9)).setMinutes(50)),
  // },
  // {
  //   id: '23412',
  //   name: 'Fourth Appointment H case',
  //   startDate: new Date(new Date(new Date().setHours(8)).setMinutes(55)),
  //   endDate: new Date(new Date(new Date().setHours(9)).setMinutes(50)),
  // },
  // {
  //   id: '24',
  //   name: 'Fifth Appointment',
  //   startDate: new Date(new Date(new Date().setHours(7)).setMinutes(55)),
  //   endDate: new Date(new Date(new Date().setHours(8)).setMinutes(50)),
  // },
  {
    id: '3',
    name: 'Sixth Appointment',
    startDate: new Date(new Date(new Date().setHours(6)).setMinutes(0)),
    endDate: new Date(new Date().setHours(15)),
  },
  // {
  //   id: '4',
  //   name: 'Seventh Appointment',
  //   startDate: new Date(new Date(new Date().setHours(6)).setMinutes(0)),
  //   endDate: new Date(new Date().setHours(15)),
  // },
  {
    id: '5',
    name: 'Eighth Appointment',
    startDate: new Date(new Date(new Date().setHours(15)).setMinutes(0)),
    endDate: new Date(new Date().setHours(16)),
  },
  {
    id: '6',
    name: 'Tenth Appointment',
    startDate: new Date(new Date(new Date().setHours(15)).setMinutes(30)),
    endDate: new Date(new Date().setHours(17)),
  },
  // {
  //   id: '7',
  //   name: 'Eelventh Appointment',
  //   startDate: new Date(new Date(new Date().setHours(16)).setMinutes(30)),
  //   endDate: new Date(new Date().setHours(18)),
  // },
  // {
  //   id: '7453',
  //   name: 'Eelventh Appointment h case',
  //   startDate: new Date(new Date(new Date().setHours(16)).setMinutes(30)),
  //   endDate: new Date(new Date().setHours(18)),
  // },
  // {
  //   id: '74533',
  //   name: 'Eelventh Appointment h case',
  //   startDate: new Date(new Date(new Date().setHours(16)).setMinutes(30)),
  //   endDate: new Date(new Date().setHours(18)),
  // },
  // {
  //   id: '74532',
  //   name: 'Eelventh Appointment h case',
  //   startDate: new Date(new Date(new Date().setHours(16)).setMinutes(30)),
  //   endDate: new Date(new Date().setHours(18)),
  // },
];

/**
 *
 * @param date - Pass the date for filtering the appointments
 * @returns an array of appointments after proccessing
 */
const getAppointmentsByDates = (date: Date, events: any[]) => {
  const eventsList = events.filter((appointment) => {
    return (
      format(appointment.startDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  });

  const sortByStartDate = eventsList.sort(
    (a: any, b: any) => a.startDate - b.startDate
  );

  return sortByStartDate;
};

/**
 *
 * @param events - Pass the Events for sorting in ascending order.
 * @returns an array of sorted events
 */
const sortEvents = (events: any[]) => {
  return events.sort((a: any, b: any) => a.startDate - b.startDate);
};

export { getAppointmentsByDates, sortEvents, appointments };

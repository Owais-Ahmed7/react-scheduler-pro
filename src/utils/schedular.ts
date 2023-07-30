import {
  format,
  addDays,
  subDays,
  startOfWeek,
  eachDayOfInterval,
} from 'date-fns';

//events converted to map data structure
import { appointmentMap } from '../Components/data';

const getMonthDates = (trackMonth: Date, actionType: string): Date[] => {
  let getSunday = startOfWeek(trackMonth, { weekStartsOn: 0 });

  const dates =
    actionType === 'init' || actionType === 'next'
      ? eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 41) })
      : eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 41) });

  return dates;
};

const getWeekDates = (currentDate: Date, actionType: string): Date[] => {
  let getSunday = startOfWeek(currentDate, { weekStartsOn: 0 });

  const dates =
    actionType === 'init' || actionType === 'next'
      ? eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 6) })
      : eachDayOfInterval({ start: getSunday, end: addDays(getSunday, 6) });

  return dates;
};

const getDay = (currentDate: Date, actionType: string): Date => {
  const date =
    actionType === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);

  return date;
};

const getEvents = (day: Date): any => {
  const matchedEventDocument = appointmentMap.get(format(day, 'yyyy-MM-dd'));

  return matchedEventDocument;
};

export { getMonthDates, getWeekDates, getDay, getEvents };

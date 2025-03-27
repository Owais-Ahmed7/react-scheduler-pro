import { enUS } from 'date-fns/locale';
import { Store } from '../types';

const initialState: Store = {
  schedulerHeight: 600,

  resources: [] as any[],
  events: [] as any[],

  weekDays: {
    day: [0],
    week: [0, 1, 2, 3, 4, 5, 6],
  },

  //message
  message: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    more: 'More',
  },

  //modal size
  modalSize: 'md',

  dispatch: (name: string, value: string) => {},

  //date formats
  // dayFormat: '',
  // dateFormat: '',

  //view
  view: 'week',
  views: ['day', 'week', 'month'],

  //date
  selectedDate: new Date(),

  //hour format
  hourFormat: 12,

  //locale
  locale: enUS,
  // timezone: 'Asia/Karachi',

  //week && day
  step: 60,
  startHour: 0,
  endHour: 23,

  //month
  weekStartsOn: 0,

  //new event, prev event
  eventDialog: {
    date: null as Date | null,
    event: null as any | null,
    isOpen: false,
  },

  resourceFields: {
    id: 'resourceId',
    title: 'title',
  },
  fields: {
    id: '_id',
    subject: 'name',
    start: 'startDate',
    end: 'endDate',
  },

  //trigger popover
  popover: { open: false, event: null as Date | null },
};

export default initialState;

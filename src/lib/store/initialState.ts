import { enUS } from 'date-fns/locale';
import { Store } from '../types';

const initialState: Store = {
  schedulerHeight: 600,

  resources: [],
  events: [],

  weekDays: {
    workweek: [1, 2, 3, 4, 5],
    // custom: {},
  },

  //message
  message: {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    workweek: 'Work Week',
    more: 'More',
  },

  //modal size
  modalSize: 'md',

  dispatch: (_name: string, _value: unknown) => {},

  //date formats
  // dayFormat: '',
  // dateFormat: '',

  //view
  view: 'week',
  views: ['day', 'week', 'month', 'workweek'],

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
    date: null,
    event: null,
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

  // Drag and drop
  draggable: true,
  resizable: true,

  //trigger popover
  popover: { open: false, event: null },
};

export default initialState;

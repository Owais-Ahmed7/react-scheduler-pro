import { enUS } from 'date-fns/esm/locale';
import { SchedulerProps, event, resource } from '../types';

const initialState = {
  schedulerHeight: 600,

  resources: [] as resource[],
  events: [] as event[],

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
  weekStartOn: 6,

  //new event, prev event
  eventDialog: {
    date: null as Date | null,
    event: null as any | null,
    isOpen: false,
  },

  resourceFields: {
    id: 'resourceId',
    title: 'title',
    backgroundColor: 'backgroundColor',
  },
  fields: {
    id: '_id',
    subject: 'name',
    start: 'startDate',
    end: 'endDate',
    backgroundColor: 'backgroundColor',
    resourceId: 'resourceId',
    allDay: 'isAllDay',
  },

  eventFormContext: null as SchedulerProps['eventFormContext'] | null,

  //trigger popover
  popover: { open: false, event: null as Date | null },

  // eventTemplate: (toggle: () => void, date: Date) => ReactNode,
};

export default initialState;

export interface CurrentTimeBarProps {
  today: Date;
  startHour: number;
  step: number;
  renderTime: boolean;
  hourFormat: 12 | 24;
  timezone?: string;
  color?: string;
}

export type DayHours =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export type voidFunction = () => void;

export type view = 'day' | 'week' | 'month';

export type days = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type fieldsType = {
  id: string;
  subject: string;
  start: string;
  end: string;
  backgroundColor?: string;
  resourceId?: string;
  allDay?: string;
};

// export type event = {
//   [key: string]: string | Date;
// };

// export type resource = {
//   [key: string]: string;
// };
export type eventFormContextType = {
  toggle: voidFunction;
  start: Date;
  end: Date;
  event: any;
  resource: any;
};
export type slotGetterType = { date: Date };
export type eventPopoverType = { event: any; togglePopover: voidFunction };
export type allEventsPopoverType = {
  date: Date;
  events: any[];
  view: view;
  togglePopover: voidFunction;
};
export type onEditEventType = { event: any; resource: any };
export type onDeleteEventType = { event: any; resource: any };
export type eventItemType = {
  event: any;
  view: view;
  hasNext: boolean;
  hasPrevious: boolean;
  resource: any;
  styles: any;
};
export type resourceType = { resource: any; view: view };
export type onNavigateType = { date: Date; start: Date; end: Date; view: view };
export type onViewType = { view: view };
export type onSlotType = { start: Date; end: Date; resource: any };
export type onDoubleClickEventType = {
  event: any;
  resource: any;
};
export type onClickEventType = {
  event: any;
  resource: any;
};
export type disptach = (name: string, value: string) => void;

export interface SchedulerProps {
  schedulerHeight?: number;
  events: any[] | null;
  resources?: any[] | null;

  //dispatch
  dispatch?: disptach;

  weekDays?: {
    day: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
    week: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  };

  //message
  message?: {
    today: string;
    month: string;
    week: string;
    day: string;
    more: string;
  };

  //modal size
  modalSize?: 'sm' | 'md' | 'lg' | 'xl';

  slotPropGetter?: (props: slotGetterType) => {
    styles?: any;
    classnames?: string;
  };

  //handle prev next
  onNavigate?: (props: onNavigateType) => void | null;
  onView?: (props: onViewType) => void | null;
  onSlot?: (props: onSlotType) => void | null;
  onEditEvent?: (props: onEditEventType) => void | null;
  onDeleteEvent?: (props: onDeleteEventType) => void | null;
  onClickEvent?: (props: onClickEventType) => void | null;
  onDoubleClickEvent?: (props: onDoubleClickEventType) => void | null;

  //view
  view?: view;
  views?: view[];

  //date
  selectedDate?: Date;

  //hour format
  hourFormat?: 12 | 24;
  timeFormat?: string | undefined;

  //locale
  locale?: Locale;
  timezone?: string;

  //week && day
  step?: number;
  startHour?: DayHours;
  endHour?: DayHours;

  //month
  weekStartsOn?: days;

  //new any, prev event
  eventDialog?: {
    date: Date | null;
    event: any | null;
    isOpen: boolean;
  };

  fields: fieldsType;
  resourceFields?: {
    id: string;
    title: string;
    backgroundColor?: string;
  };

  eventFormContext?: ({
    toggle,
    start,
    end,
    event,
    resource,
  }: eventFormContextType) => JSX.Element | null;

  allEventsPopoverTemplate?: (
    props: allEventsPopoverType
  ) => JSX.Element | null;
  eventPopoverTemplate?: (props: eventPopoverType) => JSX.Element | null;
  eventTemplate?: (props: eventItemType) => JSX.Element | null;
  resourceTemplate?: (props: resourceType) => JSX.Element | null;

  //trigger popover
  popover?: { open: boolean; event: any | null };
}

export interface Store extends SchedulerProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  fields: fieldsType;
  view: view;
  views: view[];
}

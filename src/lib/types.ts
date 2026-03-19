import { CSSProperties } from 'react';

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

export type view = 'day' | 'week' | 'month' | 'workweek' | string;

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

// Base event type - represents any user-provided event after field mapping.
// Uses Record since the exact shape depends on the user's field configuration.
export type MappedEvent = Record<string, unknown>;

// Resource type - represents any user-provided resource.
export type Resource = Record<string, unknown>;

// Resource fields configuration
export interface ResourceFields {
  id: string;
  title: string;
  backgroundColor?: string;
}

// Event dialog state
export interface EventDialogState {
  date: Date | null;
  event: MappedEvent | null;
  isOpen: boolean;
  resource?: Resource;
  start?: Date;
  end?: Date;
  [key: string]: unknown;
}

// Popover state
export interface PopoverState {
  open: boolean;
  event: MappedEvent | null;
}

// Message interface
export interface SchedulerMessage {
  today: string;
  month: string;
  week: string;
  day: string;
  workweek: string;
  more: string;
  [key: string]: string; // Allow custom view labels
}

// WeekDays configuration
export interface WeekDaysConfig {
  workweek?: days[];
  custom?: {
    [key: string]: days[];
  };
}

// Dispatch function type
export type DispatchFn = (name: string, value: unknown) => void;

// Slot property getter return type
export interface SlotPropGetterResult {
  styles?: CSSProperties;
  classnames?: string;
}

// Distributed event column - used by event distribution algorithm
export interface EventColumn {
  events: MappedEvent[];
}

// Resourced events entry
export interface ResourcedEventsEntry {
  resourceEvents: MappedEvent[];
}

// Show more events state
export interface ShowMoreEventsState {
  date: Date | null;
  events: MappedEvent[] | null;
  resource: Resource | null;
}

export type eventFormContextType = {
  toggle: voidFunction;
  start: Date;
  end: Date;
  event: MappedEvent | null;
  resource: Resource | null;
};
export type slotGetterType = { date: Date };
export type eventPopoverType = {
  event: MappedEvent;
  togglePopover: voidFunction;
};
export type allEventsPopoverType = {
  date: Date | null;
  events: MappedEvent[] | null;
  view: view;
  togglePopover: voidFunction;
};
export type onEditEventType = { event: MappedEvent; resource: Resource | null };
export type onDeleteEventType = {
  event: MappedEvent;
  resource: Resource | null;
};
export type eventItemType = {
  event: MappedEvent;
  view: view;
  hasNext: boolean;
  hasPrevious: boolean;
  resource: Resource | null;
  styles: CSSProperties;
};
export type resourceType = { resource: Resource; view: view };
export type onNavigateType = {
  date: Date | null;
  start: Date | null;
  end: Date | null;
  view: view;
};
export type onViewType = { view: view };
export type onSlotType = {
  start: Date;
  end: Date;
  resource?: Resource;
  [key: string]: unknown;
};
export type onDoubleClickEventType = {
  event: MappedEvent;
  resource: Resource | null;
};
export type onClickEventType = {
  event: MappedEvent;
  resource: Resource | null;
};
export type onEventDropType = {
  event: MappedEvent;
  start: Date;
  end: Date;
  resource?: Resource;
  originalEvent: MappedEvent;
};

export type onEventResizeType = {
  event: MappedEvent;
  start: Date;
  end: Date;
  originalEvent: MappedEvent;
};

/** @deprecated Use DispatchFn instead */
export type dispatch = DispatchFn;

export interface SchedulerProps {
  schedulerHeight?: number;
  events: MappedEvent[] | null;
  resources?: Resource[] | null;

  //dispatch
  dispatch?: DispatchFn;

  weekDays?: WeekDaysConfig;

  //message
  message?: SchedulerMessage;

  //modal size
  modalSize?: 'sm' | 'md' | 'lg' | 'xl';

  slotPropGetter?: (props: slotGetterType) => SlotPropGetterResult;

  //handle prev next
  onNavigate?: (props: onNavigateType) => void | null;
  onView?: (props: onViewType) => void | null;
  onSlot?: (props: onSlotType) => void | null;
  onEditEvent?: (props: onEditEventType) => void | null;
  onDeleteEvent?: (props: onDeleteEventType) => void | null;
  onClickEvent?: (props: onClickEventType) => void | null;
  onDoubleClickEvent?: (props: onDoubleClickEventType) => void | null;

  // Drag and drop
  draggable?: boolean;
  resizable?: boolean;
  onEventDrop?: (props: onEventDropType) => void | null;
  onEventResize?: (props: onEventResizeType) => void | null;

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

  //new event, prev event
  eventDialog?: EventDialogState;

  fields: fieldsType;
  resourceFields?: ResourceFields;

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
  popover?: PopoverState;
}

export interface Store extends SchedulerProps {
  startHour: DayHours;
  endHour: DayHours;
  step: number;
  fields: fieldsType;
  view: view;
  views: view[];
  dispatch: DispatchFn;
  selectedDate: Date;
  locale: Locale;
  weekStartsOn: days;
  schedulerHeight: number;
  message: SchedulerMessage;
  eventDialog: EventDialogState;
  modalSize: 'sm' | 'md' | 'lg' | 'xl';
  weekDays: WeekDaysConfig;
  resourceFields: ResourceFields;
  popover: PopoverState;
  hourFormat: 12 | 24;
  // Internal state properties
  multiDayEventsHFactor?: number;
}

import React from 'react';
import StoreProvider from './store/provider';
import SchedulerComponent from './Components';
import { SchedulerProps } from './types';

const Scheduler: React.FC<SchedulerProps> = (props) => {
  return (
    <StoreProvider initial={props}>
      <SchedulerComponent {...props} />
    </StoreProvider>
  );
};

export { Scheduler };

export type {
  SchedulerProps,
  CurrentTimeBarProps,
  DayHours,
  view,
  days,
  fieldsType,
  eventFormContextType,
  slotGetterType,
  eventPopoverType,
  allEventsPopoverType,
  onEditEventType,
  onDeleteEventType,
  eventItemType,
  resourceType,
  onNavigateType,
  onViewType,
  onSlotType,
  onDoubleClickEventType,
  onClickEventType,
  onEventDropType,
  onEventResizeType,
  dispatch,
  DispatchFn,
  Store,
  MappedEvent,
  Resource,
  ResourceFields,
  EventDialogState,
  PopoverState,
  SchedulerMessage,
  WeekDaysConfig,
  SlotPropGetterResult,
  EventColumn,
  ResourcedEventsEntry,
  ShowMoreEventsState,
} from './types';

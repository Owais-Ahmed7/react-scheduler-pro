import React from 'react';
import useStore from '../hooks/useStore';
import TimeGrid from '../Components/TimeGrid';
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from 'date-fns';

const WorkWeek = () => {
  const {
    schedulerHeight: SCHEDULER_HEIGHT,
    startHour: START_HOUR,
    endHour: END_HOUR,
    weekDays,
    hourFormat,
    selectedDate,
    step,
    events,
    locale,
    timezone,
    fields,
    resources,
    resourceFields,
    weekStartsOn,
  }: any = useStore();

  // Use workweek configuration if available, otherwise fallback to weekdays (Mon-Fri)
  const displayDays = weekDays?.workweek;

  return (
    <React.Fragment>
      <TimeGrid
        weekDays={displayDays}
        startOfWk={startOfDay(startOfWeek(selectedDate, { weekStartsOn }))}
        endOfWk={endOfDay(endOfWeek(selectedDate, { weekStartsOn }))}
        schedulerHeight={SCHEDULER_HEIGHT}
        startHour={START_HOUR}
        endHour={END_HOUR}
        hourFormat={hourFormat}
        selectedDate={selectedDate}
        step={step}
        events={events}
        locale={locale}
        timezone={timezone}
        fields={fields}
        resources={resources}
        resourceFields={resourceFields}
      />
    </React.Fragment>
  );
};

export default WorkWeek;

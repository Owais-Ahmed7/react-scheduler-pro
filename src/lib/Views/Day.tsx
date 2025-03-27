import React from 'react';
import useStore from '../hooks/useStore';
import TimeGrid from '../Components/TimeGrid';
import { endOfDay, startOfDay } from 'date-fns';

const Day = () => {
  const {
    schedulerHeight: SCHEDULER_HEIGHT,
    startHour: START_HOUR,
    endHour: END_HOUR,
    // weekDays,
    hourFormat,
    selectedDate,
    step,
    events,
    locale,
    timezone,
    fields,
    resources,
    resourceFields,
  }: any = useStore();
  const weekDays = [0];

  return (
    <React.Fragment>
      <TimeGrid
        weekDays={weekDays}
        startOfWk={startOfDay(selectedDate)}
        endOfWk={endOfDay(selectedDate)}
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

export default Day;

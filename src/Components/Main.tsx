import React, { Dispatch, SetStateAction, useMemo } from 'react';

//components
import Month from '../Layouts/Month';
import Week from '../Layouts/Week';
import Day from '../Layouts/Day';

interface Props {
  layout: string;
  events: any[];
  day: Date;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: Date; time: string }>>;
  // monthDates: Date[];
  trackMonth: Date;
  weekDates: Date[];
  currentDate: Date;
}

const Main = ({
  layout,
  events,
  day,
  toggleForm,
  setDateTime,
  trackMonth,
  // monthDates,
  weekDates,
  currentDate,
  ...rest
}: Props) => {
  return (
    <React.Fragment>
      <div className="w-100">
        {layout === 'day' && (
          <Day
            day={day}
            toggleForm={toggleForm}
            setDateTime={setDateTime}
            events={events}
            {...rest}
          />
        )}
        {layout === 'week' && (
          <Week
            currentDate={currentDate}
            toggle={toggleForm}
            weekDates={weekDates}
            events={events}
            {...rest}
          />
        )}
        {layout === 'month' && (
          <Month
            currentDate={currentDate}
            // monthDates={monthDates}
            trackMonth={trackMonth}
            toggleForm={toggleForm}
            events={events}
            {...rest}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Main;

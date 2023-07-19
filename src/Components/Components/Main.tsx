import React, { Dispatch, SetStateAction } from 'react';

//components
import Month from './Month';
import Week from './Week';
import Day from './Day';

interface MainProps {
  layout: string;
  day: Date;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: Date; time: string }>>;
  monthDates: Date[];
  weekDates: Date[];
  currentDate: Date;
}

const Main: React.FC<MainProps> = ({
  layout,
  day,
  toggleForm,
  setDateTime,
  weekDates,
  monthDates,
  currentDate,
  ...rest
}) => {
  return (
    <React.Fragment>
      <div className="w-100">
        {layout === 'day' && (
          <Day day={day} toggleForm={toggleForm} setDateTime={setDateTime} />
        )}
        {layout === 'week' && (
          <Week
            currentDate={currentDate}
            toggle={toggleForm}
            weekDates={weekDates}
          />
        )}
        {layout === 'month' && (
          <Month
            currentDate={currentDate}
            monthDates={monthDates}
            toggleForm={toggleForm}
            {...rest}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Main;

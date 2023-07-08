import React, { Dispatch, SetStateAction } from 'react';

//components
import Month from './Month';
// import Week from './Week';
import Day from './Day';

interface RestProps {
  setIsAppointInfo: Dispatch<SetStateAction<boolean>>;
  isAppointInfo: boolean;
  day: string;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<string>>;
}

interface MainProps {
  layout: string;
  day: string;
  toggleForm: () => void;
  setDateTime: Dispatch<SetStateAction<{ date: string; time: string }>>;
  monthDates: string[];
  currentDate: string;
  // dates: any[],
  // // setIsAppointInfo: Dispatch<SetStateAction<boolean>>,
  // // isAppointInfo: boolean,
  // day: string,
  // toggleForm: () => void,
  // setDateTime: Dispatch<SetStateAction<{ date: string, time: string }>>
  // monthDates: string[],
  // weekDates: string[],
  // currentDate: string,
  // isForm: boolean,
  // rest: RestProps,
}

const Main: React.FC<MainProps> = ({
  layout,
  day,
  toggleForm,
  setDateTime,
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
        {/* {layout === 'week' && <Week {...rest} />} */}
        {/* {layout === 'month' && (
          <Month
            currentDate={currentDate}
            monthDates={monthDates}
            toggleForm={toggleForm}
            {...rest}
          />
        )} */}
      </div>
    </React.Fragment>
  );
};

export default Main;

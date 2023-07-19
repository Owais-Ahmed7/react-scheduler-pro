import React, { ReactNode, useEffect, useState } from 'react';

//components
import Header from './Components/Header';
import Main from './Components/Main';
import FormModal from './Components/FormModal';
import { getMonthDates, getWeekDates } from '../utils/schedular';
import { startOfMonth } from 'date-fns';

interface SchedularProps {
  startTime: string;
  endTime: string;
  timeDifference: string[];
  fontSize: string;
  colorTheme: string;
  layouts: string[];
  data: any[];
  EventFormContext: ReactNode;
}

/**
 *
 * @param {Object} props - Object contains all the passed props according to user usage.
 * @param {String} props.startTime - Start time is used in day and week layout its the start time of schedular time (e.g startTime = 10:00 AM).
 * @param {String} props.endTime - End time is used in day and week layout its the end time of schedular time (e.g endTime = 8:00 PM).
 * @param {Array} props.timeDifference - Time difference is the difference between times of schedular in day & week layout (e.g timeDifference = ['1', 'hour / minutes']).
 * @param {String} props.fontSize - Font size is the adjustment of font user can do according to its own use case.
 * @param {String} props.colorTheme - Theme or Color theme user can pass custom color or can pass default bootstrap color themes. (e.g colorTheme = 'primary / info / '#1d1d1d').
 * @param {Array} props.layouts - Layout are the layouts (Day, Week, Month). User can decide how many layouts he want and have the freedom to select all or any one / two of them (e.g layouts = ['day', 'week', 'month']).
 * @param {Array} props.data - User should pass the data(appointments / events) that are used to shown on Schedular.
 * @returns
 */
const Schedular: React.FC<SchedularProps> = (props) => {
  //dates ranging from current month 1st date to next 35th
  const [trackMonth, setTrackMonth] = useState<Date>(startOfMonth(new Date()));
  let [monthDates, setMonthDates] = useState<Date[]>([]);
  //week dates
  let [weekDates, setWeekDates] = useState<Date[]>([]);
  //day dates
  const [day, setDay] = useState<Date>(new Date());
  //current date
  const currentDate = new Date();

  useEffect(() => {
    const wkDates = getWeekDates(currentDate, 'init');
    const mthDates = getMonthDates(trackMonth, 'init');
    setWeekDates(wkDates);
    setMonthDates(mthDates);
  }, []);

  //change layout
  const [layout, setLayout] = useState<string>('day');

  /* Schedular Form Modal */
  const [isForm, setForm] = useState<boolean>(false);
  const toggleForm = () => setForm(!isForm);

  /* Schedular date time from selected box */
  const [dateTime, setDateTime] = useState<{ date: Date; time: string }>({
    date: new Date(),
    time: '',
  });


  return (
    <React.Fragment>
      <div className="w-100">
        <Header
          setMonthDates={setMonthDates}
          setWeekDates={setWeekDates}
          setLayout={setLayout}
          layout={layout}
          weekDates={weekDates}
          day={day}
          setDay={setDay}
          trackMonth={trackMonth}
          setTrackMonth={setTrackMonth}
          {...props}
        />
        <Main
          day={day}
          monthDates={monthDates}
          weekDates={weekDates}
          currentDate={currentDate}
          layout={layout}
          toggleForm={toggleForm}
          setDateTime={setDateTime}
          {...props}
        />
        <FormModal
          isOpen={isForm}
          toggle={toggleForm}
          day={day}
          dateTime={dateTime}
          EventFormContext={props.EventFormContext}
        />
      </div>
    </React.Fragment>
  );
};

export default Schedular;

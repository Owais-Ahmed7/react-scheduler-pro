import React, { ReactNode, useEffect, useState } from 'react';
import moment from 'moment';

//components
import Header from './Components/Header';
import Main from './Components/Main';
import FormModal from './Components/FormModal';
import { getDay, getMonthDates, getWeekDates } from '../utils/schedular';

interface SchedularProps {
  startTime: String;
  endTime: String;
  timeDifference: String[];
  fontSize: String;
  colorTheme: String;
  layouts: String[];
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
  const [trackMonth, setTrackMonth] = useState<string>(
    moment().startOf('month').toISOString()
  );
  let [monthDates, setMonthDates] = useState<string[]>([]);
  //week dates
  let [weekDates, setWeekDates] = useState<string[]>([]);
  //day dates
  const [day, setDay] = useState<string>(moment().toISOString());

  //current date
  const currentDate = new Date().toISOString();

  useEffect(() => {
    getDay('', day, 'init', setDay);
    getWeekDates(currentDate, 'init', setWeekDates);
    getMonthDates('init', trackMonth, setMonthDates);
  }, []);

  //change layout
  const [layout, setLayout] = useState<string>('day');

  /* Toggle Appointment Popover */
  // const [prevId, setPrevId] = useState("");
  // const toggleAppointment = (e, id) => {
  //   e.stopPropagation();
  //   const popover = document.getElementById(id);
  //   const container = document.getElementById('day-layout-table');

  //   const bounds = popover.getBoundingClientRect();
  //   const winHeight = window.innerHeight;

  //   //check wheather space from bottom is less that your tooltip height
  //   const rBottom = winHeight - bounds.bottom;

  //   if (popover.classList.contains("popover__show")) {
  //     popover.classList.remove("popover__show");
  //   } else {
  //     /*@Remove previous popover */
  //     if (prevId)
  //       document.getElementById(prevId).classList.remove("popover__show");
  //     popover.classList.add("popover__show");
  //     setPrevId(id);
  //   }
  // };

  /* All Appointments List */
  // const [isAppointmentList, setIsAppointmentList] = useState(false);
  // const toggleAppointments = (e) => {
  //   e.stopPropagation();
  //   setIsAppointmentList(!isAppointmentList);
  // };

  /* Schedular Form Modal */
  const [isForm, setForm] = useState<boolean>(false);
  const toggleForm = () => setForm(!isForm);

  /* Schedular date time from selected box */
  const [dateTime, setDateTime] = useState<{ date: string, time: string }>({
    date: '',
    time: '',
  });

  /* Handle Popover Toggle (uncontrolled popover) */
  // const handleDocClick = () => {
  //   if (prevId) {
  //     if (document.getElementById(prevId)?.classList?.length > 0)
  //       document.getElementById(prevId).classList.remove("popover__show");
  //     setPrevId("");
  //   }
  // };

  //appointment info modal
  // const [isAppointInfo, setIsAppointInfo] = useState(false);

  // useEffect(() => {
  //   document.addEventListener("click", handleDocClick);
  //   return () => {
  //     document.removeEventListener("click", handleDocClick);
  //   };
  // }, [handleDocClick]);

  return (
    <React.Fragment>
      <div className="w-100">
        <Header
          setMonthDates={setMonthDates}
          setWeekDates={setWeekDates}
          setLayout={setLayout}
          layout={layout}
          // monthDates={monthDates}
          weekDates={weekDates}
          day={day}
          setDay={setDay}
          trackMonth={trackMonth}
          setTrackMonth={setTrackMonth}
          {...props}        />
        <Main
          day={day}
          monthDates={monthDates}
          // weekDates={weekDates}
          currentDate={currentDate}
          layout={layout}
          toggleForm={toggleForm}
          // isForm={isForm}
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

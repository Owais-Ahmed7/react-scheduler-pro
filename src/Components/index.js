import React, { useEffect, useState } from "react";
import moment from "moment";

//components
import Header from "./Components/Header";
import Main from "./Components/Main";
import FormModal from "./Components/FormModal";
import { getDay, getMonthDates, getWeekDates } from "../utils/date-utils";

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Schedular = (props) => {
  //const dispatch = useDispatch();
  //dates ranging from current month 1st date to next 35th
  const [trackMonth, setTrackMonth] = useState(moment().startOf("month"));
  let [monthDates, setMonthDates] = useState([]);
  //week dates
  let [weekDates, setWeekDates] = useState([]);
  //day dates
  const [day, setDay] = useState(moment());

  //current date
  const currentDate = new Date();

  useEffect(() => {
    getDay('', day, 'init', setDay);
    getWeekDates(currentDate, '', 'init', setWeekDates);
    getMonthDates('init', trackMonth, setMonthDates);
  }, [])

  //change layout
  const [layout, setLayout] = useState("day");

  /* Toggle Appointment Popover */
  const [prevId, setPrevId] = useState("");
  const toggleAppointment = (e, id) => {
    e.stopPropagation();
    const popover = document.getElementById(id);
    const container = document.getElementById('day-layout-table');

    const bounds = popover.getBoundingClientRect();
    const winHeight = window.innerHeight;

    //check wheather space from bottom is less that your tooltip height
    const rBottom = winHeight - bounds.bottom;

    if (popover.classList.contains("popover__show")) {
      popover.classList.remove("popover__show");
    } else {
      /*@Remove previous popover */
      if (prevId)
        document.getElementById(prevId).classList.remove("popover__show");
      popover.classList.add("popover__show");
      setPrevId(id);
    }
  };

  /* All Appointments List */
  const [isAppointmentList, setIsAppointmentList] = useState(false);
  const toggleAppointments = (e) => {
    e.stopPropagation();
    setIsAppointmentList(!isAppointmentList);
  };

  /* Schedular Form Modal */
  const [isForm, setForm] = useState(false);
  const toggleForm = () => setForm(!isForm);

  /* Schedular date time from selected box */
  const [dateTime, setDateTime] = useState({
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
  const [isAppointInfo, setIsAppointInfo] = useState(false);

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
          setLayout={setLayout}
          layout={layout}
          monthDates={monthDates}
          weekDates={weekDates}
          day={day}
          setDay={setDay}
          getMonthDates={getMonthDates}
          getWeekDates={getWeekDates}
          getDay={getDay}
          trackMonth={trackMonth}
          setTrackMonth={setTrackMonth}
          {...props}
        />
        <Main
          day={day}
          dates={monthDates}
          weekDates={weekDates}
          currentDate={currentDate}
          layout={layout}
          toggleForm={toggleForm}
          isForm={isForm}
          setDateTime={setDateTime}
          {...props}
        />
        <FormModal
          isOpen={isForm}
          toggle={toggleForm}
          day={day}
          dateTime={dateTime}
        />
      </div>
    </React.Fragment>
  );
};

export default Schedular;

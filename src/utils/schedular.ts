import moment from "moment";
import { Dispatch, SetStateAction } from "react";

// interface 

const getMonthDates = (actionType: string, trackMonth: string = '', setMonthDates: Dispatch<SetStateAction<string[]>>): void => {
  let startDate = moment(trackMonth);
  if (startDate.day() !== 0) {
    while (startDate.day() !== 0) {
      startDate = startDate.subtract(1, "days");
    }
  }

  let dates: any[] = [];
  //get an array consisting for 35 dates(forward/backward)
  if (actionType === "next" || actionType === "init") {
    for (let i = 0; i < 42; i++) {
      let date = startDate.clone().add(i, "days").toISOString();
      dates = [...dates, date];
    }
    setMonthDates(dates);
  } else {
    for (var i = 0; i < 42; i++) {
      let date = startDate.clone().subtract(i, "days").toISOString();
      dates = [date, ...dates];
    }
    setMonthDates(dates);
  }
};

const getWeekDates = (currentDate: string = '', actionType: string, setWeekDates: Dispatch<SetStateAction<string[]>>): void => {
  let sunday = moment(currentDate).day("Sunday");
  let dates: any[] = [];

  if (actionType === "next" || actionType === "init") {
    for (let i = 0; i < 7; i++) {
      const date = moment((sunday)).clone().add(i, "days").toISOString(); //customDate ||
      dates = [...dates, date];
    }
    setWeekDates(dates);
  } else {
    for (let i = 0; i < 7; i++) {
      const date = moment((sunday)).clone().subtract(i, "days").toISOString(); //customDate ||
      dates = [date, ...dates];
    }
    setWeekDates(dates);
  }
};

const getDay = (customDate: string, day: string, actionType: string, setDay: Dispatch<SetStateAction<string>>): void => {
  if (actionType === "next") {
    // || actionType === 'init'
    const date = moment((customDate || day)).clone().add(1, "days").toISOString();
    setDay(date);
  } else {
    const date = moment((customDate || day)).clone().subtract(1, "days").toISOString();
    setDay(date);
  }
};

export { getMonthDates, getWeekDates, getDay };

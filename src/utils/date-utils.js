import moment from "moment";

const getMonthDates = (actionType, trackMonth, setMonthDates) => {
  let startDate = trackMonth;
  if (startDate.day() !== 0) {
    while (startDate.day() !== 0) {
      startDate = startDate.subtract(1, "days");
    }
  }

  let dates = [];
  //get an array consisting for 35 dates(forward/backward)
  if (actionType === "next" || actionType === "init") {
    for (let i = 0; i < 42; i++) {
      let date = startDate.clone().add(i, "days");
      dates = [...dates, date._d];
    }
    setMonthDates(dates);
  } else {
    for (var i = 0; i < 42; i++) {
      let date = startDate.clone().subtract(i, "days");
      dates = [date._d, ...dates];
    }
    setMonthDates(dates);
  }
};

const getWeekDates = (currentDate, customDate, actionType, setWeekDates) => {
  let sunday = moment(currentDate).day("Sunday");
  let dates = [];

  if (actionType === "next" || actionType === "init") {
    for (let i = 0; i < 7; i++) {
      const date = (customDate || sunday).clone().add(i, "days");
      dates = [...dates, date._d];
    }
    setWeekDates(dates);
  } else {
    for (let i = 0; i < 7; i++) {
      const date = (customDate || sunday).clone().subtract(i, "days");
      dates = [date._d, ...dates];
    }
    setWeekDates(dates);
  }
};

const getDay = (customDate, day, actionType, setDay) => {
  if (actionType === "next") {
    // || actionType === 'init'
    const date = (customDate || day).clone().add(1, "days");
    setDay(date);
  } else {
    const date = (customDate || day).clone().subtract(1, "days");
    setDay(date);
  }
};

export { getMonthDates, getWeekDates, getDay };

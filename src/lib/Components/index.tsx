import React from 'react';

//components
import Header from './Header';
import Main from './Main';
import FormModal from './Modals/FormModal';
import { SchedulerProps } from '../types';
import useStore from '../hooks/useStore';

/**
 *
 * @param {Object} props - Object contains all the passed props according to user usage.
 * @param {Number} props.startTime - Start time is used in day and week view its the start time of schedular time (e.g startTime = 10:00 AM).
 * @param {Number} props.endTime - End time is used in day and week view its the end time of schedular time (e.g endTime = 8:00 PM).
 * @param {Array} props.timeDifference - Time difference is the difference between times of schedular in day & week view (e.g timeDifference = ['1', 'hour / minutes']).
 * @param {String} props.fontSize - Font size is the adjustment of font user can do according to its own use case.
 * @param {String} props.colorTheme - Theme or Color theme user can pass custom color or can pass default bootstrap color themes. (e.g colorTheme = 'primary / info / '#1d1d1d').
 * @param {Array} props.layouts - Layout are the layouts (Day, Week, Month). User can decide how many layouts he want and have the freedom to select all or any one / two of them (e.g layouts = ['day', 'week', 'month']).
 * @param {Array} props.data - User should pass the data(appointments / events) that are used to shown on Scheduler.
 * @returns
 */
const Scheduler: React.FC<SchedulerProps> = () => {
  console.log(useStore(), 'store');
  return (
    <React.Fragment>
      <div className="scheduler w-100">
        <Header />
        <Main />
        <FormModal />
      </div>
    </React.Fragment>
  );
};

export default Scheduler;

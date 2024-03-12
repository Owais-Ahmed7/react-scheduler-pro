import React from 'react';

//components
import Header from './Header';
import Main from './Main';
import FormModal from './Modals/FormModal';
import { SchedulerProps } from '../types';

const Scheduler: React.FC<SchedulerProps> = () => {
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

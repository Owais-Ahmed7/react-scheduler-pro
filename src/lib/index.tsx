import React from 'react';
import '../App.scss';
import StoreProvider from './store/provider';
import SchedulerComponent from './Components';
import { SchedulerProps } from './types';

const Scheduler: React.FC<SchedulerProps> = (props) => {
  return (
    <StoreProvider initial={props}>
      <SchedulerComponent {...props} />
    </StoreProvider>
  );
};

export { Scheduler };

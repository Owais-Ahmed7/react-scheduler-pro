import StoreProvider from './store/provider';
import SchedulerComponent from './Components';
import '../App.scss';
import { SchedulerProps } from './types';

const Scheduler: React.FC<SchedulerProps> = (props: any) => {
  return (
    <StoreProvider initial={props}>
      <SchedulerComponent {...props} />
    </StoreProvider>
  );
};

export { Scheduler };

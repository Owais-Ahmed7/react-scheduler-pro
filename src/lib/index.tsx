import StoreProvider from './store/provider';
import SchedulerComponent from './Components';

const Scheduler = (props: any) => {
  return (
    <StoreProvider initial={props}>
      <SchedulerComponent {...props} />
    </StoreProvider>
  );
};

export { Scheduler };

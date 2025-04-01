import React, { useMemo } from 'react';

//components
import Day from '../Views/Day';
import Week from '../Views/Week';
import Month from '../Views/Month';
import WorkWeek from '../Views/WorkWeek';
import useStore from '../hooks/useStore';

interface Props {}
const Main: React.FC<Props> = () => {
  const { view, weekDays } = useStore();

  const Views = useMemo(() => {
    switch (view) {
      case 'month':
        return <Month />;
      case 'week':
        return <Week />;
      case 'day':
        return <Day />;
      case 'workweek':
        return <WorkWeek />;
      default:
        // Check if it's a custom view
        if (weekDays?.custom && weekDays.custom[view]) {
          return <Week />;
        }
        return '';
    }
  }, [view, weekDays]);

  return (
    <React.Fragment>
      <div className="w-100">{Views}</div>
    </React.Fragment>
  );
};

export default Main;

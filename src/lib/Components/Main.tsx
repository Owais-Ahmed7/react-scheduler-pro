import React, { useMemo } from 'react';

//components
import Day from '../Views/Day';
import Week from '../Views/Week';
import Month from '../Views/Month';
import useStore from '../hooks/useStore';

interface Props {}
const Main: React.FC<Props> = () => {
  const { view } = useStore();

  const Views = useMemo(() => {
    switch (view) {
      case 'month':
        return <Month />;
      case 'week':
        return <Week />;
      case 'day':
        return <Day />;
      default:
        return '';
    }
  }, [view]);

  return (
    <React.Fragment>
      <div className="w-100">{Views}</div>
    </React.Fragment>
  );
};

export default Main;

import { Fragment, useEffect, useState } from 'react';
import { calculateTop, getTimeZonedDate } from '../utils/schedular';
import { CurrentTimeBarProps } from '../types';
import { format } from 'date-fns';

const CurrentTimeBar = (props: CurrentTimeBarProps) => {
  const [top, setTop] = useState(calculateTop(props));
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTop(calculateTop(props));
      const now = getTimeZonedDate(new Date(), props.timezone);
      setTime(now);
    }, 60 * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Prevent showing bar on top of days/header
  if (top < 0) return null;

  return (
    <Fragment>
      {props.renderTime ? (
        <div className="current-time fs-10 position-absolute" style={{ top }}>
          {format(time, props.hourFormat === 12 ? 'hh:mm a' : 'HH:mm')}
        </div>
      ) : (
        <div className="current-time-indicator" style={{ top }}>
          <div />
          <div />
        </div>
      )}
    </Fragment>
  );
};

export default CurrentTimeBar;

import { Fragment, useEffect, useState } from 'react';
import { getTimeZonedDate } from '../utils/schedular';
import { CELL_HEIGHT } from '../helpers/constants/schedular';

interface CurrentTimeBarProps {
  today: Date;
  startHour: number;
  step: number;
  minuteHeight: number;
  timezone?: string;
  color?: string;
}

function calculateTop({
  today,
  startHour,
  step,
  minuteHeight,
  timezone,
}: CurrentTimeBarProps): number {
  const now = getTimeZonedDate(new Date(), timezone);
  const getMinutes = now.getMinutes();
  const computeMinutePercentage = (getMinutes / 60) * CELL_HEIGHT;
  const CELL_HEIGHT_INTERVAL = CELL_HEIGHT * (60 / step);

  const top =
    (now.getHours() - startHour) * CELL_HEIGHT_INTERVAL +
    computeMinutePercentage * (60 / step);

  return top;
}

const CurrentTimeBar = (props: CurrentTimeBarProps) => {
  const [top, setTop] = useState(calculateTop(props));

  useEffect(() => {
    const interval = setInterval(() => setTop(calculateTop(props)), 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Prevent showing bar on top of days/header
  if (top < 0) return null;

  return (
    <Fragment>
      <div className="current-time-indicator" style={{ top }}>
        <div />
        <div />
      </div>
    </Fragment>
  );
};

export default CurrentTimeBar;

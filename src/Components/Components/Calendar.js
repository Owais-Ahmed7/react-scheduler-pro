import React from 'react';

//components
import Month from './Month';
import Week from './Week';
import Day from './Day';
import CalendarModal from './CalendarModal';

const Calendar = (props) => {
  return (
    <React.Fragment>
      <div>
        {props.layout === 'month' && <Month {...props} />}
        {props.layout === 'week' && <Week {...props} />}
        {props.layout === 'day' && <Day {...props} />}
        <CalendarModal isOpen={props.isOpen} toggle={props.toggle} />
      </div>
    </React.Fragment>
  );
};

export default Calendar;

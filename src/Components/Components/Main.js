import React from 'react';

//components
// import Month from './Month';
// import Week from './Week';
import Day from './Day';

const Main = (props) => {
  return (
    <React.Fragment>
      <div className='w-100'>
        {props.layout === 'day' && <Day {...props} />}
        {/* {props.layout === 'week' && <Week {...props} />}
        {props.layout === 'month' && <Month {...props} />} */}
      </div>
    </React.Fragment>
  );
};

export default Main;

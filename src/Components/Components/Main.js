import React from 'react';

//components
// import Month from './Month';
// import Week from './Week';
import Day from './Day';

const Main = ({ layout, ...rest }) => {
  return (
    <React.Fragment>
      <div className='w-100'>
        {layout === 'day' && <Day {...rest} />}
        {/* {layout === 'week' && <Week {...rest} />}
        {layout === 'month' && <Month {...rest} />} */}
      </div>
    </React.Fragment>
  );
};

export default Main;

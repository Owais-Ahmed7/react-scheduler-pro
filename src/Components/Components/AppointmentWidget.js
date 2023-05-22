import React from 'react';
// import PopoverContent from './PopoverContent';

const AppointmentWidget = ({ item }) => {
  return (
    <React.Fragment>
      <div className='w-75'>
        <div
          // id={`appointmentPopover${idx}`}
          onClick={(e) => {
            // props.toggleAppointment(e, `appointmentPopover${appoint._id}`) it toggles appointment popover
            // props.setAppoint(appoint);
            // props.toggleAppoint(e);
          }}
          type='button'
          style={{ textDecoration: item.isCancelled ? 'line-through' : 'none' }}
          className='bg-primary text-capitalize bg-opacity-75 mb-1 text-white h-auto fs-10 pt-1 pb-1 p-2'
        >
          {item.name || 'Event Name'}
        </div>
        {/* <div className='popover__wrapper'>
          <div
            className='popover__content bg-white center-aligned'
            id={`appointmentPopover${appoint._id}`}
          >
            <PopoverContent {...props} />
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default AppointmentWidget;

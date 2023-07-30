import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

interface AppointmentModalProps {
  isAppointmentList: boolean;
  toggleAppointments: () => void;
  events: any[];
}

const AppointmentsModal: React.FC<AppointmentModalProps> = ({
  isAppointmentList,
  toggleAppointments,
  events,
}) => {
  return (
    <React.Fragment>
      <Modal
        isOpen={isAppointmentList}
        toggle={toggleAppointments}
        size={'md'}
        centered
      >
        <ModalHeader toggle={toggleAppointments}>All Appointments</ModalHeader>
        <ModalBody>
          {(events || []).map((event, idx) => (
            <div key={idx}>
              <div
                // id={`appointmentPopover${idx}`}
                // onClick={(e) =>
                //   props.toggleAppointment(e, `appointmentPopover${idx}`)
                // }
                className="bg-primary bg-opacity-75 mb-1 text-white w-100 h-auto fs-8 pt-1 pb-1 p-2"
              >
                {event.name}
              </div>
            </div>
          ))}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default AppointmentsModal;

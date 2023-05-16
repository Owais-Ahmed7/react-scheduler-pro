import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const arr = [1, 2, 3, 4];

const AppointmentsModal = (props) => {
  return (
    <React.Fragment>
      <Modal
        isOpen={props.isAppointmentList}
        toggle={props.toggleAppointments}
        size={"md"}
        centered
      >
        <ModalHeader toggle={props.toggleAppointments}>
          All Appointments
        </ModalHeader>
        <ModalBody>
          {(arr || []).map((item, idx) => (
            <div key={idx}>
              <div
                // id={`appointmentPopover${idx}`}
                // onClick={(e) =>
                //   props.toggleAppointment(e, `appointmentPopover${idx}`)
                // }
                type="button"
                className="bg-primary bg-opacity-75 mb-1 text-white w-100 h-auto fs-8 pt-1 pb-1 p-2"
              >
                Appointment
              </div>
            </div>
          ))}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default AppointmentsModal;

import React, { ReactNode } from 'react';
// import { Modal, ModalHeader, ModalBody } from "reactstrap";
import useStore from '../../hooks/useStore';
import { Modal, ModalHeader, ModalBody } from '../Modal';

interface FormModalProps {
  // isOpen: boolean;
  // toggle: (date?: Date) => void;
  // day: Date;
  // currentEventDate: Date;
  // dateTime: { date: Date; time: string };
  // eventFormContext?: (toggle: () => void, date: Date) => ReactNode;
}

const FormModal: React.FC<FormModalProps> = () => {
  const {
    eventFormContext,
    eventDialog: { start, end, resource, event, isOpen },
    dispatch,
    view,
    modalSize,
  }: any = useStore();

  const toggle = () =>
    dispatch('eventDialog', { date: null, event, isOpen: false });

  return (
    <React.Fragment>
      <div>
        <Modal isOpen={isOpen} toggle={() => toggle()} size={modalSize}>
          <ModalHeader toggle={() => toggle()}>Appointment</ModalHeader>
          <ModalBody>
            {typeof eventFormContext === 'function' &&
              eventFormContext({ event, toggle, start, end, resource, view })}
            {/* This is the schedular form modal */}
            {/* <div className="mt-2 mb-2">{children}</div> */}
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default FormModal;

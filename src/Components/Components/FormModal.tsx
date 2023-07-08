import React, { ReactNode, useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

interface FormModalProps {
  isOpen: boolean;
  toggle: () => void;
  // children: ReactNode,
  day: string;
  dateTime: { date: string, time: string };
  EventFormContext: ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  toggle,
  EventFormContext,
  // children,
  ...rest
}) => {
  // const [title, setTitle] = useState('');

  // const handleClick = () => {
  //   const dropdown = document.getElementById("search-dropdown");
  //   // if (searchedPatients.length === 0)
  //   dropdown.classList.remove("show");
  // };

  return (
    <React.Fragment>
      <div>
        <Modal isOpen={isOpen} toggle={toggle} size={'md'} centered>
          <ModalHeader toggle={toggle}>Appointment</ModalHeader>
          <ModalBody>
            {EventFormContext}
            {/* This is the schedular form modal */}
            {/* <div className="mt-2 mb-2">{children}</div> */}
          </ModalBody>
          {/* {(props.isFooter === true || props.isFooter === 'true') && ( */}

          {/* )} */}
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default FormModal;

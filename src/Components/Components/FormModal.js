import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

const FormModal = ({ isOpen, toggle, ...rest }) => {
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
            This is the schedular form modal
            <div className='mt-2 mb-2'>{rest.children}</div>
          </ModalBody>
          {/* {(props.isFooter === true || props.isFooter === 'true') && ( */}

          {/* )} */}
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default FormModal;

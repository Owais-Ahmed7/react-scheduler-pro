import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from 'reactstrap';

const SchedularModal = (props) => {
  const [title, setTitle] = useState('');
  return (
    <React.Fragment>
      <div>
        <Modal isOpen={props.isOpen} toggle={props.toggle}>
          <ModalHeader toggle={props.toggle}>Title</ModalHeader>
          <ModalBody>
            <form>
              <Input
                type='text'
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title...'
              />
              <div className='mt-2 mb-2'>{props.children}</div>
            </form>
          </ModalBody>
          {/* {(props.isFooter === true || props.isFooter === 'true') && ( */}
          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                props.toggle();
                props.setEvent(title);
              }}
            >
              Save
            </Button>
            <Button color='secondary' onClick={props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
          {/* )} */}
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default SchedularModal;

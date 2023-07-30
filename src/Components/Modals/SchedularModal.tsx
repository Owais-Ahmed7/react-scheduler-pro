import React, { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from 'reactstrap';


interface SchedularModalProps {
  isOpen: boolean,
  toggle: () => void,
  children: ReactNode,
  setEvent: Dispatch<SetStateAction<String>>
}

const SchedularModal: React.FC<SchedularModalProps> = ({ isOpen, toggle, children, setEvent }) => {
  const [title, setTitle] = useState('');
  return (
    <React.Fragment>
      <div>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>Title</ModalHeader>
          <ModalBody>
            <form>
              <Input
                type='text'
                value={title || ''}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title...'
              />
              <div className='mt-2 mb-2'>{children}</div>
            </form>
          </ModalBody>
          {/* {(isFooter === true || isFooter === 'true') && ( */}
          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                toggle();
                setEvent(title);
              }}
            >
              Save
            </Button>
            <Button color='secondary' onClick={toggle}>
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

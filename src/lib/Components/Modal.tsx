import React, { ReactNode } from 'react';
import Portal from './Portal';

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
  size: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggle, size, children }) => {
  if (!isOpen) return <></>;

  return (
    <Portal node={document.body}>
      <div>
        <div
          style={{ display: isOpen ? 'block' : 'none' }}
          className="scheduler-modal"
          // onClick={(e) => {
          //   e.stopPropagation();
          //   toggle();
          // }}
        >
          <div className={`modal-dialog modal-${size}`}>
            <div className="modal-content">{children}</div>
          </div>
        </div>
        <div className="scheduler-modal-backdrop" />
      </div>
    </Portal>
  );
};

const ModalHeader = ({
  children,
  toggle,
}: {
  children: ReactNode;
  toggle: () => void;
}) => {
  return (
    <div className="modal-header d-flex justify-content-between">
      {children}
      <div>
        <button onClick={toggle} className="btn btn-sm btn-secondary">
          X
        </button>
      </div>
    </div>
  );
};

const ModalBody = ({ children }: { children: ReactNode }) => {
  return <div className="modal-body">{children}</div>;
};

export { Modal, ModalHeader, ModalBody };

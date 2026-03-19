import React, { ReactNode } from 'react';
import Portal from './Portal';
import useFocusTrap from '../hooks/useFocusTrap';

interface ModalProps {
  isOpen: boolean;
  toggle?: () => void;
  size?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  toggle,
  size = 'md',
  children,
}) => {
  const focusTrapRef = useFocusTrap(isOpen);

  if (!isOpen) return <div></div>;

  return (
    <Portal node={document.body}>
      <div>
        <div
          style={{ display: isOpen ? 'block' : 'none' }}
          className="scheduler-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scheduler-modal-title"
          ref={focusTrapRef}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && toggle) {
              e.stopPropagation();
              toggle();
            }
          }}
        >
          <div className={`modal-dialog modal-${size}`}>
            <div className="modal-content">{children}</div>
          </div>
        </div>
        <div className="scheduler-modal-backdrop" onClick={toggle} />
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
      <span id="scheduler-modal-title">{children}</span>
      <div>
        <button
          onClick={toggle}
          className="btn btn-sm btn-secondary"
          aria-label="Close dialog"
        >
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

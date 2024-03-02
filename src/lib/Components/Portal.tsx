import React, { useEffect, useRef, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  node?: Element | null;
}

const Portal: React.FC<PortalProps> = ({ children, node }) => {
  const defaultNodeRef = useRef<Element | null>(null);

  useEffect(() => {
    const { current: defaultNode } = defaultNodeRef;

    if (document && !node && !defaultNode) {
      defaultNodeRef.current = document.createElement('div');
      document.body.appendChild(defaultNodeRef.current);
    }

    return () => {
      if (defaultNode) {
        document.body.removeChild(defaultNode);
      }
    };
  }, [node]);

  const targetNode = node || defaultNodeRef.current;

  if (!targetNode) {
    return null;
  }

  return ReactDOM.createPortal(children, targetNode);
};

export default Portal;

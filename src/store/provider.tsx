import { useState } from 'react';
import { StoreContext } from './context';
import initialState from './initialState';

interface Props {
  children: React.ReactNode;
}

const StoreProvider = ({ children }: Props) => {
  const [state, setState] = useState({ ...initialState });

  return (
    <StoreContext.Provider value={{ ...state }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

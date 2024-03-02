import { useContext } from 'react';
import { StoreContext } from '../store/context';

const useStore = () => {
  const context = useContext(StoreContext);
  return context;
};

export default useStore;

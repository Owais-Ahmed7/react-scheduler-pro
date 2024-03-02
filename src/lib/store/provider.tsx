import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoreContext } from './context';
import initialState from './initialState';
import { SchedulerProps } from '../types';

interface Props {
  children: React.ReactNode;
  initial: any;
}

const StoreProvider = ({ children, initial }: Props) => {
  const [state, setState] = useState<SchedulerProps>({
    ...initialState,
    ...initial,
  });

  const dispatch = useCallback((name: string, value: string) => {
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  }, []);

  const memoizedContextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  useEffect(() => {
    if (!state.views?.includes(state?.view))
      throw Error('Selected view does not exsit in views');
    setState((prevState: any) => ({
      ...prevState,
      ...initial,
      view: state.view,
      selectedDate: state.selectedDate,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <StoreContext.Provider value={memoizedContextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

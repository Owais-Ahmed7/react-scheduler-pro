import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoreContext } from './context';
import initialState from './initialState';
import { SchedulerProps, Store } from '../types';

interface Props {
  children: React.ReactNode;
  initial: SchedulerProps;
}

const StoreProvider = ({ children, initial }: Props) => {
  const [state, setState] = useState<Store>({
    ...initialState,
    ...initial,
  });

  const isSelectedDateControlled =
    initial.onNavigate instanceof Function && initial.selectedDate !== undefined;
  const isViewControlled =
    initial.onView instanceof Function && initial.view !== undefined;

  const dispatch = useCallback((name: string, value: unknown) => {
    // Don't update internally if the property is controlled
    const controlledProps: Record<string, boolean> = {
      selectedDate: initial.onNavigate instanceof Function && initial.selectedDate !== undefined,
      view: initial.onView instanceof Function && initial.view !== undefined,
    };

    if (controlledProps[name]) {
      // Property is controlled - don't update internal state
      // The callback should have already been called by the component
      return;
    }

    setState((prevState) => ({ ...prevState, [name]: value }));
  }, [initial]);

  const memoizedContextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  useEffect(() => {
    if (!state.views.includes(state.view))
      throw Error('Selected view does not exsit in views');

    setState((prevState) => {
      const nextState = { ...prevState, ...initial };

      // In controlled mode: always use prop value
      // In uncontrolled mode: preserve internal state for view/selectedDate
      if (!isSelectedDateControlled) {
        nextState.selectedDate = prevState.selectedDate;
      }
      if (!isViewControlled) {
        nextState.view = prevState.view;
      }

      return nextState;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <StoreContext.Provider value={memoizedContextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

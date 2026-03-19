// StoreContext.js
import { createContext } from 'react';
import initialState from './initialState';
import { Store } from '../types';

export const StoreContext = createContext<Store>(initialState);

// const StoreProvider = ({ children }: any) => {
//   const [state, dispatch] = useReducer(storeReducer, initialState);

//   return (
//     <StoreContext.Provider value={{ state, dispatch }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export { StoreProvider };

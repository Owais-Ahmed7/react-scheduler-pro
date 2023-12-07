// StoreContext.js
import React, { createContext } from 'react';
import initialState from './initialState';

export const StoreContext = createContext(initialState);

// const StoreProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(storeReducer, initialState);

//   return (
//     <StoreContext.Provider value={{ state, dispatch }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export { StoreProvider };

/* eslint-disable prettier/prettier */
import { createContext } from 'react';

const UserContext = createContext({
    user: null,
    setUser: (user) => {}
});
export default UserContext;

import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ email: 'test@test.com', password: '123456' });
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    // notification: null,
    role: null,
    permissions: null,
    setUser: () => {},
    setToken: () => {},
    setRole: () => {},
    setPermissions: () => [],
    // setNotification: () => {}
})

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(JSON.parse(localStorage.getItem('ACCESS_USER')) || {});
    // const [notification, _setNotification] = useState('');
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [role, _setRole] = useState(localStorage.getItem('ACCESS_ROLE'));
    const [permissions, _setPermissions] = useState(localStorage.getItem('ACCESS_PERMISSIONS'));

    // const setNotification = (message) => {
    //     _setNotification(message);
    //     setTimeout(() => {
    //         _setNotification('');
    //     }, 5000);
    // }

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setUser = (user) => {
        _setUser(user);
        if(user) {
            localStorage.setItem('ACCESS_USER', JSON.stringify(user));
        } else {
            localStorage.removeItem('ACCESS_USER');
        }
    }

    const setRole = (role) => {
        _setRole(role);
        if(role) {
            localStorage.setItem('ACCESS_ROLE', role);
        } else {
            localStorage.removeItem('ACCESS_ROLE');
        }
    }

    const setPermissions = (permissions) => {
        _setPermissions(permissions);
        if(permissions) {
            localStorage.setItem('ACCESS_PERMISSIONS', JSON.stringify(permissions));
        } else {
            localStorage.removeItem('ACCESS_PERMISSIONS');
        }
    }

    return (
        <StateContext.Provider value={{
            user,
            token,
            role,
            permissions,
            setUser,
            setToken,
            setRole,
            setPermissions
            // notification,
            // setNotification
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)

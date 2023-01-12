import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider'

export const GuestLayout = () => {
    const { token } = useStateContext();
    if (token) {
        return <Navigate to={"/"} />
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
            <Outlet />
        </div>
    )
}

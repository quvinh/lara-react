import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { index as DefaultLayout } from './layout'
import { GuestLayout } from './layout/GuestLayout'
import { index as HomePage } from './pages/Home'
import { index as UserPage } from './pages/User'
import { UserForm } from './pages/User/UserForm'
import { index as NotFound } from './pages/NotFound'
import { index as Login } from './pages/Login'
import { index as LogPage } from './pages/Log'

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: '', element: <Navigate to={'home'} /> },
            { path: 'home', element: <HomePage /> },
            { path: 'users', element: <UserPage /> },
            { path: 'users/new', element: <UserForm /> },
            { path: 'users/:id', element: <UserForm /> },
            { path: 'logs', element: <LogPage /> },
        ]
    },
    {
        path: '',
        element: <GuestLayout />,
        children: [ { path: 'login', element: <Login /> }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router

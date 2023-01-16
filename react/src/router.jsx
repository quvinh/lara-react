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
import { index as CompanyPage } from './pages/Company'
import { index as ImportExcel } from './pages/Company/ImportExcel'

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            { path: '', element: <Navigate to={'dashboard'} /> },
            { path: 'dashboard', element: <HomePage /> },
            { path: 'users', element: <UserPage /> },
            { path: 'users/new', element: <UserForm /> },
            { path: 'users/:id', element: <UserForm /> },
            { path: 'logs', element: <LogPage /> },
            { path: 'companies', element: <CompanyPage /> },
            { path: 'import-excel', element: <ImportExcel /> },
        ]
    },
    {
        path: '',
        element: <GuestLayout />,
        children: [{ path: 'login', element: <Login /> }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router

import { ContextProvider } from './context/ContextProvider'
import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {

    return (
        <>
            <ContextProvider>
                <RouterProvider router={router} />
            </ContextProvider>
        </>
    )
}

export default App

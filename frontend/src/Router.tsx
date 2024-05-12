import React, { Suspense } from 'react'
import { Route, Routes, Navigate, HashRouter } from 'react-router-dom'

const Home = React.lazy(() => import('./views/Home'))


const PageRouter = () => {
    return (
        <Suspense fallback={<div>fallback</div>}>
            <HashRouter>
                <Routes>
                    <Route path='/' element={<Navigate to="/home" />} />
                    <Route path='/home' element={<Home/>}/>
                </Routes>
            </HashRouter>
        </Suspense>
    )
}

export default PageRouter
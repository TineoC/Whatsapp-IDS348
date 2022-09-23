import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Application from '../application'
import App from '../App'
import ErrorPage from './ErrorPage'

function routes() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<App />}/>
            <Route path='/chat/:id' element={<Application />}/>
            <Route path='*' element={<ErrorPage />}/>
        </Routes>
    </Router>
  )
}

export default routes
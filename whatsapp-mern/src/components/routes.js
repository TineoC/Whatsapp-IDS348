import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Application from '../application'
import App from '../App'
import ErrorPage from './ErrorPage'

function routes() {
  return (
    <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/chat' element={<Application />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
  )
}

export default routes
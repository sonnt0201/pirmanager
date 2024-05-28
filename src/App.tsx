
import './App.css'
import { NavBar } from './NavBar'
import { Logger } from './pages/logger'
import { ControlsPage } from './pages/controls'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TestPage } from './pages/TestPage.js'
import { useEffect, useState } from 'react';
import { LogProvider } from './app_states/LogProvider.js';
import { ReviewPage } from './pages/index.js';




function App() {

  return (

    <LogProvider>


      <div className='h-screen w-screen   overflow-y-auto '>
        <div className='nezuko-bg'></div>


        <div className='flex  content-center mx-3'>
          <div className='w-10/12 px-3 '>
            <Router>
              <div className='w-screen mb-3'>
                <NavBar />

              </div>
              <Routes>
                <Route path="/" element={<ControlsPage />} />
                <Route path='/review' element = {<ReviewPage/>} />
                <Route path='/test' element={<TestPage />} />
                {/* <Route path='/log' element={<Logger />} /> */}
              </Routes>
            </Router>
          </div>
          <div className='flex-grow'>
            <Logger />
          </div>

        </div>



      </div>
    </LogProvider>



  )
}

export default App

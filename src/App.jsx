import{Route,Routes} from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import NavBar from './components/NavBar';
import JobApplications from './pages/JobOpenings';

function App() {

  return (
    <div className='pb-20'>
      <Header></Header>
      <NavBar></NavBar>
      <Routes>
        <Route path='/vagas' element={<JobApplications/>}></Route>
      </Routes>
    </div>
  )
}

export default App

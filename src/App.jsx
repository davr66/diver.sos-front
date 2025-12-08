import{Route,Routes} from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Form from './components/Form';
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
        <Route path='/perfil' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App

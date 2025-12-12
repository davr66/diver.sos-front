import{Route,Routes} from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import Form from './components/Form';
import Header from './components/Header';
import NavBar from './components/NavBar';
import JobApplications from './pages/JobOpenings';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
import Loading from './components/Loading';

function App() {

  return (  
    <div className='pb-25 bg-[var(--general-bg)]'>
      <Header></Header>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element=<Home />></Route>
        <Route path='/vagas' element={<JobApplications/>}></Route>
        <Route path='/grupos' element={<SupportGroups/>}></Route>
        <Route path='/favoritos' element={<Loading/>}></Route>
        <Route path='/perfil' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App

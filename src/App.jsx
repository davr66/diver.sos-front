import{Route,Routes} from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Form from './components/Form';
import Header from './components/Header';
import NavBar from './components/NavBar';
import JobOpenings from './pages/JobOpenings';
import JobOpeningsDetails from './pages/JobOpeningDetails';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
import Loading from './components/Loading';

function App() {

  return (  
    <div className='pb-25 bg-[var(--general-bg)] w-full min-h-screen'>
      <Header></Header>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/vagas' element={<JobOpenings/>}></Route>
        <Route path='/vagas/:id' element={<JobOpeningsDetails/>}></Route>
        <Route path='/grupos' element={<SupportGroups/>}></Route>
        <Route path='/favoritos' element={<Loading/>}></Route>
        <Route path='/login' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App

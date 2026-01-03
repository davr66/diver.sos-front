import { BrowserRouter,Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import JobOpenings from './pages/JobOpenings';
import JobOpeningsDetails from './pages/JobOpeningDetails';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
import Loading from './components/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './layouts/Layout';
import Profile from './pages/Profile';

function App() {
  return (
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Home />}/>
          <Route path='/vagas' element={<JobOpenings />}/>
          <Route path='/vagas/:id' element={<JobOpeningsDetails />}/>
          <Route path='/grupos' element={<SupportGroups />}/>
          <Route path='/favoritos' element={<Loading />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/cadastro' element={<Register />}/>
          <Route path='/esqueci-a-senha' element={<ForgotPassword />}/>
          <Route path='/perfil' element={<Profile/>}></Route>
        </Route>
      </Routes>
  )
}

export default App

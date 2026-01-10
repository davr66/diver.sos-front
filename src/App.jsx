import { BrowserRouter,Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import JobOpenings from './pages/JobOpenings';
import JobOpeningsDetails from './pages/JobOpeningDetails';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
import Loading from './components/Loading';
import GroupDetails from './pages/GroupDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './layouts/Layout';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Favorites from './pages/Favorites'
import ProtectedRoute from './components/ProtectedRoute';
import AdminHome from './pages/AdminHome';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
      <Routes>
        <Route element={<Layout/>}>
          <Route path='/' element={<Home />}/>
          <Route path='/vagas' element={<JobOpenings />}/>
          <Route path='/vagas/:id' element={<JobOpeningsDetails />}/>
          <Route path='/grupos' element={<SupportGroups />}/>
          <Route path='/grupos/:id' element={<GroupDetails/>}/>
          <Route path='/favoritos' element={<Favorites/>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/cadastro' element={<Register />}/>
          <Route path='/esqueci-a-senha' element={<ForgotPassword />}/>
          <Route path='/perfil' element={<Profile/>}></Route>
          <Route path='/perfil/editar' element={<EditProfile/>}/>
        </Route>
        <Route
          element={
            <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/vagas' element={<JobOpenings />} />
          <Route path='/admin/grupos' element={<SupportGroups />} />
          <Route path='/admin/noticias' element={<AdminHome />} />
        </Route>
      </Routes>
  )
}

export default App

import { BrowserRouter,Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import JobOpenings from './pages/JobOpenings';
import JobOpeningsDetails from './pages/JobOpeningDetails';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
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
import ManageJobs from './pages/ManageJobs';
import ManageUsers from './pages/ManageUsers';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import ManageGroups from './pages/ManageGroups';
import ManageNews from './pages/ManageNews';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import CreateGroup from './pages/CreateGroup';
import EditGroup from './pages/EditGroup';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';

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
          <Route path='/perfil/editar' element={<EditProfile fallback='/perfil' destination='/perfil'/>}/>
        </Route>
        <Route
          element={
            <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR','RH']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/admin' element={<AdminHome />} />
          <Route path='admin/perfil' element={<EditProfile fallback='/admin' destination='/admin'/>}/>
          <Route path='/admin/vagas' element={<ManageJobs/>} />
          <Route path='/admin/vaga/criar' element={<CreateJob/>} />
          <Route path='/admin/vaga/editar/:id' element={<EditJob/>} />
          <Route
            path='/admin/grupos'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <ManageGroups/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/grupo/criar'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <CreateGroup/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/grupo/editar/:id'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <EditGroup/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/noticias'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <ManageNews/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/noticia/criar'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <CreateNews/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/noticia/editar/:id'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <EditNews/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/gerenciar-usuarios'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <ManageUsers/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/usuario/criar'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <CreateUser/>
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/usuario/editar/:id'
            element={
              <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
                <EditUser/>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
  ) 
}

export default App

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
            <ProtectedRoute requiredRoles={['ADMINISTRADOR','MODERADOR']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/admin' element={<AdminHome />} />
          <Route path='admin/perfil' element={<EditProfile fallback='/admin' destination='/admin'/>}/>
          <Route path='/admin/vagas' element={<ManageJobs/>} />
          <Route path='/admin/vaga/criar' element={<CreateJob/>} />
          <Route path='/admin/vaga/editar/:id' element={<EditJob/>} />
          <Route path='/admin/grupos' element={<ManageGroups/>} />
          <Route path='/admin/grupo/criar' element={<CreateGroup/>} />
          <Route path='/admin/grupo/editar/:id' element={<EditGroup/>} />
          <Route path='/admin/noticias' element={<ManageNews/>} />
          <Route path='/admin/noticia/criar' element={<CreateNews/>} />
          <Route path='/admin/noticia/editar/:id' element={<EditNews/>} />
          <Route path='/admin/gerenciar-usuarios' element={<ManageUsers/>}/>
          <Route path='/admin/usuario/criar' element={<CreateUser/>} />
          <Route path='/admin/usuario/editar/:id' element={<EditUser/>} />
        </Route>
      </Routes>
  ) 
}

export default App

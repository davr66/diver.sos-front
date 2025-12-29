import{Route,Routes, useLocation} from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import JobOpenings from './pages/JobOpenings';
import JobOpeningsDetails from './pages/JobOpeningDetails';
import Home from './pages/Home';
import SupportGroups from './pages/SupportGroups';
import Loading from './components/Loading';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const {pathname} = useLocation();
  const paths = ['/login','/cadastro','/esqueci-a-senha']
  const bg = paths.some(p => pathname === p || pathname.startsWith(p + '/')) ? 'bg-[var(--profile-bg)]':'bg-[var(--general-bg)]';
  return (  
    <div className={`pb-25 ${bg} w-full min-h-screen`}>
      <Header></Header>
      <NavBar></NavBar>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/vagas' element={<JobOpenings/>}></Route>
        <Route path='/vagas/:id' element={<JobOpeningsDetails/>}></Route>
        <Route path='/grupos' element={<SupportGroups/>}></Route>
        <Route path='/favoritos' element={<Loading/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/cadastro' element={<Register/>}></Route>
      </Routes>
    </div>
  )
}

export default App

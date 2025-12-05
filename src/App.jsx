import{Route,Routes} from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header';
import NavBar from './components/NavBar';

function App() {

  return (
    <>
      {/* <Header></Header> */}
      <NavBar></NavBar>
      {/* <Routes>
        <Route path='/'></Route>
      </Routes> */}
    </>
  )
}

export default App

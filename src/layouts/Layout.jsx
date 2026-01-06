import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';


export default function Layout(){
  const { pathname } = useLocation();
  const paths = ['/login', '/cadastro', '/esqueci-a-senha'];
  const hiddenAuth = paths.some(p => pathname === p || pathname.startsWith(p + '/'));

  const rootBg = hiddenAuth ? 'bg-[var(--profile-bg)]' : 'bg-[var(--general-bg)]';

  return(
    <div className={`min-h-screen lg:grid lg:grid-cols-5 lg:grid-rows-8 lg:gap-0 lg:h-screen ${rootBg}`}>
      <Header/>
        <main className='lg:row-start-1 lg:row-end-9 lg:col-start-2 lg:col-end-6 lg:overflow-y-auto lg:pt-10 pb-30'>
          <Outlet/>
        </main>
      <NavBar/>
    </div>
  );
}
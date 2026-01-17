import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import NavItem from '../components/NavItem';
import { useAuth } from '../context/AuthContext';
import ContactFab from '../components/ContactFab';
import {HomeIcon,JobsIcon,GroupsIcon,FavoriteIcon,ProfileIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,FavoriteIconFilled,ProfileIconFilled,LoginIcon,LoginIconFilled} from '../assets/nav/'


export default function Layout(){
  const year = new Date().getFullYear();
  const auth = useAuth();
  const isLoggedIn = auth?.isAuthenticated ?? false;
  const { pathname } = useLocation();
  const paths = ['/login', '/cadastro', '/esqueci-a-senha', '/auth/confirmar', '/nova-senha'];
  const hiddenAuth = paths.some(p => pathname === p || pathname.startsWith(p + '/'));

  const rootBg = hiddenAuth ? 'bg-[var(--profile-bg)]' : 'bg-[var(--general-bg)]';

  return(
    <div className={`min-h-screen lg:grid lg:grid-cols-5 lg:grid-rows-8 lg:gap-0 lg:h-screen ${rootBg} p-0`}>
      <Header/>
        <main className='p-0 overflow-hidden flex flex-col lg:row-start-1 lg:row-end-9 lg:col-start-2 lg:col-end-6 lg:overflow-y-auto pb-30'>
          <Outlet/>
          <ContactFab />
          <footer className='mt-auto py-4 text-center text-sm text-gray-700'>diver.sos &copy;{year}<br/>Desenvolvido por Atemporal</footer>
        </main>
      <NavBar>
        <NavItem href={'/'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled} bgColor={'#C5ACFF'}></NavItem>
        <NavItem href={'/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled} bgColor={'#FFE79D'}></NavItem>
        <NavItem href={'/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled} bgColor={'#FFA3BE'}></NavItem>
        <NavItem href={'/favoritos'} label={'Favoritos'} Icon={FavoriteIcon} IconActive={FavoriteIconFilled} bgColor={'#ff3939'}></NavItem>
        {isLoggedIn ? <NavItem href={'/perfil'} label={'Perfil'} Icon={ProfileIcon} IconActive={ProfileIconFilled} bgColor={'#CCFFB4'}></NavItem> : <NavItem href={'/login'} label={'Login'} Icon={LoginIcon} IconActive={LoginIconFilled} bgColor={'#CCFFB4'} match={["/login","/cadastro","/esqueci-a-senha"]}></NavItem>}
      </NavBar>
    </div>
  );
}
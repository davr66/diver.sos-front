import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import NavItem from '../components/NavItem';
import { getMyData } from '../services/api';
import {HomeIcon,JobsIcon,GroupsIcon,NewsIcon,ManageUserIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,NewsIconFilled,ManageUserIconFilled,
  LoginIcon,LoginIconFilled} from '../assets/nav/'
import { TbLogout2 } from "react-icons/tb";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Feedback from '../components/Feedback';


export default function Layout(){
  const {logout} = useAuth();
  const {user} = useAuth();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutTimerRef = useRef(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const { pathname } = useLocation();
  const paths = ['/login', '/cadastro', '/esqueci-a-senha'];
  const hiddenAuth = paths.some(p => pathname === p || pathname.startsWith(p + '/'));
  const hideProfileInfo = pathname === '/admin/perfil' || pathname.startsWith('/admin/perfil/');
  const API_URL = import.meta.env.VITE_API_URL;
  const colors = {
    "ADMINISTRADOR":"bg-[#C5ACFF]",
    "MODERADOR":"bg-[#FFA3BE]",
    "RH": "bg-[var(--jobs-bg)]"
  }
  const bg = user?.role ? colors[user.role] : 'bg-none'

  const rootBg = hiddenAuth ? 'bg-[var(--profile-bg)]' : 'bg-[var(--general-bg)]';

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!user?.token || hideProfileInfo) return;
      try {
        const response = await getMyData();
        const me = response?.data;
        const fotoPerfil = me?.fotoPerfil;
        setProfilePhotoUrl(fotoPerfil ? `${API_URL}${fotoPerfil}` : null);
      } catch (err) {
        console.error('Erro ao carregar foto do perfil', err);
        setProfilePhotoUrl(null);
      }
    };

    fetchMyProfile();
  }, [user?.token, hideProfileInfo, pathname, API_URL]);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, []);

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setFeedback({
      type: 'success',
      heading: 'Saindo...',
      message: 'Redirecionando...',
      duration: 2000
    });
    setShowFeedback(true);
    setFeedbackOnClose(() => () => setShowFeedback(false));

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => logout('/login'), 2000);
  };


  return(
    <div className={`min-h-screen lg:grid lg:grid-cols-5 lg:grid-rows-8 lg:gap-0 lg:h-screen ${rootBg} overflow-hidden`}>
      <Header/>
        <main className='lg:row-start-1 lg:row-end-9 lg:col-start-2 lg:col-end-6 lg:overflow-y-auto lg:pt-10 pb-30 lg:px-5'>
        {!hideProfileInfo && (
          <div className='flex justify-between px-10 pt-5'>
            <section className="flex gap-2 h-fit mb-10" id="profile-info">
              <div
                className={`w-25 h-25 lg:w-30 lg:h-30 rounded-full border-3 bg-cover bg-no-repeat bg-center`}
                style={{
                  backgroundImage: profilePhotoUrl
                    ? `url('${profilePhotoUrl}')`
                    : "url('../src/assets/profile-placeholder.png')"
                }}
              />
              <div className='flex flex-col justify-between'>
                <div>
                  <h1 className="font-[Nunito] font-extrabold text-2xl">{user?.name}</h1>
                  <span className={`font-medium rounded-sm py-1 px-2 text-xs ${bg}`}>{user?.role}</span>
                </div>
                <Link className="text-sm underline font-bold" to="/admin/perfil">Editar perfil</Link>
              </div>
            </section>
            <button className="flex items-center justify-center 
            w-12 h-12
            border-black border-2 rounded-md bg-red-600 text-white hover:cursor-pointer hover:bg-red-700 disabled:cursor-not-allowed disabled:brightness-85" onClick={handleLogout} disabled={isLoggingOut}><TbLogout2 size={24}/></button>
          </div>
        )}
          <Outlet/>

          {showFeedback && (
            <Feedback
              type={feedback.type}
              heading={feedback.heading}
              message={feedback.message}
              duration={feedback.duration || 3000}
              onClose={feedbackOnClose}
            />
          )}
        </main>
      <NavBar>
        <NavItem href={'/admin'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled} bgColor={'#C5ACFF'} match={['/admin']}></NavItem>
        <NavItem href={'/admin/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled} bgColor={'#FFE79D'}></NavItem>
        {user?.role !== 'RH' && (
          <>
            <NavItem href={'/admin/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled} bgColor={'#FFA3BE'}></NavItem>
            <NavItem href={'/admin/noticias'} label={'Notícias'} Icon={NewsIcon} IconActive={NewsIconFilled} bgColor={'#6782EE'}></NavItem>
            <NavItem href={'/admin/gerenciar-usuarios'} label={'Gerenciar Usuários'} Icon={ManageUserIcon} IconActive={ManageUserIconFilled} bgColor={'#CCFFB4'}></NavItem>
          </>
        )}
      </NavBar>
    </div>
  );
}
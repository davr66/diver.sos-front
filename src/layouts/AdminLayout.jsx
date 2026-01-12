import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import NavItem from '../components/NavItem';
import { getMyData } from '../services/api';
import {HomeIcon,JobsIcon,GroupsIcon,NewsIcon,ManageUserIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,NewsIconFilled,ManageUserIconFilled,
  LoginIcon,LoginIconFilled} from '../assets/nav/'
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';


export default function Layout(){
  const [user,setUser] = useState([]);
  const [loading,setLoading] = useState(true);
  const { pathname } = useLocation();
  const paths = ['/login', '/cadastro', '/esqueci-a-senha'];
  const hiddenAuth = paths.some(p => pathname === p || pathname.startsWith(p + '/'));
  const hideProfileInfo = pathname === '/admin/perfil' || pathname.startsWith('/admin/perfil/');
  const colors = {
    "ADMINISTRADOR":"bg-[#C5ACFF]",
    "MODERADOR":"bg-[#FFA3BE]",
  }
  const bg = user.tipoDeUsuario ? colors[user.tipoDeUsuario] : 'bg-none'

  const rootBg = hiddenAuth ? 'bg-[var(--profile-bg)]' : 'bg-[var(--general-bg)]';

  useEffect(()=>{
    const fetchUserData = async ()=>{
      try{
        const response = await getMyData();
        setUser(response.data);
      }catch(err){
        console.log(err);
      }finally{
        setLoading(false);
      }
    }
    fetchUserData();
  },[]);

  if(loading) return <Loading/>

  return(
    <div className={`min-h-screen lg:grid lg:grid-cols-5 lg:grid-rows-8 lg:gap-0 lg:h-screen ${rootBg}`}>
      <Header/>
        <main className='lg:row-start-1 lg:row-end-9 lg:col-start-2 lg:col-end-6 lg:overflow-y-auto lg:pt-10 pb-30 px-5'>
        {!hideProfileInfo && (
          <section className="flex gap-2 h-fit mb-10" id="profile-info">
            <div className={`w-30 h-30 rounded-full border-3 bg-[url('../src/assets/profile-placeholder.png')] bg-contain bg-no-repeat bg-center`}>
            </div>
            <div className='flex flex-col justify-between'>
              <div>
                <h1 className="font-[Nunito] font-extrabold text-2xl">{user.nome}</h1>
                <span className={`font-medium rounded-sm py-1 px-2 text-xs ${bg}`}>{user.tipoDeUsuario}</span>
              </div>
              <Link className="text-sm underline font-bold" to="/admin/perfil">Ver perfil</Link>
            </div>
          </section>
        )}
          <Outlet/>
        </main>
      <NavBar>
        <NavItem href={'/admin'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled} bgColor={'#C5ACFF'} match={['/admin']}></NavItem>
        <NavItem href={'/admin/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled} bgColor={'#FFE79D'}></NavItem>
        <NavItem href={'/admin/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled} bgColor={'#FFA3BE'}></NavItem>
        <NavItem href={'/admin/noticias'} label={'Notícias'} Icon={NewsIcon} IconActive={NewsIconFilled} bgColor={'#6782EE'}></NavItem>
        <NavItem href={'/admin/gerenciar-usuarios'} label={'Gerenciar Usuários'} Icon={ManageUserIcon} IconActive={ManageUserIconFilled} bgColor={'#CCFFB4'}></NavItem>
      </NavBar>
    </div>
  );
}
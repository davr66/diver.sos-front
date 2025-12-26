import {HomeIcon,JobsIcon,GroupsIcon,FavoriteIcon,ProfileIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,FavoriteIconFilled,ProfileIconFilled,LoginIcon,LoginIconFilled} from '../assets/nav/'
import NavItem from "./NavItem";


export default function NavBar(){
  let isLoggedIn = false;

  return (
    <nav className="bg-white z-1 fixed bottom-5 left-0 right-0 
    flex justify-evenly items-center
    rounded-full border-2 border-b-5 border-r-5 pt-2 pb-3 w-[96%] mx-auto
    nth-1:mb-100">
      <NavItem href={'/'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled}></NavItem>
      <NavItem href={'/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled}></NavItem>
      <NavItem href={'/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled}></NavItem>
      <NavItem href={'/favoritos'} label={'Favoritos'} Icon={FavoriteIcon} IconActive={FavoriteIconFilled}></NavItem>
      {isLoggedIn ? <NavItem href={'/perfil'} label={'Perfil'} Icon={ProfileIcon} IconActive={ProfileIconFilled}></NavItem> : <NavItem href={'/login'} label={'Login'} Icon={LoginIcon} IconActive={LoginIconFilled}></NavItem>}
      
    </nav>
  )
}
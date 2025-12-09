import {HomeIcon,JobsIcon,GroupsIcon,FavoriteIcon,ProfileIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,FavoriteIconFilled,ProfileIconFilled} from '../assets/nav/'
import NavItem from "./NavItem";


export default function NavBar(){
  let isLoggedIn = false;

  return (
    <nav className="bg-white z-1 fixed bottom-5 left-0 right-0 
    flex justify-evenly 
    rounded-full border-2 border-b-5 border-r-5 py-1 w-[96%] mx-auto
    nth-1:mb-100">
      <NavItem href={'/'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled}></NavItem>
      <NavItem href={'/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled}></NavItem>
      <NavItem href={'/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled}></NavItem>
      <NavItem href={'/favoritos'} label={'Favoritos'} Icon={FavoriteIcon} IconActive={FavoriteIconFilled}></NavItem>
      <NavItem href={'/perfil'} label={'Perfil'} Icon={ProfileIcon} IconActive={ProfileIconFilled}></NavItem>
    </nav>
  )
}
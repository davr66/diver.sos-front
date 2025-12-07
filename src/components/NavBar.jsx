import {HomeIcon,JobsIcon,GroupsIcon,FavoriteIcon,ProfileIcon} from '../assets/nav/'
import NavItem from "./NavItem";


export default function NavBar(){
  let isLoggedIn = false;

  return (
    <nav className="fixed bottom-5 left-0 right-0 
    flex justify-evenly 
    rounded-full border-2 border-b-5 border-r-5 py-1 w-[96%] mx-auto
    nth-1:mb-100">
      <NavItem href={'/'} label={"Início"} Icon={HomeIcon} fill={"#C5ACFF"} width={36} height={29}></NavItem>
      <NavItem href={'/vagas'} label={'Vagas'} Icon={JobsIcon} fill={"#FFE79D"} width={30} height={30}></NavItem>
      <NavItem href={'/grupos'} label={'Grupos'} Icon={GroupsIcon} fill={"#FFA3BE"} width={30} height={30}></NavItem>
      <NavItem href={'/favoritos'} label={'Favoritos'} Icon={FavoriteIcon} fill={"#de8080ff"} width={30} height={30}></NavItem>
      <NavItem href={'/perfil'} label={'Perfil'} Icon={ProfileIcon} fill={"#CCFFB4"} width={30} height={30}></NavItem>
    </nav>
  )
}
import {HomeIcon,JobsIcon,GroupsIcon,FavoriteIcon,ProfileIcon,
  HomeIconFilled,JobsIconFilled,GroupsIconFilled,FavoriteIconFilled,ProfileIconFilled,LoginIcon,LoginIconFilled} from '../assets/nav/'
import NavItem from "./NavItem";


export default function NavBar(){
  let isLoggedIn = false;

  return (
    <nav className="bg-white z-1 fixed bottom-5 left-0 right-0 
    flex justify-evenly items-center
    rounded-full border-2 border-b-5 border-r-5 px-2 pt-1 pb-2 w-[96%] mx-auto
    ">
      <NavItem href={'/'} label={"Início"} Icon={HomeIcon} IconActive={HomeIconFilled} bgColor={'#C5ACFF'}></NavItem>
      <NavItem href={'/vagas'} label={'Vagas'} Icon={JobsIcon} IconActive={JobsIconFilled} bgColor={'#FFE79D'}></NavItem>
      <NavItem href={'/grupos'} label={'Grupos'} Icon={GroupsIcon} IconActive={GroupsIconFilled} bgColor={'#FFA3BE'}></NavItem>
      <NavItem href={'/favoritos'} label={'Favoritos'} Icon={FavoriteIcon} IconActive={FavoriteIconFilled} bgColor={'#ff3939'}></NavItem>
      {isLoggedIn ? <NavItem href={'/perfil'} label={'Perfil'} Icon={ProfileIcon} IconActive={ProfileIconFilled} bgColor={'#C5ACFF'}></NavItem> : <NavItem href={'/login'} label={'Login'} Icon={LoginIcon} IconActive={LoginIconFilled} bgColor={'#CCFFB4'} match={["/login","/cadastro","/esqueci-a-senha"]}></NavItem>}
    </nav>
  )
}
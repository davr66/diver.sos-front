import { MdBusinessCenter ,MdOutlineBusinessCenter,MdOutlineHome, MdHome } from "react-icons/md";
import NavItem from "./NavItem";


export default function NavBar(){
  let isLoggedIn = false;

  return (
    <nav className="flex justify-evenly">
      <NavItem href={'/'} label={"Início"} IconOutlined={MdOutlineHome} IconFilled={MdHome}></NavItem>
      <NavItem href={'/vagas'} label={'Vagas'} IconOutlined={MdOutlineBusinessCenter} IconFilled={MdBusinessCenter}></NavItem>
      <NavItem href={'/favoritos'} label={'Vagas'} IconOutlined={MdOutlineBusinessCenter} IconFilled={MdBusinessCenter}></NavItem>
      <NavItem href={'/grupos'} label={'Vagas'} IconOutlined={MdOutlineBusinessCenter} IconFilled={MdBusinessCenter}></NavItem>
      <NavItem href={'/perfil'} label={'Vagas'} IconOutlined={MdOutlineBusinessCenter} IconFilled={MdBusinessCenter}></NavItem>
    </nav>
  )
}
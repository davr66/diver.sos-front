import {Link, useLocation} from 'react-router-dom';

export default function NavItem({href,label,IconOutlined,IconFilled}){
  const {pathname} = useLocation();
  const active = pathname === href;

  const Icon = active ? IconFilled : IconOutlined;

  return (
    <Link
    to={href}
    className='flex flex-col items-center'
    ><Icon size={40}></Icon>
    <span>{label}</span>
    </Link>
  )
}
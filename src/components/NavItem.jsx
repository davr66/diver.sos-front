import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ href, label, Icon,IconActive}) {
  const { pathname } = useLocation();
  const active = pathname === href;

  const isHome = Icon.displayName === 'HomeIcon';

  const SelectedIcon = active ? IconActive : Icon;

  return (
    <Link to={href} className="flex flex-col justify-between items-center text-sm max-h-15">
      <SelectedIcon className={`${isHome ? "w-9.5 h-9.5 -translate-y-[2px]":"w-8 h-8"}`} />
      <span className='text-[.7rem] font-bold'>{label}</span>
    </Link>
  );
}

import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ href, label, Icon,IconActive}) {
  const { pathname } = useLocation();
  const active = pathname === href;

  const isGroups = Icon.displayName === 'GroupsIcon';

  const SelectedIcon = active ? IconActive : Icon;
  // const after = active

  return (
    <Link to={href} className="flex flex-col justify-between  items-center text-sm max-h-20">
      <span className="w-10 h-10 flex items-center justify-center">
        <SelectedIcon className="max-w-full max-h-full w-auto h-auto" preserveAspectRatio="xMidYMid meet" />
      </span>
      <span className='text-[.7rem] font-bold leading-none'>{label}</span>
    </Link>
  );
}

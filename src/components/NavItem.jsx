import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ href, label, Icon,IconActive,bgColor}) {
  const { pathname } = useLocation();
  const active = pathname === href;

  const SelectedIcon = active ? IconActive : Icon;

  const labelStyle = active && bgColor ? { backgroundColor: bgColor } : undefined;

  return (
    <Link to={href} className="flex flex-col justify-between items-center text-sm max-h-20" aria-current={active ? 'page' : undefined}>
      <span className={`w-10 h-10 flex items-center justify-center transition-transform duration-200 ${active ? 'scale-105' : 'scale-100'}`}>
        <SelectedIcon className={`max-w-full max-h-full w-auto h-auto transition-transform duration-200 ${active ? 'scale-105' : 'scale-100'}`} preserveAspectRatio="xMidYMid meet" />
      </span>
      <span className={`inline-block text-[.7rem] font-bold leading-none px-2 py-[0.1rem] rounded-full transition-colors duration-200 transform ${active ? 'scale-105' : 'scale-100'}`} style={labelStyle}>{label}</span>
    </Link>
  );
}

import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ href, label, Icon,fill,width,height}) {
  const { pathname } = useLocation();
  const active = pathname === href;

  const isHome = Icon.displayName === 'HomeIcon';
  console.log(isHome)

  return (
    <Link
      to={href}
      className="flex flex-col items-center text-sm"
    >
      <Icon className={isHome ? "translate-y-[2px]":"translate-y-0"} width={width} height={height} fill={active ? fill:"none"} />
      <span className={isHome ? "mt-[1.5px]":""}>{label}</span>
    </Link>
  );
}

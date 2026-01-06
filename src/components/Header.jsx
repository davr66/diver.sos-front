import {useLocation} from 'react-router-dom';
import logo from '../assets/logo.svg';
import logo2 from '../assets/logo2.png';

export default function Header() {
  const {pathname} = useLocation();

  // rotas onde o header não deve aparecer
  const hiddenPaths = ['/login', '/cadastro', '/esqueci-a-senha'];
  const shouldHideOnMobile = hiddenPaths.some(
    p => pathname === p || pathname.startsWith(p + '/')
  );

  const colors = {
    "/":"bg-[var(--home-bg)]",
    "/vagas":"bg-[var(--jobs-bg)]",
    "/grupos":"bg-[var(--groups-bg)]",
    "/favoritos":"bg-[var(--favorites-bg)]",
    "/perfil":"bg-[var(--profile-bg)]",
  };

  const base = Object.keys(colors).find(k => pathname === k || pathname.startsWith(k + '/'));
  const bg = base ? colors[base] : 'bg-none';

  return(
      <header className={`${bg} ${shouldHideOnMobile ? 'hidden lg:flex':'flex'} justify-center h-fit py-3 border-b-2 mb-5 lg:border-b-0 lg:border-r-2 lg:mb-0 lg:w-auto lg:h-auto lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2`} aria-label="Site header">
        {/* Small logo (mobile) */}
        <img src={logo} alt="diver.sos logo" className="block lg:hidden w-[9rem] h-auto object-contain" />

        {/* Large logo (desktop) */}
        <img src={logo2} alt="diver.sos logo" className="hidden lg:block w-[9rem] h-auto object-contain" />
      </header>
  )
}
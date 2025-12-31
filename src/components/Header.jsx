import {useLocation} from 'react-router-dom';

export default function Header() {
  const {pathname} = useLocation();

  // rotas onde o header não deve aparecer
  const hiddenPaths = ['/login', '/cadastro', '/esqueci-a-senha'];
  if (hiddenPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;

  const colors = {
    "/":"bg-[var(--home-bg)]",
    "/vagas":"bg-[var(--jobs-bg)]",
    "/grupos":"bg-[var(--groups-bg)]",
    "/favoritos":"bg-[var(--favorites-bg)]",
    "/perfil":"bg-[var(--profile-bg)]",
  }

  const bg = pathname.startsWith('/vagas') ? colors['/vagas'] : (colors[pathname] || 'bg-none');

  return(
      <header className={`border-b-2
          bg-[url('../src/assets/logo.svg')]
          ${bg}
          bg-no-repeat
          bg-bottom
          bg-[length:9rem] 
          flex justify-center
          h-fit
          py-8 mb-5
          lg:border-b-0 lg:border-r-2 lg:mb-0 lg:w-auto lg:h-auto 
          lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2
          lg:bg-[url('../src/assets/logo2.png')] lg:bg-center
      `}>
      </header>
  )
}
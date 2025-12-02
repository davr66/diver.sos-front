import {Link} from "react-router-dom"

export default function NavBar(){
  let isLoggedIn = false;
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/oportunidades">Oportunidades</Link>
      <Link to="/grupos">Grupos de Apoio</Link>
      <Link to="/favoritos">Favoritos</Link>
      {isLoggedIn ? (<Link to="/perfil">Perfil</Link>):(<Link to="login"></Link>)}
    </nav>
  )
}
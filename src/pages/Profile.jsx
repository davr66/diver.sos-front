import { Link } from "react-router-dom";
import { getMyData } from "../services/api";
import { useEffect, useRef, useState } from "react";
import {useAuth} from '../context/AuthContext'
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";

export default function Profile(){
  const {logout,isAuthenticated} = useAuth();
  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutTimerRef = useRef(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const API_URL = import.meta.env.VITE_API_URL;
  const fotoPerfil = user?.fotoPerfil ? `${API_URL}${user.fotoPerfil}` : "../src/assets/profile-placeholder.png";
  console.log(fotoPerfil);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = user?.dataNascimento ? calculateAge(user.dataNascimento) : null;

  console.log(isAuthenticated);

  useEffect(()=>{
    const fetchUser = async () =>{
      try{
        const response = await getMyData();
        setUser(response.data);
      }catch(err){
        setError(true);
        console.error(err);
        if(err.response.status === 403) logout();
      }finally{
        setLoading(false);
      }
    };
    fetchUser();
  },[]);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, []);

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setFeedback({
      type: 'success',
      heading: 'Saindo...',
      message: 'Redirecionando...',
      duration: 2000
    });
    setShowFeedback(true);
    setFeedbackOnClose(() => () => setShowFeedback(false));

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => logout('/login'), 2000);
  };

  

  if(loading) return <Loading></Loading>

  return(
    <div className="flex flex-col items-center px-4 lg:px-15">
      <section className="flex flex-col items-center gap-1 border-b-1 w-full pb-5" id="profile-info">
        <div 
          className="w-40 h-40 rounded-full border-3 bg-cover bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url('${fotoPerfil}')`
          }}
        >
        </div>
        <h1 className="font-[Nunito] font-extrabold text-2xl">{user.nome}</h1>
        <div className="flex items-center justify-center bg-gray-300 text-center uppercase font-bold px-5 py-[2px] rounded-full border-2 text-[.65rem]">{user?.pronomes ?? 'seus pronomes'}</div>
        <p className="text-[.6rem] font-bold">{age ?? 'Idade'}, {user.endereco?.cidade ?? "Cidade"}/{user.endereco?.estado ?? "UF"}</p>
      </section>
      <section className="flex flex-col gap-10 items-center w-full py-10" id="buttons">
        <Link className="text-center w-[90%] max-w-[25rem] py-1 border-2 rounded-full bg-white font-bold uppercase hover:bg-gray-100" to={`/perfil/editar`}>Meus Dados</Link>
        <button
          className="text-center w-[90%] max-w-[25rem] py-1 border-black border-2 rounded-full bg-red-600 font-bold uppercase text-white hover:cursor-pointer hover:bg-red-700 disabled:cursor-not-allowed disabled:brightness-85"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          Sair
        </button>
      </section>

      {showFeedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          duration={feedback.duration || 3000}
          onClose={feedbackOnClose}
        />
      )}
    </div>
  );
}
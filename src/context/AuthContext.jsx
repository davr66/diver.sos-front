import { createContext,useContext, useEffect, useRef, useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext(null);
const TOKEN_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

export function AuthProvider({children}){
  const navigate = useNavigate();
  
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const scheduleLogout = (expiryTimestamp) => {
    clearLogoutTimer();

    const timeLeft = expiryTimestamp - Date.now();

    if (timeLeft <= 0) {
      logout();
      return;
    }

    logoutTimer.current = setTimeout(logout, timeLeft);
  };

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");
    const expiry = Number(sessionStorage.getItem("tokenExpiry"));

    if(token && role && expiry){
      if (expiry > Date.now()) {
        setUser({ token, role, name });
        scheduleLogout(expiry);
      } else {
        logout();
      }
    }

    setLoading(false);
  },[])

  const login = async(loginData)=>{
    const reqData = {
      email:loginData.email,
      senha: loginData.password
    }

    try {
      const { data } = await loginUser(reqData);
      const expiryTimestamp = Date.now() + TOKEN_EXPIRATION_MS;
      
      sessionStorage.setItem("token",data.token);
      sessionStorage.setItem("role",data.role);
      sessionStorage.setItem("name",data.nome);
      sessionStorage.setItem("tokenExpiry", String(expiryTimestamp));

      setUser({
        token:data.token,
        role:data.role,
        name:data.nome
      })

      scheduleLogout(expiryTimestamp);
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || 'Erro ao fazer login';
      const enhanced = new Error(message);
      enhanced.status = status;
      enhanced.data = err?.response?.data;
      throw enhanced;
    }
  }

  function logout(){
    clearLogoutTimer();
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  }

  useEffect(() => clearLogoutTimer, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
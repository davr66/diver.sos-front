import { createContext,useContext, useEffect, useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext(null);

export function AuthProvider({children}){
  const navigate = useNavigate();
  
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");

    if(token && role){
      setUser({user,role,name})
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
      
      sessionStorage.setItem("token",data.token);
      sessionStorage.setItem("role",data.role);
      sessionStorage.setItem("name",data.nome);

      setUser({
        token:data.token,
        role:data.role,
        name:data.nome
      })
    } catch (err) {
      const message = err?.response?.data?.message || 'Erro no login';
      throw new Error(message);
    }
  }

  function logout(){
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  }

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
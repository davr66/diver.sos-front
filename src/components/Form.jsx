import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";

export default function Form() {
  const [currentPage, setCurrentPage] = useState("login");
  const [userData, setUserData] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (user) => {
    setUserData(user);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentPage("login");
  };

  return (
    <div>
      {currentPage === 'login' && (
        <Login 
          onNavigate={navigate} 
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'register' && (
        <Register onNavigate={navigate} />
      )}
      {currentPage === 'forgot' && (
        <ForgotPassword onNavigate={navigate} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard
          userData={userData} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}



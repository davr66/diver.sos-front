import { AlertCircle, CheckCircle } from 'lucide-react';
import logo from "../assets/logo.svg"

export default function AuthLayout({ children, error, success }) {
  return (
    <div className="min-h-screen bg-[#C8F5B8] flex flex-col">
      {/* Logo no topo */}
      <img 
        src={logo} 
        alt="Logo"
        className="w-80 pb-4 pt-12 block mx-auto"
      />
      
      {/* Card centralizado abaixo */}
      <div className="flex items-start justify-center" >
        <div className="bg-white rounded-3xl border-6 border-black shadow-lg max-w-md w-full">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start m-4">
              <AlertCircle className="text-red-500 mr-2" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start m-4">
              <CheckCircle className="text-green-500 mr-2" size={18} />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
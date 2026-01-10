import { useEffect, useState } from 'react';
import { MdErrorOutline,MdOutlineClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function Feedback({ type = 'success', heading, message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Auto-fechar após duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Aguarda animação de saída
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <FaCheck className="w-5 h-5"/> : <MdErrorOutline className="w-6 h-6"/>;

  return (
    <div
      className={`fixed top-4 right-1 z-50 flex items-start gap-3 p-4 rounded-lg shadow-lg border-2 border-b-4 border-r-4 bg-white w-[90%] min-w-[200px] max-w-[400px] lg:w-[400px] lg:right-5 transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-lg`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sm mb-1">{heading}</h3>
        <p className="text-xs text-gray-600">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="text-gray-400 hover:text-gray-600 hover:cursor-pointer font-bold"
      >
        <MdOutlineClose/>
      </button>
    </div>
  );
}

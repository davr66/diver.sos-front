import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack } from "react-icons/md";

export default function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
    setTimeout(() => {
      if (window.location.pathname === window.location.pathname) {
        navigate(fallback);
      }
    }, 50);
  };

  return (
    <button className="flex items-center gap-1 leading-none font-['Nunito'] p-1 rounded-full hover:cursor-pointer hover:bg-[#b0a5a54A]" onClick={handleBack}>
      <MdOutlineArrowBack size={25}/>
    </button>
  );
}
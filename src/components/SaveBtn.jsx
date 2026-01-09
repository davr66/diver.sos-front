import { useState } from "react";
import { FavoriteIcon, FavoriteIconFilled } from "../assets/nav";

export default function SaveBtn({ active, onClick }) {
  const [hover, setHover] = useState(false);
  const showFilled = active || hover;

  const svgBaseClasses = "w-full h-full transition-opacity duration-150 group-hover:opacity-0 pointer-events-none";

  return (
    <button
    className="w-7 h-7 inline-flex items-center justify-center hover:cursor-pointer" 
    onMouseEnter={()=>setHover(true)}
    onMouseLeave={()=>setHover(false)}
    onFocus={()=>setHover(true)} 
    onBlur={()=>setHover(false)}
    onClick={onClick}>
      {showFilled ? <FavoriteIconFilled className={svgBaseClasses} /> : <FavoriteIcon className={svgBaseClasses} />}
    </button>
  );
}
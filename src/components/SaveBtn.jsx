import { useState, useRef } from "react";
import { FavoriteIcon, FavoriteIconFilled } from "../assets/nav";

export default function SaveBtn({ active, onClick }) {
  const [hover, setHover] = useState(false);
  const btnRef = useRef(null);
  const showFilled = active || hover;

  const svgBaseClasses = "w-full h-full transition-opacity duration-150 pointer-events-none";

  const handleClick = (e) => {
    const el = btnRef.current;
    if (el) {
      el.classList.remove('animate-pop');
      void el.offsetWidth;
      el.classList.add('animate-pop');
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      data-testid="save-button"
      aria-pressed={active ? "true" : "false"}
      className="w-10 h-10 rounded-full p-1 inline-flex items-center justify-center hover:cursor-pointer hover:bg-[#fc5353] hover:bg-opacity-60"
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onFocus={()=>setHover(true)} 
      onBlur={()=>setHover(false)}
      onClick={handleClick}>
      {showFilled ? <FavoriteIconFilled className={svgBaseClasses} /> : <FavoriteIcon className={svgBaseClasses} />}
    </button>
  );
}
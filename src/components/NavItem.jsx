import { NavLink } from "react-router-dom";

export default function NavItem({
  href,
  label,
  Icon,
  IconActive,
  bgColor
}) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `flex flex-col justify-between items-center text-sm max-h-15 rounded-full
        lg:hover:bg-stone-200
        lg:max-h-30 lg:flex-row lg:min-w-[85%] lg:justify-start lg:gap-3 lg:px-4 lg:py-2 ro
         ${isActive ? "scale-105" : "scale-100"}`
      }
      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
    >
      {({ isActive }) => {
        const SelectedIcon = isActive ? IconActive : Icon;

        return (
          <>
            <span
              className={`w-10 h-10 flex items-center justify-center transition-transform duration-200
                lg:justify-start
                ${isActive ? "scale-105" : "scale-100"}`}
            >
              <SelectedIcon
                className="max-w-full max-h-full w-auto h-auto"
                preserveAspectRatio="xMidYMid meet"
              />
            </span>

            <span
              className={`inline-block text-[.6rem] font-bold leading-none px-2 py-[0.1rem]
                rounded-full transition-colors duration-200
                lg:text-base
                ${isActive ? "scale-105" : "scale-100"}`}
              style={isActive && bgColor ? { backgroundColor: bgColor } : undefined}
            >
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}

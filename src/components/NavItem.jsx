import { NavLink, useLocation } from "react-router-dom";

export default function NavItem({
  href,
  label,
  Icon,
  IconActive,
  bgColor,
  match
}) {
  const { pathname } = useLocation();

  const isActive = (() => {
    if (!match) return pathname === href || pathname.startsWith(href + "/");

    if (Array.isArray(match)) {
      return match.some(route =>
        route.endsWith("*")
          ? pathname.startsWith(route.slice(0, -1))
          : pathname === route
      );
    }

    return pathname === match;
  })();

  const SelectedIcon = isActive ? IconActive : Icon;

  return (
    <NavLink
      to={href}
      className={`flex flex-col justify-between items-center text-sm max-h-15 rounded-full
        lg:hover:bg-stone-200
        lg:max-h-30 lg:flex-row lg:min-w-[85%] lg:justify-start lg:gap-3 lg:px-4 lg:py-2
        transition-transform
        ${isActive ? "scale-105" : "scale-100"}
      `}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="w-10 h-10 flex items-center justify-center">
        <SelectedIcon className="max-w-full max-h-full w-auto h-auto" />
      </span>

      <span
        className={`inline-block text-[.6rem] font-bold leading-none px-2 py-[0.1rem]
          rounded-full transition-colors
          lg:text-base
        `}
        style={isActive && bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {label}
      </span>
    </NavLink>
  );
}

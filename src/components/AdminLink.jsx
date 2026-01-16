import { Link } from "react-router-dom";

export default function AdminLink({label,description,icon: Icon,href,bgColor}){
  return(
    <Link className="flex flex-col w-80 items-center lg:min-w-95 max-w-95 px-1 py-10 rounded-xl border-2 border-b-4 border-r-4 hover:scale-105 transition-all gap-2" to={href} style={bgColor ? { backgroundColor: bgColor } : undefined}>
      <span className="w-20 h-20 flex items-center justify-center">
        <Icon className="w-full h-full" />
      </span>
      <h2 className="font-bold text-lg">{label}</h2>
      <p className="text-center text-sm italic w-[80%]">{description}</p>
    </Link>
  )
}
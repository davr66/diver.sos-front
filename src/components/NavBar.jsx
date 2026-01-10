export default function NavBar({children}){
  return (
    <nav className="bg-white z-1 fixed bottom-5 left-0 right-0 
    flex justify-evenly items-center
    rounded-full border-2 border-b-5 border-r-5 px-2 pt-1 pb-2 w-[96%] mx-auto
    lg:flex-col lg:static lg:rounded-none lg:border-r-2 lg:border-y-0 lg:border-l-0 lg:w-full lg:max-h-screen
    lg:justify-center lg:gap-6
    lg:row-start-3 lg:row-end-9 lg:col-start-1 lg:col-end-2
    ">
      {children}
    </nav>
  )
}
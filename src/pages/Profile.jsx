import { Link } from "react-router-dom";

export default function Profile(){
  return(
    <div className="flex flex-col items-center px-4 lg:px-15">
      <section className="flex flex-col items-center gap-1 border-b-1 w-full pb-5" id="profile-info">
        <div className="rounded-full border-3">
          <img src="./src/assets/profile.png" className="w-full h-full rounded-full object-fit" />
        </div>
        <h1 className="font-[Nunito] font-extrabold text-2xl">Marcelo Pires</h1>
        <div className="flex items-center justify-center bg-gray-300 text-center uppercase font-bold px-5 py-[2px] rounded-full border-2 text-[.65rem]">ele/dele</div>
        <p className="text-[.6rem] font-bold">21 anos, Fortaleza/CE</p>
      </section>
      <section className="flex flex-col gap-10 items-center w-full py-10" id="buttons">
        <Link className="text-center w-[90%] max-w-[25rem] py-1 border-2 rounded-full bg-white font-bold uppercase hover:bg-gray-100 ">Meus Dados</Link>
        <button className="text-center w-[90%] max-w-[25rem] py-1 border-black border-2 rounded-full bg-red-600 font-bold uppercase text-white hover:cursor-pointer hover:bg-red-700">Sair</button>
      </section>
    </div>
  );
}
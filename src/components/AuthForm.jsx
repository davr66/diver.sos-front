export default function AuthForm({heading,onSubmit,children,btnText}){
  return(
    <form className="flex flex-col items-center gap-4 border-2 rounded-xl p-5 bg-white w-[85%]"onSubmit={onSubmit}>
        <h1 className="font-[Nunito] text-xl font-extrabold">{heading}</h1>
        {children}
        <button className="bg-[#71CC47] text-sm font-bold uppercase border-2 border-b-4 border-r-4 rounded-lg w-full py-2"type="submit">{btnText}</button>
    </form>
  );
}
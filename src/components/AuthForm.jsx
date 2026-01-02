export default function AuthForm({ heading, onSubmit, children, btnText, footer }) {
  return (
    <form className="flex flex-col items-center gap-4 border-2 rounded-xl p-5 bg-white w-[85%] max-w-100" onSubmit={onSubmit}>
      <h1 className="font-[Nunito] text-2xl font-extrabold">{heading}</h1>
      {children}
      <button className="bg-[#71CC47] hover:bg-[#5ba339] hover:cursor-pointer text-sm font-bold uppercase border-3 border-b-4 border-r-4 rounded-lg w-full py-[.7rem]" type="submit">{btnText}</button>
      {footer}
    </form>
  );
}
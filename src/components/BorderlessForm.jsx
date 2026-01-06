export default function BorderlessForm({ heading, onSubmit, children, btnText, footer, className = "" }) {
  return (
    <form className={`flex flex-col items-center gap-4 p-0 w-full max-w-[45rem] ${className}`} onSubmit={onSubmit}>
      {heading && <h1 className="font-[Nunito] text-xl font-extrabold">{heading}</h1>}

      <div className="w-full">{children}</div>

      {btnText && (
        <button
          className="bg-[#71CC47] hover:bg-[#5ba339] hover:cursor-pointer text-sm font-bold uppercase rounded-lg w-full py-[.7rem]"
          type="submit"
        >
          {btnText}
        </button>
      )}

      {footer}
    </form>
  );
}

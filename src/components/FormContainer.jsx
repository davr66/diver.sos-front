export default function FormContainer({ heading, onSubmit, children, btnText, footer, bordered = true, className = "" }) {
  const containerClass = bordered
    ? "flex flex-col items-center gap-4 border-2 rounded-xl p-5 bg-white w-[85%] max-w-100"
    : "flex flex-col items-center gap-4 p-0 w-full max-w-[45rem]";

  const headingClass = bordered ? "font-[Nunito] text-2xl font-extrabold" : "font-[Nunito] text-xl font-extrabold";

  const buttonClass = "bg-[#71CC47] hover:bg-[#5ba339] hover:cursor-pointer text-sm font-bold uppercase border-3 border-b-4 border-r-4 rounded-lg w-full py-[.7rem] mt-2";

  return (
    <form className={`${containerClass} ${className}`} onSubmit={onSubmit}>
      {heading && <h1 className={headingClass}>{heading}</h1>}

      <div className="w-full flex flex-col gap-4">{children}</div>

      {btnText && (
        <button className={buttonClass} type="submit">
          {btnText}
        </button>
      )}

      {footer}
    </form>
  );
}

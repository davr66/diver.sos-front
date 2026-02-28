import { useEffect, useState } from "react"
import logo from "../assets/logo.svg"
import Loading from "./Loading"

export default function Preloader({ onFinish }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onFinish, 600)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 bg-[var(--home-bg)] flex flex-col items-center justify-center z-[9999] transition-opacity duration-600 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <img className="w-50 lg:w-70" src={logo} alt="Logo da diver.sos" />
      <Loading/>
    </div>
  )
}
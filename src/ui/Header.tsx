import { Link } from "react-router-dom"
import { HomeIcon, CreditCardIcon, UserIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface NavbarProps {
  handleLogout: () => void
}

const Navbar = ({ handleLogout }: NavbarProps) => {
  const [open, setOpen] = useState(false)

  const linkClasses = "flex items-center px-3 py-2 rounded-lg hover:bg-violet-600 transition-colors duration-200"

  return (
    <header className="bg-violet-700 text-white p-4 flex justify-between items-center">
      <span className="font-bold text-lg">Deudas</span>

      <ul className="hidden md:flex space-x-4">
        <li><Link to="/dashboard" className={linkClasses}><HomeIcon className="h-5 w-5 mr-2" />Inicio</Link></li>
        <li><Link to="/debts" className={linkClasses}><CreditCardIcon className="h-5 w-5 mr-2" />Deudas</Link></li>
        <li><Link to="/profile" className={linkClasses}><UserIcon className="h-5 w-5 mr-2" />Perfil</Link></li>
        <li>
          <button type="button" onClick={handleLogout} className={linkClasses}>
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />Salir
          </button>
        </li>
      </ul>

      <button onClick={() => setOpen(prev => !prev)} className="md:hidden">
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {open && (
        <ul className="flex flex-col space-y-2 mt-2 md:hidden bg-violet-700 p-2 rounded-lg absolute right-4 top-16 w-48 shadow-lg z-50">
          <li><Link to="/dashboard" className={linkClasses} onClick={() => setOpen(false)}><HomeIcon className="h-5 w-5 mr-2" />Inicio</Link></li>
          <li><Link to="/debts" className={linkClasses} onClick={() => setOpen(false)}><CreditCardIcon className="h-5 w-5 mr-2" />Deudas</Link></li>
          <li><Link to="/profile" className={linkClasses} onClick={() => setOpen(false)}><UserIcon className="h-5 w-5 mr-2" />Perfil</Link></li>
          <li>
            <button type="button" onClick={() => { handleLogout(); setOpen(false) }} className={linkClasses}>
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />Salir
            </button>
          </li>
        </ul>
      )}
    </header>
  )
}

export default Navbar
import { Link } from "react-router-dom"
import { HomeIcon, CreditCardIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface NavbarProps {
  handleLogout: () => void
}

const Navbar = ({ handleLogout }: NavbarProps) => {
  const [open, setOpen] = useState(false)

  const linkClasses = "flex items-center px-3 py-2 rounded-lg hover:bg-violet-600 transition-colors duration-200"

  return (
    <header className="bg-violet-700 text-white p-4 flex justify-between items-center">
      <Link className="flex items-center gap-2" to="/dashboard">
        <div className="w-8 h-8 bg-linear-to-br from-violet-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
          <span className="font-black text-sm italic">C</span>
        </div>
        <span className="font-bold text-lg tracking-tight">CuentasClaras</span>
      </Link>

      <ul className="hidden md:flex space-x-4">
        <li><Link to="/dashboard" className={linkClasses}><HomeIcon className="h-5 w-5 mr-2" />Dashboard</Link></li>
        <li><Link to="/debts" className={linkClasses}><CreditCardIcon className="h-5 w-5 mr-2" />Deudas</Link></li>
        <li><Link to="/settings" className={linkClasses}><Cog6ToothIcon className="h-5 w-5 mr-2" />Configuración</Link></li>
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
          <li><Link to="/dashboard" className={linkClasses} onClick={() => setOpen(false)}><HomeIcon className="h-5 w-5 mr-2" />Dashboard</Link></li>
          <li><Link to="/debts" className={linkClasses} onClick={() => setOpen(false)}><CreditCardIcon className="h-5 w-5 mr-2" />Deudas</Link></li>
          <li><Link to="/settings" className={linkClasses} onClick={() => setOpen(false)}><Cog6ToothIcon className="h-5 w-5 mr-2" />Configuración</Link></li>
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
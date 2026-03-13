import { useState } from 'react'
import SignupForm from '../features/auth/components/SignupForm'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  return (
    <div className="App h-screen flex items-center justify-center">
      {isLoggedIn
        ? <button onClick={() => setIsLoggedIn(prev => !prev)} className='p-2.5 text-[16px] bg-violet-700 text-white border-none cursor-pointer rounded-md hover:bg-gray-200 transition-colors duration-300'>Cerrar sesion</button>
        : <SignupForm setLoggedIn={setIsLoggedIn} />}
    </div>
  )
}

export default App

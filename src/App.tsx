import { useSession } from './features/auth/hooks/useSession'

import './App.css'

function App() {
  const { data: session, isLoading, error } = useSession()

  // if (isLoading) {
  //   console.log("Loading session...", isLoading)
  //   return <div>Cargando...</div>
  // }

  if (error) {
    return (
      <div className="App h-screen flex-col  items-center justify-center bg-violet-950 text-white">
        <a href="/login" className='block p-2.5 text-[16px] bg-violet-700 text-white border-none cursor-pointer rounded-md hover:bg-gray-200 hover:text-black transition-colors duration-300'>
          Login
        </a>
        Bienvenido a la aplicación de gestión de deudas
        <div className=''>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1>Hola {session.name}, bienvenido a la aplicación de gestión de deudas</h1>
    </>
  )

}

export default App

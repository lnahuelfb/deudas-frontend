interface LoginFormProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm = ({ setLoggedIn }: LoginFormProps) => {
  const inputStyles = "mb-[10px] p-[8px] text-[16px] border-white border-2 rounded-md focus:outline-none focus:border-violet-500"

  return (
    <form className="flex flex-col w-75 mx-auto bg-violet-700 text-white border p-5 rounded-3xl">
      <h2 className="text-[20px] font-bold mb-4">Inicia sesion: </h2>
      <input
        type="text"
        placeholder="Username"
        className={inputStyles}
      />

      <input
        type="password"
        placeholder="Password"
        className={inputStyles}
      />

      <a href="#" className="text-[14px] text-white hover:underline mb-2">
        ¿Olvidaste tu contraseña?
      </a>

      <button
        type="submit"
        className="p-2.5 text-[16px] bg-[white] text-violet-700 border-none cursor-pointer rounded-md hover:bg-gray-200 transition-colors duration-300 my-1.5"
        onClick={() => setLoggedIn(prev => !prev)}
      >
        Registrate
      </button>

    </form>
  )
}

export default LoginForm
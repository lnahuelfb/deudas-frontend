import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import LoginForm from '@features/auth/components/LoginForm';

function Login() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useSession();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-950 text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-violet-950 to-violet-800 text-white">
      <LoginForm />
    </div>
  );
}

export default Login;
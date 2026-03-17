import { Outlet, Navigate} from "react-router-dom";
import Header from "@/ui/Header";
import { useSession } from "@/features/auth/hooks/useSession";

export const AppLayout = () => {
  const { data: user, isLoading, error } = useSession();

  if (isLoading) return <div>Cargando...</div>;

  if (error || !user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
      if (!res.ok) throw new Error("Logout failed")
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div>
      <Header handleLogout={handleLogout} />

      <main className="p-4 bg-violet-950 min-h-screen text-white">
        <Outlet />
      </main>
    </div>
  );
};
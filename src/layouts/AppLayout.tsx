import { Outlet, Navigate} from "react-router-dom";
import Header from "@/ui/Header";
import { useSession } from "@/features/auth/hooks/useSession";
import { Toaster } from "sonner";
import { API_URL } from "@/config/api.config";
import { InstallBanner, IOSInstallModal } from "@/ui/InstallPWA";
import { PWAInstallProvider } from "@/hooks/PWAInstallContext";

export const AppLayout = () => {
  const { data: user, isLoading, error } = useSession();

  if (isLoading) return null;

  if (error || !user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
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
    <PWAInstallProvider>
      <div>
        <Toaster richColors position="bottom-right" />
        <Header handleLogout={handleLogout} />

        <main className="p-4 bg-violet-950 min-h-screen text-white">
          <Outlet />
        </main>

        <InstallBanner />
        <IOSInstallModal />
      </div>
    </PWAInstallProvider>
  );
};
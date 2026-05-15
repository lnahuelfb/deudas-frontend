import { useState, useEffect } from 'react';
import { useSession } from '@/features/auth/hooks/useSession';
import { useUpdateUser } from '@/features/auth/hooks/useUpdateUser';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  BanknotesIcon, 
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import { API_URL } from '@/config/api.config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Settings() {
  const { data: session } = useSession();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    }
  });
  
  // States para Perfil
  const [name, setName] = useState('');
  const [limit, setLimit] = useState<number>(0);

  // States para Seguridad
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      setName(session.name || '');
      setLimit(session.monthlySpendingLimit || 0);
    }
  }, [session]);

  const handleSaveProfile = () => {
    // Aseguramos que el límite sea un número
    updateUser({ 
      name, 
      monthlySpendingLimit: Number(limit) 
    });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    updateUser({ password: newPassword });
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-black italic tracking-tight text-white mb-2">Configuración</h1>
        <p className="text-violet-300/60 font-bold uppercase text-xs tracking-[0.3em]">Gestioná tu perfil y seguridad</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar de Configuración */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Perfil', icon: UserIcon },
            { id: 'security', label: 'Seguridad', icon: ShieldCheckIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-white text-[#1e1b4b] shadow-xl' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          
          <div className="h-px bg-white/5 my-4" />
          
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>

        {/* Panel Principal */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div 
                key="profile-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-black flex items-center gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                      <UserIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white focus:ring-2 focus:ring-violet-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">Email</label>
                      <input 
                        type="email" 
                        value={session.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white/30 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="space-y-6">
                  <h3 className="text-white text-xl font-black flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <BanknotesIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    Salud Financiera
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-400 uppercase ml-2 tracking-widest">Límite Mensual ($)</label>
                        <div className="relative">
                          <CurrencyDollarIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
                          <input 
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 p-5 pl-12 rounded-3xl text-white font-bold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div className="pb-4">
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-wider leading-relaxed">
                          Ajustá tu presupuesto mensual para recibir alertas visuales en el Dashboard.
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="1000000" 
                        step="5000"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] font-black text-white/20 uppercase mt-2">
                        <span>$0</span>
                        <span>$1.000.000+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isPending}
                  className="w-full bg-white text-[#1e1b4b] p-6 rounded-4xl font-black uppercase text-sm shadow-xl hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="security-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-black flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <KeyIcon className="w-5 h-5 text-red-400" />
                    </div>
                    Cambiar Contraseña
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">Nueva Contraseña</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
                          placeholder="••••••••"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">Confirmar Contraseña</label>
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] flex gap-4">
                   <ShieldCheckIcon className="w-6 h-6 text-red-400 shrink-0" />
                   <p className="text-red-200/60 text-xs leading-relaxed">
                     Asegúrate de usar una contraseña que no compartas con otros servicios. 
                     Tu seguridad es nuestra prioridad.
                   </p>
                </div>

                <button
                  onClick={handleUpdatePassword}
                  disabled={isPending || !newPassword}
                  className="w-full bg-white text-[#1e1b4b] p-6 rounded-4xl font-black uppercase text-sm shadow-xl hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

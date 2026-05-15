import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSession } from '@/features/auth/hooks/useSession';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  CreditCardIcon, 
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
  const { data: user, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#1e1b4b] text-white selection:bg-violet-500/30 overflow-x-hidden">
      {/* Navbar Simple */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="font-black text-xl italic">D</span>
          </div>
          <span className="text-2xl font-black italic tracking-tighter">DeudApp</span>
        </div>
        <Link 
          to="/login" 
          className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full font-bold text-sm transition-all border border-white/10"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full text-violet-300 text-xs font-bold uppercase tracking-widest"
          >
            <SparklesIcon className="w-4 h-4" />
            Controlá tu futuro financiero
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tight leading-[0.9]"
          >
            TUS CUOTAS, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-300">BAJO CONTROL.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-violet-200/60 text-lg md:text-xl font-medium leading-relaxed"
          >
            La plataforma definitiva para gestionar tus tarjetas de crédito, consumos en cuotas y suscripciones. Sin complicaciones, de forma privada y segura.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 justify-center pt-8"
          >
            <Link 
              to="/register" 
              className="bg-white text-[#1e1b4b] px-10 py-5 rounded-3xl font-black uppercase text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Empezar ahora gratis
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<CreditCardIcon className="w-8 h-8" />}
          title="Gestión de Tarjetas"
          description="Sincronizá tus fechas de cierre y vencimiento. No más sorpresas a fin de mes."
          delay={0.4}
        />
        <FeatureCard 
          icon={<ChartBarIcon className="w-8 h-8" />}
          title="Salud Financiera"
          description="Visualizá tus gastos por categoría y recibí alertas cuando te acerques a tu límite mensual."
          delay={0.5}
        />
        <FeatureCard 
          icon={<ShieldCheckIcon className="w-8 h-8" />}
          title="Privacidad Total"
          description="Tu información es privada y está protegida. Solo vos tenés acceso a tus datos financieros."
          delay={0.6}
        />
      </section>

      {/* Footer Limpio */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-violet-200/30 font-bold text-xs uppercase tracking-widest">
          <p>© 2026 DeudApp. Gestión de finanzas personales.</p>
          <p>Hecho con ❤️ para tu salud financiera.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 bg-white/5 border border-white/10 rounded-[3rem] space-y-4 hover:bg-white/[0.07] transition-colors group"
    >
      <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black italic tracking-tight">{title}</h3>
      <p className="text-violet-200/50 text-sm font-semibold leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

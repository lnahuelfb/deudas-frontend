import { useState } from 'react';
import { DebtCard } from '@/features/debt/components/DebtCard';
import { AddCardModal } from '@/features/debt/components/AddCardModal';
import { useCards } from '@/features/debt/hooks/useCards';
import { CardDetailDrawer } from '@/features/debt/components/CardDetailDrawler';
import type { CardWithSummary, Card } from '@/features/debt/types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';


const DebtsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithSummary | null>(null);

  const {cards, loading, error} = useCards() as unknown as { cards: CardWithSummary[], loading: boolean, error: string | null }

  if(error) {
    return (
      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-white italic tracking-tight">Mis Deudas</h1>
          <p className="text-violet-200 opacity-70 font-semibold mt-1">Gestioná tus tarjetas y cuotas</p>
          <div className="mt-10 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-bold">Error al cargar las tarjetas:</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <header className="mb-10 pt-6 max-w-7xl mx-auto px-2">
        <h1 className="text-4xl font-black text-white italic tracking-tight">Mis Deudas</h1>
        <p className="text-violet-200 opacity-70 font-semibold mt-1">Gestioná tus tarjetas y cuotas</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Listado de Tarjetas */}
        {!loading && cards.map((card: CardWithSummary) => {
          return (
            <DebtCard
              key={card.id}
              card={card}
              loading={loading}
              onClick={() => setSelectedCard(card)}
            />
          )
        })}


        {/* Botón de Nueva Tarjeta integrado al Grid para pantallas grandes */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group w-full min-h-50 border-2 border-dashed border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all bg-white/5 hover:bg-white/10 shadow-sm"
        >
          <div className="p-4 bg-white/5 rounded-full mb-3 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
            <PlusIcon className="w-8 h-8 stroke-3" />
          </div>
          <span className="font-black text-sm uppercase tracking-widest opacity-60">Nueva Tarjeta</span>
        </button>
      </main>

      {/* Botón flotante para CREAR tarjeta (Visible solo en mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="md:hidden fixed bottom-8 right-6 bg-white text-[#4c1d95] p-5 rounded-4xl shadow-2xl z-50 active:scale-90 transition-transform"
      >
        <PlusIcon className="w-8 h-8 stroke-3" />
      </button>

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data: Card) => {
          console.log("Nueva tarjeta creada:", data);
          setIsAddModalOpen(false);
        }}
      />

      <CardDetailDrawer
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};

export default DebtsPage;
// src/pages/DebtsPage.tsx
import { useState } from 'react';
import { DebtCard } from '@/features/debt/components/DebtCard';
import { AddCardModal } from '@/features/debt/components/AddCardModal';
import { CardDetailDrawer } from '@/features/debt/components/CardDetailDrawler';
import type { CardWithSummary, Card } from '@/features/debt/types';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const DebtsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardWithSummary | null>(null);

  const { data: cards } : { data: CardWithSummary[] } = { data: [
    { id: "card_1",
      name: "Visa Santander",
      brand: "Visa",
      color: "#7c3aed",
      closingDay: 25,
      dueDay: 10,
      monthlyTotal: 23500,
      isCreditCard: true
    },

    { id: "card_2",
      name: "Naranja",
      brand: "Naranja",
      color: "#db2777",
      monthlyTotal: 12000,
      isCreditCard: false
    },

    { id: "card_3",
      name: "Deuda Personal",
      color: "#059669",
      monthlyTotal: 5000,
      isCreditCard: false
    }
  ] }; // Mock

  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Listado de Tarjetas */}
      {cards.map(card => (
        <DebtCard 
          key={card.id} 
          card={card} 
          onClick={() => setSelectedCard(card)} // Al clickear, seteamos la tarjeta y se abre el detalle
        />
      ))}

      {/* Botón flotante para CREAR tarjeta nueva */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-6 bg-white text-[#4c1d95] p-4 rounded-3xl shadow-2xl z-50"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      {/* 1. Modal para CREAR (El formulario de colores) */}
      <AddCardModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={(data: any) => {
          console.log("Creando tarjeta...", data);
          setIsAddModalOpen(false);
        }}
      />

      {/* 2. El Drawer para VER DETALLES (Lo que elegiste en vez de página) */}
      <CardDetailDrawer 
        card={selectedCard} 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)} 
      />
    </div>
  );
};

export default DebtsPage;
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSchema, type Card } from '@features/cards/types';

export const useAddCardForm = (onSubmit: (data: Card) => void) => {
  const form = useForm<Card>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      color: "#7c3aed",
      brand: "Visa",
      isCreditCard: true
    }
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
  });

  return {
    ...form,
    handleFormSubmit,
    selectedColor: form.watch('color'),
    cardName: form.watch('name'),
    cardBrand: form.watch('brand')
  };
};
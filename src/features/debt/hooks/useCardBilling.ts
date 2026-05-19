import { useMemo } from 'react';
import type { Debt, Card } from '../types';

export const useCardBilling = (card: Card | null | undefined, debts: Debt[]) => {
  return useMemo(() => {
    // Si no es tarjeta de crédito o le faltan datos, mostramos todo junto
    if (!card || !card.closingDay || !card.dueDay) {
      return {
        currentStatementDebts: debts,
        nextStatementDebts: [],
        currentTotal: debts.reduce((acc, d) => acc + (d.amountPerMonth || 0), 0),
        nextTotal: 0,
        currentStatementName: "Gastos Actuales",
        nextStatementName: "Próximos Gastos",
      };
    }

    const closingDay = card.closingDay;
    const dueDay = card.dueDay;
    const today = new Date();
    
    // 1. Determinar cuál es el "Resumen Actual" (Mes y Año Objetivo)
    let targetMonth = today.getMonth(); // 0 = Enero, 11 = Diciembre
    let targetYear = today.getFullYear();

    // Si ya pasamos la fecha de vencimiento, el usuario ya pagó este mes.
    // El "Resumen Actual" pasa a ser el del mes siguiente.
    if (today.getDate() > dueDay) {
      targetMonth += 1;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }

    const currentStatementDebts: (Debt & { currentInstallmentNumber: number })[] = [];
    const nextStatementDebts: (Debt & { currentInstallmentNumber: number })[] = [];

    debts.forEach((debt) => {
      // Si no tiene startDate, asumimos hoy como fallback de seguridad
      const purchaseDate = new Date(debt.startDate || new Date());
      const pMonth = purchaseDate.getMonth();
      const pYear = purchaseDate.getFullYear();
      const pDay = purchaseDate.getDate();

      // 2. ¿Cuándo es el PRIMER resumen en el que entra esta compra?
      let firstStatementMonth = pMonth;
      let firstStatementYear = pYear;

      // Si compramos DESPUÉS del día de cierre, salta al resumen del mes que viene
      if (pDay > closingDay) {
        firstStatementMonth += 1;
        if (firstStatementMonth > 11) {
          firstStatementMonth = 0;
          firstStatementYear += 1;
        }
      }

      // 3. ¿Cuántos meses pasaron entre el Primer Resumen y el Resumen Objetivo (Target)?
      // deltaMonths = 0 significa que estamos en el mes exacto de la Cuota 1
      const deltaMonthsCurrent = (targetYear - firstStatementYear) * 12 + (targetMonth - firstStatementMonth);

      // Delta para el "Mes que viene"
      const deltaMonthsNext = deltaMonthsCurrent + 1;

      // 4. Analizar si entra "Este Mes"
      if (debt.isSubscription) {
        // Suscripciones: Solo las mostramos en el resumen actual si ya empezaron
        if (deltaMonthsCurrent >= 0) {
          currentStatementDebts.push({ ...debt, currentInstallmentNumber: 0 }); // 0 para indicar que no aplica nro de cuota
        }
      } else {
        // Deuda normal
        const paidInst = typeof debt.initialPaidInstallments === 'number' ? debt.initialPaidInstallments : 0;
        const nextInstToPay = paidInst + 1;
        
        if (deltaMonthsCurrent >= 0) {
          // Si el mes de la primera cuota ya llegó (o pasó), TIENE que estar en el resumen actual a pagar
          currentStatementDebts.push({ ...debt, currentInstallmentNumber: nextInstToPay });
        } else if (deltaMonthsNext === 0) {
          // Si recién arranca el mes que viene (compraste después del cierre), lo mostramos como "Próximo"
          nextStatementDebts.push({ ...debt, currentInstallmentNumber: nextInstToPay });
        }
      }
    });

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Calculamos el mes que viene para los textos
    let nextMonthIndex = targetMonth + 1;
    if (nextMonthIndex > 11) nextMonthIndex = 0;

    return {
      currentStatementDebts,
      nextStatementDebts,
      currentTotal: currentStatementDebts.reduce((acc, d) => acc + (d.amountPerMonth || 0), 0),
      nextTotal: nextStatementDebts.reduce((acc, d) => acc + (d.amountPerMonth || 0), 0),
      currentStatementName: `Resumen de ${monthNames[targetMonth]}`,
      nextStatementName: `Resumen de ${monthNames[nextMonthIndex]}`,
    };
  }, [card, debts]);
};

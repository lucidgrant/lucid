// WARNING: Using 'useMemo' directly in this utility function is an **anti-pattern**.
// React Hooks must only be called inside a functional component or a custom Hook.
// Move this logic into a dedicated custom Hook (e.g., `useCalculatedTotals`) for correct behavior and memoization.

import { useMemo } from 'react';
import { Item } from 'src/types/item';

// Function to calculate the amount of each item (quantity x price)
export const calculateItemAmount = (item: Item): number => {
  // Implicit type check for item.quantity and item.price (consider explicit checks for robustness)
  return item.quantity * item.price;
};

// Function to calculate the total amount of all items (the total HT)
export const calculateTotalAmountHT = (items: Item[]): number => {
  // Using reduce to sum up the amounts of all items without modifying the original array (immutability)
  return items.reduce((total, item) => total + calculateItemAmount(item), 0);
};

// Function to calculate total amounts, including VAT (if active)
export const calculateTotals = (
  items: Item[],
  isTvaActive: boolean = false, // Defensive coding: default value for optional parameters
  isTvaExempt = false // Defensive coding: default value for optional parameters
): { totalHt: number; tva: number; totalWithVat: number } => {
  // Calculate total amount without VAT (memoization for performance)
  const totalHt = useMemo(() => calculateTotalAmountHT(items), [items]); // Memoization based on items dependency

  // Defensive coding: handle potential edge cases like empty items array (consider throwing errors or returning defaults)

  // Calculate VAT percentage based on whether VAT is active and exempt (memoization)
  const tvaPercentage = useMemo(
    () => (isTvaActive && !isTvaExempt ? 0.2 : 0),
    [isTvaActive, isTvaExempt]
  ); // Memoization based on isTvaActive and isTvaExempt dependencies

  // Calculate VAT amount based on totalHt and tvaPercentage (memoization)
  const tva = useMemo(() => totalHt * tvaPercentage, [totalHt, tvaPercentage]); // Memoization based on totalHt and tvaPercentage dependencies

  // Calculate total amount with or without VAT (memoization)
  const totalWithVat = useMemo(
    () => (isTvaActive && !isTvaExempt ? totalHt + tva : totalHt),
    [totalHt, tva, isTvaActive, isTvaExempt]
  ); // Memoization based on multiple dependencies

  // Return an object containing total amounts
  return { totalHt, tva, totalWithVat };
};

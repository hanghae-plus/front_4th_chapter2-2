import { useCartLocalStorage } from "./useCartLocalStorage";
import { useCartState } from "./useCartState";

const mode = import.meta.env.MODE;

export const useCart = () => {
  const localStorage = useCartLocalStorage();
  const memoryStore = useCartState();

  return mode === "advanced" ? localStorage : memoryStore;
};

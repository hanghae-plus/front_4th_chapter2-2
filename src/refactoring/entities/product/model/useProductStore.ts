import { create } from 'zustand';
import { Product } from '../../../shared/types/types';

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
}

const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { id: '1', quantity: 10, rate: 0.1 },
      { id: '2', quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ id: '1', quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ id: '1', quantity: 10, rate: 0.2 }],
  },
];

export const useProductStore = create<ProductStore>((set) => ({
  products: initialProducts,
  setProducts: (products: Product[]) => set({ products }),
  updateProduct: (product: Product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  addProduct: (newProduct: Product) =>
    set((state) => ({
      products: [...state.products, newProduct],
    })),
}));

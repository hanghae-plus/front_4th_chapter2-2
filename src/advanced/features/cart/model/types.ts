import { Product } from '@advanced/entities/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

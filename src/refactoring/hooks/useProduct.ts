import {useState} from 'react';
import {Product} from '../../types.ts';

export const useProducts = (initialProducts: Product[]) => {
    const [products, setProducts] = useState(initialProducts);

    return {products: products, updateProduct: () => undefined, addProduct: () => undefined};
};

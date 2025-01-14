import {useState} from 'react';
import {Discount, Product} from '../../types.ts';


/**
 export interface Product {
 id: string;
 name: string;
 price: number;
 stock: number;
 discounts: Discount[];
 }
 */

export const useProducts = (initialProducts: Product[]) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);


    const addProduct = (newProduct: Product) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
    }


    const _calculateNewProduct = (updatedProduct: Product) => {
        const newProducts = products.map((product) =>
            product.id === updatedProduct.id
                ? updatedProduct
                : product
        );
        return newProducts;
    }
    const updateProduct = (updatedProduct: Product) => {
        setProducts(_calculateNewProduct(updatedProduct));
    }

    return {products: products, updateProduct: updateProduct, addProduct: addProduct,};
};

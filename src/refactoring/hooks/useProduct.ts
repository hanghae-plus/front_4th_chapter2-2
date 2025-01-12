import { useState } from "react";
import { Coupon, Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
	const initialCoupons: Coupon[] = [
		{
			name: "5000원 할인 쿠폰",
			code: "AMOUNT5000",
			discountType: "amount",
			discountValue: 5000,
		},
		{
			name: "10% 할인 쿠폰",
			code: "PERCENT10",
			discountType: "percentage",
			discountValue: 10,
		},
	];

	const [products, setProducts] = useState<Product[]>(initialProducts);

	// 새로운 상품 추가 가능
	const updateProduct = (updatedProduct: Product) => {
		setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
	};

	const addProduct = (newProduct: Product) => {
		setProducts((prevProducts) => [...prevProducts, newProduct]);
	};
	return { products, updateProduct, addProduct };
};

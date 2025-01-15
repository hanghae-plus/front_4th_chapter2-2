import { useState } from "react";
import { Product, Discount } from "src/types";

interface AdminProps {
	products: Product[];
	onProductUpdate: (updatedProduct: Product) => void;
}

export const useAdmin = ({
	products,
	onProductUpdate,
}: AdminProps) => {
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

	const handleEditProduct = (product: Product) => {
		setEditingProduct({...product});
	};

	// 새로운 핸들러 함수 추가
	const handleProductNameUpdate = (productId: string, newName: string) => {
		if (editingProduct && editingProduct.id === productId) {
			const updatedProduct = { ...editingProduct, name: newName };
			setEditingProduct(updatedProduct);
		}
	};

	// 새로운 핸들러 함수 추가
	const handlePriceUpdate = (productId: string, newPrice: number) => {
		if (editingProduct && editingProduct.id === productId) {
			const updatedProduct = { ...editingProduct, price: newPrice };
			setEditingProduct(updatedProduct);
		}
	};

	// 수정 완료 핸들러 함수 추가
	const handleEditComplete = () => {
		if (editingProduct) {
			onProductUpdate(editingProduct);
			setEditingProduct(null);
		}
	};

	const handleStockUpdate = (productId: string, newStock: number) => {
		const updatedProduct = products.find(p => p.id === productId);
		if (updatedProduct) {
			const newProduct = { ...updatedProduct, stock: newStock };
			onProductUpdate(newProduct);
			setEditingProduct(newProduct);
		}
	};

	const handleAddDiscount = (productId: string) => {
		const updatedProduct = products.find(p => p.id === productId);
		if (updatedProduct && editingProduct) {
			const newProduct = {
				...updatedProduct,
				discounts: [...updatedProduct.discounts, newDiscount]
			};
			onProductUpdate(newProduct);
			setEditingProduct(newProduct);
			setNewDiscount({ quantity: 0, rate: 0 });
		}
	};

	const handleRemoveDiscount = (productId: string, index: number) => {
		const updatedProduct = products.find(p => p.id === productId);
		if (updatedProduct) {
			const newProduct = {
				...updatedProduct,
				discounts: updatedProduct.discounts.filter((_, i) => i !== index)
			};
			onProductUpdate(newProduct);
			setEditingProduct(newProduct);
		}
	};

	const handleQuantityChange = (value: string) => {
    setNewDiscount(prev => ({
      ...prev,
      quantity: parseInt(value) || 0
    }));
  };

  const handleRateChange = (value: string) => {
    setNewDiscount(prev => ({
      ...prev,
      rate: (parseInt(value) || 0) / 100
    }));
  };

	return {
		editingProduct,
		newDiscount,
		handleEditProduct,
		handleProductNameUpdate,
		handlePriceUpdate,
		handleEditComplete,
		handleStockUpdate,
		handleAddDiscount,
		handleRemoveDiscount,
		handleQuantityChange,
    handleRateChange,
	}
}
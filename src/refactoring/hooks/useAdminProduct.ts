import { useState } from 'react';
import { Product } from '../../types.ts';

export const useAdminProduct = (onProductAdd: (newProduct: Product) => void) => {
	const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

	const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: []
    });
    setShowNewProductForm(false);
  };

	const handleToggleProductForm = () => {
    setShowNewProductForm(prev => !prev);
  };
	
	const handleNameChange = (value: string) => {
		setNewProduct(prev => ({
			...prev,
			name: value
		}));
	};
 
	const handlePriceChange = (value: string) => {
		setNewProduct(prev => ({
			...prev,
			price: parseInt(value) || 0
		}));
	};

	const handleStockChange = (value: string) => {
		setNewProduct(prev => ({
			...prev,
			stock: parseInt(value) || 0
		}));
	};

	return { 
		showNewProductForm, 
		newProduct, 
		handleAddNewProduct, 
		handleToggleProductForm,
		handleNameChange,
		handlePriceChange,
		handleStockChange,
	};
}
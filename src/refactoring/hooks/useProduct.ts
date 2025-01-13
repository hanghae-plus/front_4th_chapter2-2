import { useCallback, useState } from 'react';
import { Product } from '../models/types/Product.ts';
import { Discount } from '../models/types/Discount.ts';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  }, []);

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
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
      addProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const product = { ...updatedProduct, stock: newStock };
      addProduct(product);
      setEditingProduct(product);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const product = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      addProduct(product);
      setEditingProduct(product);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const product = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      addProduct(product);
      setEditingProduct(product);
    }
  };

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    addProduct(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
  };

  const handleUpdateNewProductName = (name: string) => {
    setNewProduct((prev) => ({ ...prev, name }));
  };

  const handleUpdateNewProductPrice = (price: number) => {
    setNewProduct((prev) => ({ ...prev, price }));
  };

  const handleUpdateNewProductStock = (stock: number) => {
    setNewProduct((prev) => ({ ...prev, stock }));
  };

  const handleUpdateNewDiscountQuantity = (quantity: number) => {
    setNewDiscount((prev) => ({ ...prev, quantity }));
  };

  const handleUpdateNewDiscountRate = (rate: number) => {
    setNewDiscount((prev) => ({ ...prev, rate }));
  };

  return {
    products,
    newProduct,
    editingProduct,
    newDiscount,
    showNewProductForm,
    updateProduct,
    addProduct,
    handlers: {
      handleEditProduct,
      handleProductNameUpdate,
      handlePriceUpdate,
      handleEditComplete,
      handleStockUpdate,
      handleAddDiscount,
      handleRemoveDiscount,
      handleAddNewProduct,
      handleShowNewProductForm: () => setShowNewProductForm((prev) => !prev),
      handleUpdateNewProductName,
      handleUpdateNewProductPrice,
      handleUpdateNewProductStock,
      handleUpdateNewDiscountQuantity,
      handleUpdateNewDiscountRate,
    },
  };
};

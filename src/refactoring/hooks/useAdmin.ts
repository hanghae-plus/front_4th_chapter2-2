import { useState } from "react";
import { Discount, Product, Coupon } from "../../types.ts";

export const useAdmin = () => {
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
        stock: 0,
        discounts: []
    });
    const [newCoupon, setNewCoupon] = useState<Coupon>({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0
    });
    
    const handleAddCoupon = (onCouponAdd: (coupon: Coupon) => void) => {
        onCouponAdd(newCoupon);
        setNewCoupon({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0
        });
    };

    // handleEditProduct 함수 수정
    const handleEditProduct = (product: Product) => setEditingProduct({...product});

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
    const editComplete = (onProductUpdate: (product: Product) => void) => {
        if (editingProduct) {
            onProductUpdate(editingProduct);
            setEditingProduct(null);
        }
    };

    const handleStockUpdate = (products: Product[], productId: string, newStock: number, onProductUpdate: (product: Product) => void) => {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
            const newProduct = { ...updatedProduct, stock: newStock };
            onProductUpdate(newProduct);
            setEditingProduct(newProduct);
        }
    };

    const handleAddDiscount = (products: Product[], productId: string, onProductUpdate: (product: Product) => void) => {
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

    const handleRemoveDiscount = (products: Product[], productId: string, index: number, onProductUpdate: (product: Product) => void) => {
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

    const handleAddNewProduct = (onProductAdd: (product: Product) => void) => {
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

    const toggleProductAccordion = (productId: string) => {
        setOpenProductIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    return {
        newProduct,
        showNewProductForm,
        newDiscount,
        newCoupon,

        setNewProduct,
        setShowNewProductForm,
        setNewDiscount,
        setNewCoupon, 
        
        editingProduct,
        openProductIds,
        
        editComplete,
        handlePriceUpdate,
        handleStockUpdate,
        handleAddDiscount,
        handleEditProduct,
        handleAddNewProduct,
        handleProductNameUpdate,
        handleRemoveDiscount,
        handleAddCoupon,

        toggleProductAccordion
    }
}
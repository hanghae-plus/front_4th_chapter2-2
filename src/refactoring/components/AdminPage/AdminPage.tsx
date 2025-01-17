import { useState } from 'react';
import { Coupon, Discount, Product } from '../../../types.ts';
import { Container, Title, Button } from '../Styled.tsx';
import { Section } from '../Section.tsx';
import { InputLabel } from './InputLabel.tsx';
import { CouponManagement } from './CouponManagement.tsx';
import { ProductManagement } from './ProductManagement.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

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

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  };

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

  return (
    <Section
      className="container mx-auto p-4"
      title={<Title.Main>관리자 페이지</Title.Main>}
    >
      <Container.Grid>
        <Section
          title={<Title.Sub>상품 관리</Title.Sub>}
        >
          <ProductManagement
            handleAddNewProduct={handleAddNewProduct}
            setNewProduct={setNewProduct}
            setShowNewProductForm={setShowNewProductForm}
            showNewProductForm={showNewProductForm}
            newProduct={newProduct}
            productList={products}
            toggleProductAccordion={toggleProductAccordion}
            openProductIds={openProductIds}
            editingProduct={editingProduct}
            handleProductNameUpdate={handleProductNameUpdate}
            handlePriceUpdate={handlePriceUpdate}
            handleStockUpdate={handleStockUpdate}
            handleRemoveDiscount={handleRemoveDiscount}
            newDiscount={newDiscount}
            setNewDiscount={setNewDiscount}
            handleAddDiscount={handleAddDiscount}
            handleEditComplete={handleEditComplete}
            handleEditProduct={handleEditProduct}
          />
        </Section>

        <Section
          title={<Title.Sub>쿠폰관리</Title.Sub>}
        >
          <CouponManagement
            couponList={coupons}
            handleAddCoupon={handleAddCoupon}
            newCoupon={newCoupon}
            setNewCoupon={setNewCoupon}
          />
        </Section>
      </Container.Grid >
    </Section >
  );
};

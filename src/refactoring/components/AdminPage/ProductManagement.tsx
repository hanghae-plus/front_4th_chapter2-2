import { Discount, Product } from "../../../types";
import { Section } from "../Section";
import { Button, Title } from "../Styled";
import { InputLabel } from "./InputLabel";

interface ProductManagementProps {
  showNewProductForm: boolean;
  setShowNewProductForm: (v: boolean) => void;
  newProduct: Omit<Product, 'id'>;
  setNewProduct: (p: Omit<Product, 'id'>) => void;
  handleAddNewProduct: () => void;
  productList: Product[];
  toggleProductAccordion: (id: string) => void;
  openProductIds: Set<String>;
  editingProduct?: Product | null;
  handleProductNameUpdate: (productId: string, newName: string) => void;
  handlePriceUpdate: (productId: string, newPrice: number) => void;
  handleStockUpdate: (productId: string, newStock: number) => void;
  handleRemoveDiscount: (productId: string, index: number) => void;
  newDiscount: Discount;
  setNewDiscount: (d: Discount) => void;
  handleAddDiscount: (productId: string) => void;
  handleEditComplete: () => void;
  handleEditProduct: (p: Product) => void;
}

export const ProductManagement = ({
  setShowNewProductForm, showNewProductForm, newProduct, setNewProduct, handleAddNewProduct, productList, toggleProductAccordion, openProductIds, editingProduct, handleProductNameUpdate, handlePriceUpdate, handleStockUpdate, handleRemoveDiscount, newDiscount, setNewDiscount, handleAddDiscount, handleEditComplete, handleEditProduct }: ProductManagementProps) => {
  return (<>
    <Button.Green
      className="px-4 py-2 mb-4"
      onClick={() => setShowNewProductForm(!showNewProductForm)}
    >
      {showNewProductForm ? '취소' : '새 상품 추가'}
    </Button.Green>
    {
      showNewProductForm && (
        <Section
          className="bg-white p-4 rounded shadow mb-4"
          title={<Title.Container>새 상품 추가</Title.Container>}
        >
          <InputLabel
            id='productName'
            label='상품명'
            valueType="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <InputLabel
            id='productPrice'
            label='가격'
            valueType="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
          />
          <InputLabel
            id='productStock'
            label='재고'
            valueType="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          />
          <Button.Blue className='w-full' onClick={handleAddNewProduct}>추가</Button.Blue>
        </Section>
      )
    }
    <div className="space-y-2">
      {productList.map((product, index) => (
        <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
          <Button.FullLeftText
            data-testid="toggle-button"
            onClick={() => toggleProductAccordion(product.id)}
            className="w-full text-left font-semibold"
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </Button.FullLeftText>
          {openProductIds.has(product.id) && (
            <div className="mt-2">
              {editingProduct && editingProduct.id === product.id ? (
                <div>
                  <div className="mb-4">
                    <label className="block mb-1">상품명: </label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => handleProductNameUpdate(product.id, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">가격: </label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => handlePriceUpdate(product.id, parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">재고: </label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* 할인 정보 수정 부분 */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                    {editingProduct.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                        <Button.Red
                          className="px-2 py-1"
                          onClick={() => handleRemoveDiscount(product.id, index)}
                        >
                          삭제
                        </Button.Red>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="수량"
                        value={newDiscount.quantity}
                        onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
                        className="w-1/3 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="할인율 (%)"
                        value={newDiscount.rate * 100}
                        onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
                        className="w-1/3 p-2 border rounded"
                      />
                      <Button.Blue
                        onClick={() => handleAddDiscount(product.id)}
                        className="w-1/3"
                      >
                        할인 추가
                      </Button.Blue>
                    </div>
                  </div>
                  <button
                    onClick={handleEditComplete}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                  >
                    수정 완료
                  </button>
                </div>
              ) : (
                <div>
                  {product.discounts.map((discount, index) => (
                    <div key={index} className="mb-2">
                      <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                    </div>
                  ))}
                  <button
                    data-testid="modify-button"
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                  >
                    수정
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </>);
}
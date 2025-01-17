import { Product } from '../../../types';
import { useForm } from '../../hooks';
import { Input } from '../Input';

interface ProductFormProps {
  onRegisterProductForm: (newProduct: Product) => void;
}

function ProductForm({ onRegisterProductForm }: ProductFormProps) {
  const { formState, enterFormHandler } = useForm<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <Input label="상품명" id="productName" type="text" value={formState.name} onChange={e => enterFormHandler('name', e.target.value)} />

      <Input
        label="가격"
        id="productPrice"
        type="number"
        value={formState.price}
        onChange={e => enterFormHandler('price', parseInt(e.target.value))}
      />
      <Input
        label="재고"
        id="productStock"
        type="number"
        value={formState.stock}
        onChange={e => enterFormHandler('stock', parseInt(e.target.value))}
      />
      <button
        onClick={() => onRegisterProductForm({ ...formState, id: Date.now().toString() })}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </button>
    </div>
  );
}

export { ProductForm };

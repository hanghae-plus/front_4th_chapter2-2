import { Product, UpdateProduct } from '@advanced/entities/product';
import { http, HttpResponse } from 'msw';

let products: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

const getProducts = http.get('/api/products', () => {
  return HttpResponse.json({ products });
});

const addProducts = http.put<never, UpdateProduct>(
  '/api/products',
  async ({ request }) => {
    const newProduct = await request.json();

    const newProducts = [
      ...products,
      { id: Date.now().toString(), ...newProduct },
    ];

    products = newProducts;

    return HttpResponse.json({ id: Date.now().toString(), ...newProduct });
  },
);

interface UpdateProductParams {
  productId: string;
}

const updateProduct = http.patch<UpdateProductParams, UpdateProduct>(
  '/api/products/:productId',
  async ({ params, request }) => {
    const { productId } = params;
    const newProduct = await request.json();

    const existingProduct = products.find(
      (product) => product.id === productId,
    );

    if (!existingProduct) {
      return HttpResponse.json(
        {
          products: null,
          message: '없는 상품입니다.',
        },
        { status: 404 },
      );
    }

    const newProducts = products.map((product) =>
      product.id === productId ? { ...product, ...newProduct } : product,
    );
    products = newProducts;
    return HttpResponse.json({ ...existingProduct, ...newProduct });
  },
);

export const productHandlers = [getProducts, addProducts, updateProduct];

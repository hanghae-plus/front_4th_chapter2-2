import { http, HttpResponse } from 'msw';
import { Coupon, Product } from '../types.ts';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discountList: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

export const handler = [
  http.get('/products', async () => HttpResponse.json(mockProducts)),
  http.get('/coupons', async () => HttpResponse.json(mockCoupons)),
  http.put('/products/:id', async ({ request }) => {
    const body = (await request.json()) as Product;
    const newProduct = mockProducts.find((p) => p.id === body.id);
    return HttpResponse.json({ ...newProduct, ...body });
  }),
  http.post('/products', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json([...mockProducts, body]);
  }),
  http.post('/coupons', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json([...mockCoupons, body]);
  }),
];

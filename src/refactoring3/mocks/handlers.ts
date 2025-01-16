import { HttpResponse, http } from 'msw';
import { Coupon, Membership, Product } from '../../types';

let products: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
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

const memberships: Membership[] = [
  {
    name: '브론즈 등급 할인',
    code: 'BRONZE',
    discountType: 'percentage',
    discountValue: 3,
  },
  {
    name: '실버 등급 할인',
    code: 'SILVER',
    discountType: 'percentage',
    discountValue: 5,
  },
  {
    name: '골드 등급 할인',
    code: 'GOLD',
    discountType: 'percentage',
    discountValue: 7,
  },
  {
    name: 'VIP 등급 할인',
    code: 'VIP',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const coupons: Coupon[] = [
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

export const handlers = [
  // 상품
  http.get('/products', () => {
    return HttpResponse.json(products, {
      headers: { 'Content-Type': 'application/json' },
    });
  }),
  http.post('/products', async ({ request }) => {
    const data = (await request.json()) as Product;
    products.push(data);
    return HttpResponse.json({ id: data.id });
  }),
  http.patch('/products', async ({ request }) => {
    const data = (await request.json()) as Product;
    products = products.map((product) => (product.id === data.id ? data : product));
    return HttpResponse.json({ id: data.id });
  }),
  http.delete('/products/:id', async ({ params }) => {
    const id = params.id;
    const exist = products.some((product) => product.id === id);

    if (!exist) {
      return new HttpResponse(null, { status: 404 });
    }

    products = products.filter((product) => product.id !== id);

    return new HttpResponse(null, { status: 200 });
  }),

  // 맴버쉽
  http.get('/memberships', () => {
    return HttpResponse.json(memberships, {
      headers: { 'Content-Type': 'application/json' },
    });
  }),
  http.post('/memberships', async ({ request }) => {
    const data = (await request.json()) as Membership;
    memberships.push(data);
    return new HttpResponse(null, { status: 200 });
  }),

  // 쿠폰
  http.get('/coupons', () => {
    return HttpResponse.json(coupons, {
      headers: { 'Content-Type': 'application/json' },
    });
  }),
  http.post('/coupons', async ({ request }) => {
    const data = (await request.json()) as Membership;
    coupons.push(data);
    return new HttpResponse(null, { status: 200 });
  }),
];

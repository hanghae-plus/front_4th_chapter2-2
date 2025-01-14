import { http, HttpResponse } from "msw";
import { Product } from "../types";
import mockProducts from "./data/products.json";

const mockStorage: Map<string, object> = new Map();
mockStorage.set("/products", mockProducts);

export const handlers = [
  http.get<never, never, Product[]>("/products", () => {
    return HttpResponse.json(mockStorage.get("/products") as Product[]);
  }),
  http.put<never, Product[], Product[]>("/products", async ({ request }) => {
    mockStorage.set("/products", request.json());
    return HttpResponse.json(mockStorage.get("/products") as Product[]);
  }),
];

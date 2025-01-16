export type PathParams<T extends string> = {
  [K in T]: string;
};

export type ProductParams = PathParams<"id">;
export type CouponParams = PathParams<"code">;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

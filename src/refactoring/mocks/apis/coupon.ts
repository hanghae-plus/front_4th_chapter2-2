import { http } from "msw";
import { Coupon } from "../../models/cart/types";
import { CouponParams } from "../types";
import {
  HTTP_STATUS,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/error";
import { parseRequest } from "../utils/request";
import { storage } from "../utils/storage";
import { initialCoupons } from "../data/coupons";

// 초기 상태 로드
let coupons = storage.get("coupons") || initialCoupons;

export const couponHandlers = [
  // 쿠폰 목록 조회
  http.get("/api/coupons", () => {
    return createSuccessResponse(coupons);
  }),

  // 쿠폰 추가
  http.post("/api/coupons", async ({ request }) => {
    const newCoupon = await parseRequest<Coupon>(request);

    const existingCoupon = coupons.find(
      (coupon: Coupon) => coupon.code === newCoupon.code
    );
    if (existingCoupon) {
      return createErrorResponse(
        "이미 존재하는 쿠폰 코드입니다.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    coupons = [...coupons, newCoupon];
    storage.set("coupons", coupons);
    return createSuccessResponse(newCoupon, HTTP_STATUS.CREATED);
  }),

  // 쿠폰 수정
  http.put<CouponParams>("/api/coupons/:code", async ({ params, request }) => {
    const updatedCoupon = await parseRequest<Coupon>(request);

    const existingCoupon = coupons.find(
      (coupon: Coupon) => coupon.code === params.code
    );
    if (!existingCoupon) {
      return createErrorResponse("쿠폰을 찾을 수 없습니다.");
    }

    coupons = coupons.map((coupon: Coupon) =>
      coupon.code === params.code ? updatedCoupon : coupon
    );
    storage.set("coupons", coupons);
    return createSuccessResponse(updatedCoupon);
  }),

  // 쿠폰 삭제
  http.delete<CouponParams>("/api/coupons/:code", ({ params }) => {
    const existingCoupon = coupons.find(
      (coupon: Coupon) => coupon.code === params.code
    );
    if (!existingCoupon) {
      return createErrorResponse("쿠폰을 찾을 수 없습니다.");
    }

    coupons = coupons.filter((coupon: Coupon) => coupon.code !== params.code);
    storage.set("coupons", coupons);

    return new Response(null, {
      status: HTTP_STATUS.NO_CONTENT,
    });
  }),
];

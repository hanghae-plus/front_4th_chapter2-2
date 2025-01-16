import { http } from "msw";
import { Coupon } from "../../models/cart/types";
import { CouponParams } from "../types";
import {
  HTTP_STATUS,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/error";
import { parseRequest } from "../utils/request";
import { coupons, findCoupon, updateCoupons } from "../utils/coupon";

export const couponHandlers = [
  // 쿠폰 목록 조회
  http.get("/api/coupons", () => {
    return createSuccessResponse(coupons);
  }),

  // 쿠폰 추가
  http.post("/api/coupons", async ({ request }) => {
    const newCoupon = await parseRequest<Coupon>(request);

    if (findCoupon(newCoupon.code)) {
      return createErrorResponse(
        "이미 존재하는 쿠폰 코드입니다.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    updateCoupons([...coupons, newCoupon]);
    return createSuccessResponse(newCoupon, HTTP_STATUS.CREATED);
  }),

  // 쿠폰 수정
  http.put<CouponParams>("/api/coupons/:code", async ({ params, request }) => {
    const updatedCoupon = await parseRequest<Coupon>(request);

    if (!findCoupon(params.code)) {
      return createErrorResponse("쿠폰을 찾을 수 없습니다.");
    }

    updateCoupons(
      coupons.map((coupon) =>
        coupon.code === params.code ? updatedCoupon : coupon
      )
    );

    return createSuccessResponse(updatedCoupon);
  }),

  // 쿠폰 삭제
  http.delete<CouponParams>("/api/coupons/:code", ({ params }) => {
    if (!findCoupon(params.code)) {
      return createErrorResponse("쿠폰을 찾을 수 없습니다.");
    }

    updateCoupons(coupons.filter((coupon) => coupon.code !== params.code));
    return createSuccessResponse(null, HTTP_STATUS.NO_CONTENT);
  }),
];

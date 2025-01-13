# 항해플러스 5주차 과제 - 디자인 패턴과 함수형 프로그래밍
## 1. 기본 과제
### 요구사항
1. 장바구니 페이지 요구사항
   - 상품 목록
       - 상품명, 가격, 재고 수량 등을 표시
       - 각 상품의 할인 정보 표시
       - 재고가 없는 경우 품절 표시가 되며 장바구니 추가가 불가능
   - 장바구니
       - 장바구니 내 상품 수량 조절 가능
       - 각 상품의 이름, 가격, 수량과 적용된 할인율을 표시
           - 적용된 할인율 표시 (예: "10% 할인 적용")
       - 장바구니 내 모든 상품의 총액을 계산해야
   - 쿠폰 할인
       - 할인 쿠폰을 선택하면 적용하면 최종 결제 금액에 할인정보가 반영
   - 주문요약
       - 할인 전 총 금액
       - 총 할인 금액
       - 최종 결제 금액
2. 관리자 페이지 요구사항
    - 상품 관리
      - 상품 정보 (상품명, 가격, 재고, 할인율) 수정 가능
      - 새로운 상품 추가 가능
      - 상품 제거 가능
   - 할인 관리
       - 상품별 할인 정보 추가/수정/삭제 가능
       - 할인 조건 설정 (구매 수량에 따른 할인율)
   - 쿠폰 관리
       - 전체 상품에 적용 가능한 쿠폰 생성
       - 쿠폰 정보 입력 (이름, 코드, 할인 유형, 할인 값)
       - 할인 유형은 금액 또는 비율로 설정 가능
### 코드 개선 요구사항
1. hook 작성
   - useCart
   - useCoupon
   - useProduct
2. cart에 대한 계산 함수 작성
   - calculateItemTotal
   - getMaxApplicableDiscount
   - calculateCartTotal
   - updateCartItemQuantity
### 테스트 코드 통과하기
![img.png](public/img.png)

## 2. 심화 과제

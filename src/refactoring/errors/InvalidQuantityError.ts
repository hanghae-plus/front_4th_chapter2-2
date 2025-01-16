export default class InvalidQuantityError extends Error {
  constructor(quantity: unknown) {
    super(`유효하지 않은 수량입니다: ${quantity}. 수량은 0보다 작을 수 없습니다.`);
    this.name = 'InvalidQuantityError';
  }
}

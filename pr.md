## 과제 체크포인트

### 기본과제

- React의 hook 이해하기
- 함수형 프로그래밍에 대한 이해
- Component에서 비즈니스 로직을 분리하기
- 비즈니스 로직에서 특정 엔티티만 다루는 계산을 분리하기

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?

### 심화과제

- 뷰데이터와 엔티티데이터의 분리에 대한 이해
- 엔티티 -> 리파지토리 -> 유즈케이스 -> UI 계층에 대한 이해

- [x] Component에서 사용되는 Data가 아닌 로직들은 hook으로 옮겨졌나요?
- [x] 주어진 hook의 책임에 맞도록 코드가 분리가 되었나요?
- [x] 계산함수는 순수함수로 작성이 되었나요?
- [x] 특정 Entitiy만 다루는 함수는 분리되어 있나요?
- [x] 특정 Entitiy만 다루는 Component와 UI를 다루는 Component는 분리되어 있나요?
- [x] 데이터 흐름에 맞는 계층구조를 이루고 의존성이 맞게 작성이 되었나요?

## 과제 셀프회고

일단 시간적으로 부족한 환경이기 때문에 선택과 집중을 해야 했습니다.
코드를 보시면 아시겠지만 저의 리팩토링은 대부분 AdminPage에 집중해서 이루어 졌습니다.
아키텍처 같은 부분은 크게 고려치 못했고(fsd를 도입해 보려했으나) 기능단위 폴더 구조를 취했습니다.  
이 부분은 다음에 주차에 고민해봐야 할 것 같습니다. 차주는 아키텍처 관점의 접근과제라 들어서 이번주의 우선순위에서는 제외 했습니다.

- 접근 순서
  - 1. 기능의 모듈화 - 하나의 거대한 컴포넌트에서 도메인 로직으로 분류될 만한 것들을 전부 useProduct라는 hook으로 분리했습니다.
  - 2. 컴포넌트 분리 - 각 섹션별로 컴포넌트를 분리해 냈습니다. (쿠폰 관리 / 프로덕트 리스트 / 프로덕트 변경 폼 등)
  - 3. Cart와 Product의 공통 데이터인 Product를 관리하기 위해 ContextAPI를 도입했습니다.
  - 4. 계층 구조 정립
    - 이때 고려한 점은 useContext도메인 형태의 훅은 데이터 레이어, 즉 컴포넌트에서 직접 호출하지 않기로 했습니다.
      > 컴포넌트(뷰) 레이어 [예) ProductList.tsx]
      > -> 도메인 레이어 [예) useProduct]
      > -> 데이터 레이어 [예) useProductContext]
      > 순으로 의존성을 갖도록 했습니다.
  - 5. 테스트 코드 작성
  - 6. 테스트 코드 작성시 불편한 점을 토대로 개선\
    - 6.1. 순수 계산함수 분리

### 과제에서 좋았던 부분

과제에서 좋았던 점은 아주 적은 계산형태의 순수함수지만(discount) 테스트 코드 작성 i/o 가 명확한 로직의 필요성을 느끼고 분리해 내었다는 것 입니다.
useDiscount에서 내뱉는 데이터는 newDiscount 뿐으로, 실제 반영이라던지 사이드 이펙트 관련한 부분은 handler 함수 내부에서 전부 실시 되고 있었습니다.
이렇게 하다 보니 테스트 코드 작성중에 일관된 흐름이 아닌, 훅에 함수를 넘기는 과정속에 expect문을 작성하게 되었고, 테스트의 흐름이 부자연스럽다는 것을 느꼈습니다.

```typescript
test('할인 삭제 동작이 제대로 동작해야 한다.', () => {
  // 부수효과(사이드 이펙트)가 발생하는 함수 안에 expect를 넣어야 한다. 코드를 읽어내는 흐름이 자연스럽지 않다.
  const updateProduct = (product: Product) => {
    // 코드는 Product것을 가져왔지만 discount도 유사합니다!
    expect(product.id).toBe('p1');
    expect(product.discounts.length).toBe(0);
  };

  const { result } = renderHook(() =>
    useDiscount({
      products: anotherMockProducts,
      updateProduct,
      updateEditingProduct: vi.fn(),
    }),
  );

  act(() => {
    result.current.handlers.handleRemoveDiscount('p1', 0);
  });
});
```

그래서 실제로 discount 관련 로직을 구성하는 과정에서 실질적인 newDiscount를 업데이트 하기위해 필요한 로직을 분리하고, 이를 테스트 하는 방향으로 코드를 작성했습니다.

> 이미지 넣기

이렇게 해서 근본적으로 고차함수의 형태 속에서 expect하는 훅의 코드는 고치지 못했지만,
기존에 인자로 넘겨주는 함수 내부에서만 정상적인 값의 변화를 관찰 할 수 있었던 것이
계산 함수 내부에서 값의 변화를 관찰 할 수 있게 되었다는 것이 좋았습니다.

자세한 내용은 아래 커밋부터 넘겨 보시면 됩니다. ( 링크넣기)
fedb07528540dc39c11b32ee06e5d427de38e21b

### 과제를 하면서 새롭게 알게된 점

입 /출력이 정확한 함수가 필요한 이유
테스트 코드를 작성하면서 함수의 입출력이 명확해야 한다는 것을 느꼈습니다.
아니라면 특정시점을 테스트하기 위해 테스트 코드를 작성하는 것이 어려워집니다.

### 과제를 진행하면서 아직 애매하게 잘 모르겠다 하는 점, 혹은 뭔가 잘 안되서 아쉬운 것들

- 과제 중에, 다른 훅에서 훅으로 함수를 넘겨줘야 되는 경우가 있었습니다.
  이때 생각해 볼 수 있는 관점은 3가지가 있었는데요, 정답은 없을 것 같습니다만 안티패턴으로 여겨지는 것이 있을 것 같습니다.
  1. 훅을 통해 함수를 넘겨주는 것이 맞는가?
  ```typescript
  interface Arguments {
    products: Product[];
    updateProduct: (product: Product) => void;
    updateEditingProduct: (product: Product) => void;
  }
  const useDiscount = ({
    products,
    updateProduct, // 이부분! 1
    updateEditingProduct,
  }: Arguments) => {
    const [newDiscount, setNewDiscount] = useState<Discount>({
      quantity: 0,
      rate: 0,
    });
    const handleAddDiscount = (productId: string) => {
      const updatedProduct = products.find((p) => p.id === productId);
      if (updatedProduct) {
        const product = {
          ...updatedProduct,
          discounts: [...updatedProduct.discounts, newDiscount],
        };
        updateProduct(product); // 이부분! 2
        updateEditingProduct(product);
        setNewDiscount({ quantity: 0, rate: 0 });
      }
    };
    // 생략
    return {
      newDiscount,
      handlers: {
        handleAddDiscount,
      },
    };
  };
  ```

2. 훅에서 내보내는 함수의 인자로 넘겨주는 것이 맞는가?
   ```typescript
   const handleAddDiscount = (
     productId: string,
     onAdd: (product: Product) => void, //혹은 이렇게?
   ) => {
     const updatedProduct = products.find((p) => p.id === productId);
     if (updatedProduct) {
       const product = {
         ...updatedProduct,
         discounts: [...updatedProduct.discounts, newDiscount],
       };
       onAdd(product); // 이렇게 개별 핸들러 별로 고차함수로 처리?
       setNewDiscount({ quantity: 0, rate: 0 });
     }
   };
   ```
3. 훅안에 훅을 네스팅 해서 사용하는 것이 맞는가?

   ```typescript
   interface Arguments {
     products: Product[];
   }
   const useDiscount = ({ products }: Arguments) => {
     const [newDiscount, setNewDiscount] = useState<Discount>({
       quantity: 0,
       rate: 0,
     });
     const { updateProduct } = useProduct(); // 이부분! 1
     const { updateEditingProduct } = useEditProduct(); // 이부분! 2

     const handleAddDiscount = (productId: string) => {
       const updatedProduct = products.find((p) => p.id === productId);
       if (updatedProduct) {
         const product = {
           ...updatedProduct,
           discounts: [...updatedProduct.discounts, newDiscount],
         };
         updateProduct(product); // 이부분! 2
         updateEditingProduct(product);
         setNewDiscount({ quantity: 0, rate: 0 });
       }
     };
     // 생략
     return {
       newDiscount,
       handlers: {
         handleAddDiscount,
       },
     };
   };
   ```

   코치님의 답변이 궁금합니다~!

## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문

- 아쉽게도, 시간상 컴파운드 패턴 적용까지는 다가가지 못했습니다...
  - 간략하게 아이디어라도 좀 소개하자면, 앱 안에 다양한 폼이 존재합니다.
    [쿠폰 추가, 제품 추가, 제품 수정 등]
    이러한 폼들의 구성요소를 컴파운드 패턴으로 구성해 보려 했습니다..
    가장 흔한 적용 사례로 생각되는데 앱상에 빈번하게 발생하다 보니 적용해보고 싶었는데 아쉽네요! 그래서 간략하게 어떤 부분에 적용하고 싶었는지 소개 드립니다.

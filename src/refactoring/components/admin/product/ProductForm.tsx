import { Product } from "../../../../types";
import InputField from "../../common/InputField";
import Button from "../../common/Button";
import { useForm } from "../../../hooks";
import {
  createValidators,
  validateField,
} from "../../../utils/validator-utils";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
}

interface FieldValues {
  name: string;
  price: number;
  stock: number;
}

const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const form = useForm<FieldValues>({
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const validateFields = (addProduct: FieldValues) => {
    const validator = createValidators<FieldValues>();

    return Object.entries(addProduct).reduce(
      (acc: Record<string, string>, [key, value]) => {
        const errorMessage = validateField(value, [validator.required()]);
        if (errorMessage) {
          return {
            ...acc,
            [key]: errorMessage,
          };
        }
        return acc;
      },
      {} as Record<string, string>
    );
  };

  const handleAddProduct = (addProduct: FieldValues) => {
    const errors = validateFields(addProduct);

    if (Object.keys(errors).length > 0) {
      const messages = Object.entries(errors).map(
        ([key, value]) => `${key}값은 ${value}`
      );

      alert(messages);
      return;
    }

    const params = {
      ...addProduct,
      discounts: [],
    };
    onSubmit(params);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <form className="mb-2" onSubmit={form.handleSubmit(handleAddProduct)}>
        <InputField
          id="productName"
          label="상품명"
          {...form.register("name")}
        />
        <InputField
          id="productPrice"
          label="가격"
          type="number"
          {...form.register("price")}
        />
        <InputField
          id="productStock"
          label="재고"
          type="number"
          {...form.register("stock")}
        />
        <Button type="submit" className="w-full p-2">
          추가
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;

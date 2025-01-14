// useCart.ts
import {useState} from "react";
import {CartItem, Coupon, Product} from "../../types";
import {calculateCartTotal, updateCartItemQuantity} from "../models/cart";
import {createCartItem, findExistingItem, updateQuantity} from "../utils/cartOperations.ts";


export const useCart = () => {
    const [cart, _setCart] = useState<CartItem[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const calculateNewCart = (cart: CartItem[], product: Product): CartItem[] => {
        const existingItem = findExistingItem(cart, product);

        if (existingItem) {
            return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
        }

        return [...cart, createCartItem(product)];
    }

    const addToCart = (product: Product) => {
        _setCart((preCart) => calculateNewCart(preCart, product));
    };

    const removeFromCart = (productId: string) => {
        const newCart = cart.filter((cartItem) => cartItem.product.id !== productId);
        _setCart(newCart);
    };


    const applyCoupon = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
    };

    const calculateTotal = () => ({
        totalBeforeDiscount: 0,
        totalAfterDiscount: 0,
        totalDiscount: 0,
    });

    return {
        cart,
        addToCart,
        removeFromCart,
        applyCoupon,
        calculateTotal,
        selectedCoupon,
    };
};

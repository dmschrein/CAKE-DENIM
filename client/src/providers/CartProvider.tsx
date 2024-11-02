"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Product } from "../interfaces";

type cartItem = {
  product: Product;
  count: number;
};

interface CartContext {
  items: cartItem[];
  updateCart(product: Product, qty: number): void;
  removeFromCart(product: Product): void;
  countAllItems(): number;
  countTotalPrice(): string;
  clearCart(): void;
}

const updateCartInLS = (products: cartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(products));
};

const CartContext = createContext<CartContext>({
  items: [],
  updateCart() {},
  removeFromCart() {},
  clearCart() {},
  countAllItems() {
    return 0;
  },
  countTotalPrice() {
    return "0";
  },
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);

  const removeFromCart = (product: Product) => {
    const newProducts = cartItems.filter(
      (item) => item.product.productId !== product.productId,
    );
    setCartItems(newProducts);
    updateCartInLS(newProducts);
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartInLS([]);
  };

  const updateCart = (product: Product, qty: number) => {
    console.log("Adding to cart:", product);
    const finalCartItems = [...cartItems];
    const index = cartItems.findIndex(
      (item) => product.productId === item.product.productId,
    );

    if (index === -1) {
      finalCartItems.push({ count: qty, product });
    } else {
      finalCartItems[index].count += qty;
    }

    if (finalCartItems[index]?.count === 0) {
      removeFromCart(product);
    } else {
      setCartItems(finalCartItems);
      console.log("Cart items after update: ", finalCartItems);
      updateCartInLS(finalCartItems);
    }
  };

  // const removeFromCart = (product: Product, qty: number) => {
  //   const newProducts = cartItems.map((item) => {
  //     if (product.id === item.product.id) {
  //       item.count -= qty;
  //     }

  //     return item;
  //   });

  //   setCartItems(newProducts);
  // };

  const countAllItems = () => {
    return cartItems.reduce((total, cartItem) => total + cartItem.count, 0);
  };

  const countTotalPrice = () => {
    return cartItems
      .reduce((total, cartItem) => {
        if (cartItem.product && cartItem.product.price !== undefined) {
          return total + cartItem.product.price * cartItem.count;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const result = localStorage.getItem("cartItems");
    if (result !== null) {
      try {
        const storedCartItems = JSON.parse(result);
        const validCartItems = storedCartItems.filter(
          (items: cartItem) =>
            items.product && items.product.price !== undefined,
        );
        console.log("Filtered valid items from localStorage: ", validCartItems);
        setCartItems(validCartItems);
      } catch (error) {
        console.error("Error parsing cart items from localStorage: ", error);
        setCartItems([]); // Reset if parsing fails
      }
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        updateCart,
        removeFromCart,
        countTotalPrice,
        countAllItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);

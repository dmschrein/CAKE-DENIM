import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Product, Variant } from "../interfaces";

type cartItem = {
  product: Product;
  variant: {
    variantId: Variant["variantId"];
    color: Variant["color"];
    size: Variant["size"];
  };
  count: number;
};

interface CartContext {
  items: cartItem[];
  updateCart(
    product: Product,
    variant: Variant["variantId"],
    color: Variant["color"],
    size: Variant["size"],
    qty: number,
  ): void;
  removeFromCart(
    product: Product,
    variant: Variant["variantId"],
    color: Variant["color"],
    size: Variant["size"],
  ): void;
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

{
  /* 7. CartProvider manages the cart state, including adding, removing, updating items,
   * and clearning the cart. It uses localStorage to persist cart items across sessions.
   */
}
const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);

  const removeFromCart = (
    product: Product,
    variantId: Variant["variantId"],
    color: Variant["color"],
    size: Variant["size"],
  ) => {
    const productId = product.productId;
    const newProducts = cartItems.filter(
      (item) =>
        item.product.productId !== productId ||
        item.variant.variantId !== variantId ||
        item.variant.color !== color ||
        item.variant.size !== size,
    );
    setCartItems(newProducts);
    updateCartInLS(newProducts);
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartInLS([]);
  };

  const updateCart = (
    product: Product,
    variantId: Variant["variantId"],
    color: Variant["color"],
    size: Variant["size"],
    qty: number,
  ) => {
    console.log("updateCart called with:");
    console.log("  product:", product);
    console.log("  variantId:", variantId);
    console.log("  color:", color);
    console.log("  size:", size);
    console.log("  qty:", qty);

    if (!variantId || !color || !size) {
      console.warn("Missing variantId or color or size in updateCart function");
      return;
    }

    const finalCartItems = [...cartItems];
    console.log("finalCartItems: ", finalCartItems);
    const index = cartItems.findIndex(
      (item) =>
        item.product.productId === product.productId &&
        item.variant.variantId === variantId &&
        item.variant.color === color &&
        item.variant.size === size,
    );
    console.log("Items:", index);
    if (index === -1) {
      console.log("Adding new item to cart");
      finalCartItems.push({
        product,
        variant: { variantId, color, size },
        count: qty,
      });
    } else {
      console.log("Updating existing item in cart");
      finalCartItems[index].count += qty;
    }

    if (finalCartItems[index]?.count === 0) {
      removeFromCart(product, variantId, color, size);
    } else {
      setCartItems(finalCartItems);
      console.log("Cart items after update: ", finalCartItems);
      updateCartInLS(finalCartItems);
    }
  };

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
          (item: cartItem) => item.product && item.product.price !== undefined,
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

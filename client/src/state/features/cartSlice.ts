import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../../interfaces";
import { RootState } from "@/app/redux";

export interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const cartItem = state.cartItems.find(
        (el: CartItem) => el.product.productId === action.payload.productId
      );
      if (cartItem) cartItem.quantity++;
      else {
        state.cartItems.push({
          product: action.payload,
          quantity: 1,
        });
      }
    },
    // remove from cart
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const cartItem = state.cartItems.find(
        (el: CartItem) => el.product.productId === action.payload.productId
      );
      if (cartItem) {
        cartItem.quantity--;
        if (cartItem.quantity === 0) {
          state.cartItems = state.cartItems.filter(
            (el: CartItem) => el.product.productId !== action.payload.productId
          );
        }
      }
    },
  },
});

const cartItems = (state: RootState) => state.cart.cartItems;

export const productQtyInCartSelector = createSelector(
  [cartItems, (cartItems, productId: string) => productId],
  (cartItems, productId) =>
    cartItems.find((el: CartItem) => el.product.productId === productId)
      ?.quantity
);

export const totalCartItemsSelector = createSelector([cartItems], (cartItems) =>
  cartItems.reduce(
    (total: number, curr: CartItem) => (total += curr.quantity),
    0
  )
);

export const totalPriceSelector = createSelector([cartItems], (cartItems) =>
  cartItems.reduce(
    (total: number, curr: CartItem) =>
      (total += curr.quantity * curr.product.price),
    0
  )
);

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;

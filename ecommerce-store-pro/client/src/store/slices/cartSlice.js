import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  subtotal: 0
};

const calculateSubtotal = (items) =>
  items.reduce((acc, item) => acc + item.quantity * item.price, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = calculateSubtotal(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.subtotal = calculateSubtotal(state.items);
    },
    clearCart: () => initialState
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.subtotal = action.payload.subtotal || 0;
      state.itemCount = action.payload.itemCount || 0;
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.itemCount = 0;
      state.loading = false;
    },
  },
});

export const { setCart, setCartLoading, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

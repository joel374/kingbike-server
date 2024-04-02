import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import cartSlice from "./features/cartSlice";
import wishlistSlice from "./features/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
  },
});

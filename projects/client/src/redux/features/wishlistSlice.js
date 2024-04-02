import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myWishlist: [],
  totalWishlist: 0,
  totalPrice: 0,
  totalQuantity: 0,
  product: {
    product_name: "",
    stock: "",
    CategoryId: "",
    BrandCategoryId: "",
    price: "",
    description: "",
    sku: "",
    is_active: "",
    Images: [],
  },
};

const wishlistSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTotalWishlist: (state, action) => {
      state.totalWishlist = action.payload;
    },
  },
});

export const { setTotalWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
}

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingProduct = state.items.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity! += 1;
      } else {
        state.items.push({...product, quantity: 1});
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const product = state.items.find(item => item.id === productId);
      if (product) {
        product.quantity! += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      const product = state.items.find(item => item.id === productId);
      if (product && product.quantity! > 1) {
        product.quantity! -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== productId);
      }
    },
  },
});

export const {addToCart, incrementQuantity, decrementQuantity} =
  cartSlice.actions;
export default cartSlice.reducer;

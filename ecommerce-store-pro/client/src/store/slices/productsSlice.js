import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/axios';

const initialState = {
  items: [],
  categories: [],
  pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  currentProduct: null,
  status: 'idle',
  error: null
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to load products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Product not found');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Unable to load categories');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export const { clearCurrentProduct } = productsSlice.actions;

export default productsSlice.reducer;

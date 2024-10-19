import api from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getFilters = createAsyncThunk(
  "get filters",
  async (arg, { dispatch }) => {
    try {
      const response = await api.get(`/products/filter-options`);
      return response.data;
    } catch (error) {
      console.error("Error in get categories:", error);
      throw error;
    }
  }
);

export const getProducts = createAsyncThunk(
  "get Products",
  async (name, { dispatch }) => {
    try {
      const response = await api.get(`/products/collections/${name}`);
      return response.data;
    } catch (error) {
      console.error("Error in get filter Products:", error);
      throw error;
    }
  }
);

export const getProduct = createAsyncThunk(
  "get Product",
  async (id, { dispatch }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in get Product:", error);
      throw error;
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  "get Related Product",
  async (id, { dispatch }) => {
    try {
      const response = await api.get(`/products/${id}/related`);
      return response.data;
    } catch (error) {
      console.error("Error in get Product:", error);
      throw error;
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "get all Products",
  async (page, { dispatch }) => {
    try {
      const response = await api.get(`/products/?page=${page}&limit=8`);
      return {
        page,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in get All Products:", error);
      throw error;
    }
  }
);

export const getFilterdProducts = createAsyncThunk(
  "get Filterd Products",
  async ({ query, count, category, price }, { dispatch }) => {
    try {
      const response = await api.get(
        `/products?${query.toString()}&limit=8&page=${count}&minPrice=${
          price[0]
        }&maxPrice=${price[1]}&collection=${
          category == "products" ? "" : category
        }`
      );
      return {
        count,
        category,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in get All Products:", error);
      throw error;
    }
  }
);

export const getSearchProducts = createAsyncThunk(
  "get Search Products",
  async (inp, { dispatch }) => {
    try {
      const response = await api.get(`/products/?search=${inp}`);
      return response.data;
    } catch (error) {
      console.error("Error in get search Products:", error);
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: "Products",
  initialState: {
    Products: [],
    FilterdProducts: [],
    CategoriesProducts: [],
    RelatedProducts: [],
    SearchProducts: [],
    filters: {},
    Product: {},
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFilters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.filters = action.payload;
        state.error = null;
      })
      .addCase(getFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSearchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSearchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.SearchProducts = action.payload.products;
        state.error = null;
      })
      .addCase(getSearchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.Product = action.payload;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRelatedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.RelatedProducts = action.payload;
        state.error = null;
      })
      .addCase(getRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.CategoriesProducts = action.payload.products;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFilterdProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFilterdProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.FilterdProducts = action.payload.data.products;
        state.error = null;
      })
      .addCase(getFilterdProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.Products = [...action.payload.data.products];
        if (action.payload.page > 1) {
          state.Products = [...action.payload.data.products, ...state.Products];
        }
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;

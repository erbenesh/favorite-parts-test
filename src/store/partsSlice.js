import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchManufacturers, fetchOffers } from '../api/favoritApi';

export const searchManufacturers = createAsyncThunk(
  'parts/searchManufacturers',
  async (number, { rejectWithValue, signal }) => {
    try {
      const manufacturers = await fetchManufacturers(number.trim(), signal);
      return { number: number.trim(), manufacturers };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error;
      }
      return rejectWithValue(error.message);
    }
  },
);

export const loadOffers = createAsyncThunk(
  'parts/loadOffers',
  async ({ number, brand }, { rejectWithValue, signal }) => {
    try {
      const offers = await fetchOffers(number, brand, signal);
      return { brand, offers };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error;
      }
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  article: '',
  manufacturers: [],
  manufacturersStatus: 'idle', // idle | loading | succeeded | failed
  manufacturersError: null,
  selectedBrand: null,
  pendingBrand: null,
  offers: [],
  offersStatus: 'idle',
  offersError: null,
};

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    resetSearch(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchManufacturers.pending, (state) => {
        state.manufacturersStatus = 'loading';
        state.manufacturersError = null;
        // Не очищаем список сразу — меньше «моргания» при повторном поиске
        state.selectedBrand = null;
        state.pendingBrand = null;
        state.offers = [];
        state.offersStatus = 'idle';
        state.offersError = null;
      })
      .addCase(searchManufacturers.fulfilled, (state, action) => {
        state.manufacturersStatus = 'succeeded';
        state.article = action.payload.number;
        state.manufacturers = action.payload.manufacturers;
      })
      .addCase(searchManufacturers.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.manufacturersStatus = 'failed';
        state.manufacturersError = action.payload || 'Неизвестная ошибка';
        state.manufacturers = [];
      })
      .addCase(loadOffers.pending, (state, action) => {
        state.offersStatus = 'loading';
        state.offersError = null;
        state.pendingBrand = action.meta.arg.brand;
        state.selectedBrand = action.meta.arg.brand;
        // offers не очищаем — таблица остаётся до прихода новых данных
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.offersStatus = 'succeeded';
        state.selectedBrand = action.payload.brand;
        state.pendingBrand = null;
        state.offers = action.payload.offers;
      })
      .addCase(loadOffers.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.offersStatus = 'failed';
        state.offersError = action.payload || 'Неизвестная ошибка';
        state.pendingBrand = null;
      });
  },
});

export const { resetSearch } = partsSlice.actions;
export default partsSlice.reducer;

import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  modal: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ title, message, type = 'info' }) => ({
        payload: {
          id: nanoid(),
          title,
          message,
          type
        }
      })
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    openModal: (state, action) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    }
  }
});

export const { showToast, dismissToast, openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;

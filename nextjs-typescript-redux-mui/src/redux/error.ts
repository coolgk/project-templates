import { createSlice } from '@reduxjs/toolkit';

export interface AppError {
  errorMessage: string;
}

export const { actions, reducer } = createSlice({
  name: 'error',
  initialState: { errorMessage: '' } as AppError,
  reducers: {
    showAppError: (error: AppError, { payload }: { payload: string }) => {
      return { ...error, errorMessage: payload };
    },
    hideAppError: (error: AppError) => {
      return { ...error, errorMessage: '' };
    }
  }
});

export default reducer;

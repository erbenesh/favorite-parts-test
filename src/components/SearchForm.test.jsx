import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import partsReducer from '../store/partsSlice';
import SearchForm from './SearchForm';

function renderForm(preloaded) {
  const store = configureStore({
    reducer: { parts: partsReducer },
    preloadedState: preloaded,
  });

  return render(
    <Provider store={store}>
      <SearchForm />
    </Provider>,
  );
}

describe('SearchForm', () => {
  it('кнопка «Найти» неактивна при пустом артикуле', () => {
    renderForm();

    expect(screen.getByRole('button', { name: /найти/i })).toBeDisabled();
  });

  it('кнопка активируется после ввода артикула', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/артикул/i), '01089');

    expect(screen.getByRole('button', { name: /найти/i })).toBeEnabled();
  });
});

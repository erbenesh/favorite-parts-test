import { describe, expect, it } from 'vitest';
import reducer, { loadOffers, searchManufacturers } from './partsSlice';

const baseState = {
  article: '',
  manufacturers: [],
  manufacturersStatus: 'idle',
  manufacturersError: null,
  selectedBrand: null,
  pendingBrand: null,
  offers: [],
  offersStatus: 'idle',
  offersError: null,
};

describe('partsSlice', () => {
  it('при загрузке предложений не очищает уже показанную таблицу', () => {
    const prev = {
      ...baseState,
      article: '7160500039S',
      selectedBrand: 'MEYLE',
      offers: [
        {
          brand: 'MEYLE',
          name: 'Рычаги',
          number: '1',
          price: 100,
          count: 2,
          isAnalogue: false,
        },
      ],
      offersStatus: 'succeeded',
    };

    const next = reducer(
      prev,
      loadOffers.pending('req-1', { number: '7160500039S', brand: 'FEBI' }),
    );

    expect(next.offersStatus).toBe('loading');
    expect(next.pendingBrand).toBe('FEBI');
    expect(next.selectedBrand).toBe('FEBI');
    expect(next.offers).toHaveLength(1);
    expect(next.offers[0].brand).toBe('MEYLE');
  });

  it('после успешного поиска производителей сохраняет артикул и список', () => {
    const next = reducer(
      baseState,
      searchManufacturers.fulfilled(
        {
          number: '01089',
          manufacturers: [{ brand: 'ZEN', name: 'Бендикс', number: '01089' }],
        },
        'req-2',
        '01089',
      ),
    );

    expect(next.manufacturersStatus).toBe('succeeded');
    expect(next.article).toBe('01089');
    expect(next.manufacturers).toHaveLength(1);
  });

  it('при ошибке предложений ставит статус failed и текст ошибки', () => {
    const prev = {
      ...baseState,
      offers: [{ brand: 'MEYLE', name: 'X', number: '1', price: 1, count: 1 }],
      offersStatus: 'loading',
      pendingBrand: 'MEYLE',
    };

    const next = reducer(
      prev,
      loadOffers.rejected(
        null,
        'req-3',
        { number: '1', brand: 'MEYLE' },
        'Доступ запрещён (403). Проверьте API-ключ или права доступа.',
      ),
    );

    expect(next.offersStatus).toBe('failed');
    expect(next.offersError).toMatch(/403/);
    expect(next.pendingBrand).toBeNull();
    // старые данные остаются — пользователь видит таблицу + алерт
    expect(next.offers).toHaveLength(1);
  });
});

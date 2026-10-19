import { describe, expect, it } from 'vitest';
import {
  buildUrl,
  flattenOffers,
  messageForHttpStatus,
  pickManufacturers,
} from './favoritApi';

describe('buildUrl', () => {
  it('убирает слэш из бренда (NGK/NTK → NGKNTK), как в документации API', () => {
    const url = buildUrl({
      number: '01089',
      brand: 'NGK/NTK',
      analogues: true,
    });

    expect(url).toContain('brand=NGKNTK');
    expect(url).toContain('analogues=on');
    expect(url).not.toContain('NGK%2FNTK');
  });
});

describe('messageForHttpStatus', () => {
  it('даёт понятное сообщение для 403, а не сырой код', () => {
    expect(messageForHttpStatus(403)).toMatch(/403|запрещ/i);
  });

  it('для неизвестного кода возвращает общий текст со статусом', () => {
    expect(messageForHttpStatus(418)).toContain('418');
  });
});

describe('pickManufacturers', () => {
  it('отбрасывает пустой ответ API (артикул не найден)', () => {
    const goods = [
      {
        brand: '',
        name: '',
        number: '',
        price: 0,
        count: 0,
        warehouses: [],
      },
    ];

    expect(pickManufacturers(goods)).toEqual([]);
  });

  it('оставляет только позиции с брендом', () => {
    const goods = [
      { brand: 'MEYLE', name: 'Рычаг', number: '1', price: 100, count: 2 },
      { brand: '  ', name: 'Пустой', number: '2', price: 0, count: 0 },
      { brand: 'FEBI', name: 'Сайлентблок', number: '3', price: 50, count: 1 },
    ];

    expect(pickManufacturers(goods).map((g) => g.brand)).toEqual(['MEYLE', 'FEBI']);
  });
});

describe('flattenOffers', () => {
  it('склеивает основное предложение и вложенные аналоги', () => {
    const offers = flattenOffers([
      {
        brand: 'MEYLE',
        name: 'Рычаги',
        number: '7160500039/S',
        price: 1000,
        count: 5,
        analogues: [
          {
            brand: 'Mapco',
            name: 'Комплект рычагов',
            number: '53612/1',
            price: 800,
            count: 10,
          },
        ],
      },
    ]);

    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({ brand: 'MEYLE', isAnalogue: false });
    expect(offers[1]).toMatchObject({ brand: 'Mapco', isAnalogue: true });
  });

  it('игнорирует пустые объекты без brand/name', () => {
    expect(flattenOffers([{ brand: '', name: '', analogues: [] }])).toEqual([]);
  });
});

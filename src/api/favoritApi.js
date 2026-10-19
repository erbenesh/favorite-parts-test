const API_KEY = '00000000-0000-0000-0000-000000000001';

// Dev: Vite proxy. Prod: same-origin or configure your own proxy.
const BASE_URL = '/api/hsprice/';

function buildUrl({ number, brand, analogues }) {
  const params = new URLSearchParams({ key: API_KEY, number });

  if (brand) {
    // В документации бренды вроде "NGK/NTK" передаются без слэша: NGKNTK
    params.set('brand', brand.replace(/\//g, ''));
  }

  if (analogues) {
    params.set('analogues', 'on');
  }

  return `${BASE_URL}?${params.toString()}`;
}

const HTTP_ERROR_MESSAGES = {
  400: 'Некорректный запрос. Проверьте введённые данные.',
  401: 'Нет доступа: неверный или отсутствующий API-ключ.',
  403: 'Доступ запрещён (403). Проверьте API-ключ или права доступа.',
  404: 'Ресурс не найден (404).',
  429: 'Слишком много запросов. Попробуйте позже.',
  500: 'Внутренняя ошибка сервера. Попробуйте позже.',
  502: 'Сервер временно недоступен (502).',
  503: 'Сервис временно недоступен (503). Попробуйте позже.',
};

function messageForHttpStatus(status) {
  return HTTP_ERROR_MESSAGES[status] || `Ошибка сервера: ${status}`;
}

async function request(params, signal) {
  let response;

  try {
    response = await fetch(buildUrl(params), { signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error;
    }
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к сети.');
  }

  if (!response.ok) {
    let apiMessage = null;

    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        apiMessage = errorBody.error;
      }
    } catch {
      // тело ответа не JSON — используем сообщение по статус-коду
    }

    throw new Error(apiMessage || messageForHttpStatus(response.status));
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

/** Этап 1: список производителей по артикулу */
export async function fetchManufacturers(number, signal) {
  const data = await request({ number }, signal);
  const goods = Array.isArray(data.goods) ? data.goods : [];

  const manufacturers = goods.filter(
    (item) => item.brand && item.brand.trim() !== '',
  );

  if (manufacturers.length === 0) {
    throw new Error('По данному артикулу ничего не найдено.');
  }

  return manufacturers;
}

/**
 * Этап 2: предложения и аналоги.
 * Основная позиция + вложенный массив analogues.
 */
export async function fetchOffers(number, brand, signal) {
  const data = await request({ number, brand, analogues: true }, signal);
  const goods = Array.isArray(data.goods) ? data.goods : [];

  const offers = [];

  goods.forEach((item) => {
    if (!item.brand && !item.name) return;

    offers.push({
      brand: item.brand,
      name: item.name,
      number: item.number,
      price: item.price,
      count: item.count,
      isAnalogue: false,
    });

    if (Array.isArray(item.analogues)) {
      item.analogues.forEach((analogue) => {
        if (!analogue.brand && !analogue.name) return;

        offers.push({
          brand: analogue.brand,
          name: analogue.name,
          number: analogue.number,
          price: analogue.price,
          count: analogue.count,
          isAnalogue: true,
        });
      });
    }
  });

  if (offers.length === 0) {
    throw new Error('Предложения и аналоги не найдены.');
  }

  return offers;
}

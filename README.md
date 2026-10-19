# Favorit Parts — поиск запчастей

React + Redux приложение для поиска производителей и аналогов автозапчастей через API [Favorit Parts](http://api.favorit-parts.ru/hs/hsprice/).

## Запуск

```bash
npm install
npm run dev
```

Откройте адрес, который покажет Vite (обычно `http://localhost:5173`).

## Как пользоваться

1. Введите артикул (например `7160500039S`) и нажмите «Найти».
2. Выберите производителя из списка.
3. В таблице появятся предложение и аналоги: название, производитель, цена, остаток.

## Стек

- React (Vite)
- Redux Toolkit
- Bootstrap 5

Запросы к API идут через Vite-прокси (`/api` → `http://api.favorit-parts.ru/hs`), чтобы обойти CORS в разработке.

function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        <i className="bi bi-search" />
      </div>
      <h2 className="empty-state__title">Начните с артикула</h2>
      <p className="empty-state__text">
        Введите номер детали выше — покажем производителей, предложения и
        аналоги со складов Favorit Parts.
      </p>
      <ul className="empty-state__hints">
        <li>
          <i className="bi bi-upc-scan" aria-hidden="true" />
          <span>Этап 1 — список брендов по артикулу</span>
        </li>
        <li>
          <i className="bi bi-diagram-3" aria-hidden="true" />
          <span>Этап 2 — предложения и аналоги выбранного бренда</span>
        </li>
        <li>
          <i className="bi bi-box-seam" aria-hidden="true" />
          <span>Цена и остаток по каждой позиции</span>
        </li>
      </ul>
    </div>
  );
}

export default EmptyState;

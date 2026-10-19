import { useSelector } from 'react-redux';
import ErrorAlert from './ErrorAlert';
import SkeletonList from './SkeletonList';

function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(Number(price));
}

function OfferTypeBadge({ isAnalogue }) {
  return isAnalogue ? (
    <span className="badge text-bg-info">Аналог</span>
  ) : (
    <span className="badge text-bg-success">Предложение</span>
  );
}

function OffersTable() {
  const { selectedBrand, pendingBrand, offers, offersStatus, offersError } =
    useSelector((state) => state.parts);

  const isLoading = offersStatus === 'loading';
  const hasOffers = offers.length > 0;
  const brandLabel = pendingBrand || selectedBrand;

  if (offersStatus === 'idle') return null;

  // Первая загрузка — скелетон вместо «моргания» пустой таблицы
  if (isLoading && !hasOffers) {
    return (
      <section className="mt-3 mt-md-4">
        <h2 className="h5 mb-3">
          <i className="bi bi-table me-2" aria-hidden="true" />
          Предложения и аналоги
          {brandLabel ? (
            <span className="text-secondary fw-normal"> — {brandLabel}</span>
          ) : null}
        </h2>
        <SkeletonList rows={5} />
        <p className="text-secondary small mt-2 mb-0">
          Загружаем аналоги и предложения…
        </p>
      </section>
    );
  }

  return (
    <section className="mt-3 mt-md-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h2 className="h5 mb-0">
          <i className="bi bi-table me-2" aria-hidden="true" />
          Предложения и аналоги
          {brandLabel ? (
            <span className="text-secondary fw-normal"> — {brandLabel}</span>
          ) : null}
        </h2>
        {isLoading ? (
          <div className="d-flex align-items-center gap-2 text-secondary small" role="status">
            <div className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Обновление…</span>
          </div>
        ) : (
          <span className="text-secondary small">
            {offers.length}{' '}
            {offers.length === 1 ? 'позиция' : 'позиций'}
          </span>
        )}
      </div>

      {offersStatus === 'failed' ? <ErrorAlert message={offersError} /> : null}

      {hasOffers ? (
        <div className={`offers-panel position-relative ${isLoading ? 'is-loading' : ''}`}>
          {/* Мобильные карточки — CSS Grid */}
          <div className="d-md-none offers-cards">
            {offers.map((offer, index) => (
              <article
                key={`${offer.brand}-${offer.number}-card-${index}`}
                className="offer-card"
              >
                <div className="offer-card__top">
                  <div className="min-w-0">
                    <div className="fw-semibold text-break">{offer.name || '—'}</div>
                    <div className="small text-secondary text-break">
                      <i className="bi bi-building me-1" aria-hidden="true" />
                      {offer.brand || '—'}
                    </div>
                  </div>
                  <OfferTypeBadge isAnalogue={offer.isAnalogue} />
                </div>
                <div className="offer-card__grid">
                  <div className="offer-card__cell">
                    <div className="offer-card__label">
                      <i className="bi bi-upc" aria-hidden="true" />
                      Артикул
                    </div>
                    <div className="font-monospace text-break">{offer.number || '—'}</div>
                  </div>
                  <div className="offer-card__cell offer-card__cell--stock">
                    <div className="offer-card__label">
                      <i className="bi bi-box-seam" aria-hidden="true" />
                      Остаток
                    </div>
                    <div className="offer-card__stock-value">{offer.count ?? 0}</div>
                  </div>
                  <div className="offer-card__cell offer-card__price">
                    <div className="offer-card__label">
                      <i className="bi bi-tag" aria-hidden="true" />
                      Стоимость
                    </div>
                    <div className="fw-semibold fs-6">{formatPrice(offer.price)}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Таблица от md и выше */}
          <div className="d-none d-md-block table-responsive shadow-sm rounded">
            <table className="table table-hover table-striped align-middle mb-0 bg-white offers-table">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Название / Производитель</th>
                  <th scope="col">Артикул</th>
                  <th scope="col" className="text-end">
                    Стоимость
                  </th>
                  <th scope="col" className="text-end">
                    Остаток
                  </th>
                  <th scope="col">Тип</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer, index) => (
                  <tr key={`${offer.brand}-${offer.number}-row-${index}`}>
                    <td>
                      <div className="fw-semibold">{offer.name || '—'}</div>
                      <div className="small text-secondary">{offer.brand || '—'}</div>
                    </td>
                    <td className="font-monospace small">{offer.number || '—'}</td>
                    <td className="text-end fw-semibold text-nowrap">
                      {formatPrice(offer.price)}
                    </td>
                    <td className="text-end">{offer.count ?? 0}</td>
                    <td>
                      <OfferTypeBadge isAnalogue={offer.isAnalogue} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default OffersTable;

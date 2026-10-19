import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOffers } from '../store/partsSlice';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';

function ManufacturersList() {
  const dispatch = useDispatch();
  const offersRequestRef = useRef(null);
  const {
    article,
    manufacturers,
    manufacturersStatus,
    manufacturersError,
    selectedBrand,
    pendingBrand,
    offersStatus,
  } = useSelector((state) => state.parts);

  if (manufacturersStatus === 'idle') return null;

  const isLoadingList = manufacturersStatus === 'loading';
  const hasList = manufacturers.length > 0;
  const offersLoading = offersStatus === 'loading';

  if (isLoadingList && !hasList) {
    return <Loader text="Ищем производителей…" />;
  }

  if (manufacturersStatus === 'failed' && !hasList) {
    return <ErrorAlert message={manufacturersError} />;
  }

  const handleSelect = (brand) => {
    if (offersLoading && pendingBrand === brand) return;
    offersRequestRef.current?.abort();
    offersRequestRef.current = dispatch(loadOffers({ number: article, brand }));
  };

  return (
    <section className="mt-3 mt-md-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h2 className="h5 mb-0 text-break">
          <i className="bi bi-buildings me-2" aria-hidden="true" />
          Производители
          {article ? (
            <span className="text-secondary fw-normal"> — «{article}»</span>
          ) : null}
        </h2>
        {isLoadingList ? (
          <div className="d-flex align-items-center gap-2 text-secondary small" role="status">
            <div className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Обновление…</span>
          </div>
        ) : null}
      </div>

      {manufacturersStatus === 'failed' ? (
        <ErrorAlert message={manufacturersError} />
      ) : null}

      {hasList ? (
        <div
          className={`list-group shadow-sm manufacturers-list ${
            isLoadingList ? 'is-loading' : ''
          }`}
        >
          {manufacturers.map((item) => {
            const active = selectedBrand === item.brand;
            const pending = pendingBrand === item.brand && offersLoading;

            return (
              <button
                key={`${item.brand}-${item.number}-${item.goodsID || item.name}`}
                type="button"
                className={`list-group-item list-group-item-action manufacturer-item ${
                  active ? 'active' : ''
                }`}
                onClick={() => handleSelect(item.brand)}
                disabled={offersLoading && !pending}
              >
                <span className="manufacturer-item__main min-w-0">
                  <strong className="text-break">{item.brand}</strong>
                  {item.name ? (
                    <span
                      className={`manufacturer-item__name text-break ${
                        active ? 'opacity-75' : 'text-secondary'
                      }`}
                    >
                      {item.name}
                    </span>
                  ) : null}
                </span>
                <span className="manufacturer-item__meta flex-shrink-0">
                  {pending ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-label="Загрузка"
                    />
                  ) : active ? (
                    <span className="badge rounded-pill text-bg-light">выбран</span>
                  ) : (
                    <span className="badge rounded-pill text-bg-secondary">
                      ост. {item.count ?? 0}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default ManufacturersList;

import { useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchManufacturers } from '../store/partsSlice';

function SearchForm() {
  const dispatch = useDispatch();
  const searchRequestRef = useRef(null);
  const inputId = useId();
  const { manufacturersStatus } = useSelector((state) => state.parts);
  const [value, setValue] = useState('');

  const isLoading = manufacturersStatus === 'loading';

  const handleSubmit = (event) => {
    event.preventDefault();
    const article = value.trim();
    if (!article || isLoading) return;
    searchRequestRef.current?.abort();
    searchRequestRef.current = dispatch(searchManufacturers(article));
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm search-form">
      <div className="card-body p-3 p-md-4">
        <label htmlFor={inputId} className="form-label fw-semibold">
          Артикул запчасти
        </label>
        <div className="search-form__row">
          <div className="search-form__field">
            <i className="bi bi-search search-form__icon" aria-hidden="true" />
            <input
              id={inputId}
              type="text"
              className="form-control form-control-lg search-form__input"
              placeholder="Например: 7160500039S"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg search-form__submit"
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Поиск…
              </>
            ) : (
              <>
                <i className="bi bi-search me-2" aria-hidden="true" />
                Найти
              </>
            )}
          </button>
        </div>
        <div className="form-text mt-2">
          Введите номер детали — получите список производителей.
        </div>
      </div>
    </form>
  );
}

export default SearchForm;

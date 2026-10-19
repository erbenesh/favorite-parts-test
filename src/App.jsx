import SearchForm from './components/SearchForm';
import ManufacturersList from './components/ManufacturersList';
import OffersTable from './components/OffersTable';

function App() {
  return (
    <div className="app-shell min-vh-100">
      <header className="app-header py-3 py-md-4 mb-3 mb-md-4">
        <div className="container-fluid container-xl px-3 px-sm-4">
          <h1 className="app-title mb-1 text-white">Favorit Parts</h1>
          <p className="app-subtitle mb-0 text-white-50">
            Поиск производителей, предложений и аналогов автозапчастей
          </p>
        </div>
      </header>

      <main className="container-fluid container-xl px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <SearchForm />
            <ManufacturersList />
            <OffersTable />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

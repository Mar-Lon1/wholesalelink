import { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { suppliersAPI } from '../services/api';
import SupplierCard from '../components/SupplierCard';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      suppliersAPI
        .list({ search, location, page, limit: 20 })
        .then((r) => {
          setSuppliers(r.data.data.suppliers);
          setPagination(r.data.data.pagination);
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, location, page]);

  return (
    <div className="page-container flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Farmers & Produce Wholesalers</h1>
        <p className="text-slate-500 text-sm mt-1">Discover verified local farmers, cooperatives, and produce aggregators supplying Ghanaian food kitchens.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="supplier-search"
            className="input pl-9"
            placeholder="Search by farm or produce aggregator name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="relative sm:w-52">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="location-filter"
            className="input pl-9"
            placeholder="Filter by region (e.g. Techiman, Ada, Eastern)..."
            value={location}
            onChange={(e) => { setLocation(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : suppliers.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          <MapPin className="w-10 h-10 mx-auto mb-2" />
          <p>No farmers or produce aggregators found. Try a different search.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{pagination?.total} produce supplier{pagination?.total !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((s) => <SupplierCard key={s.id} supplier={s} />)}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button id="prev-supplier-page" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">Previous</button>
              <span className="text-sm text-slate-600">Page {page} of {pagination.totalPages}</span>
              <button id="next-supplier-page" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

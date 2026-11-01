import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export default function ProductCataloguePage({ onAddToCart }) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartError, setCartError] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    productsAPI
      .list({ search, category, sortBy, sortOrder, page, limit: 24 })
      .then((r) => {
        setProducts(r.data.data.products);
        setCategories(r.data.data.categories);
        setPagination(r.data.data.pagination);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category, sortBy, sortOrder, page]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  function handleAddToCart(product) {
    setCartError('');
    try {
      onAddToCart(product, product.minimumOrderQuantity);
    } catch (err) {
      setCartError(err.message);
    }
  }

  function clearFilters() {
    setSearch('');
    setCategory('');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
    setSearchParams({});
  }

  const hasFilters = search || category || sortBy !== 'name' || sortOrder !== 'asc';

  return (
    <div className="page-container flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fresh Farm Produce & Protein Catalogue</h1>
        <p className="text-slate-500 text-sm mt-1">Source harvest-fresh crops, vegetables, tubers, tropical fruits, poultry, butchery cuts, eggs, and dairy directly from local Ghanaian farms.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="product-search"
            className="input pl-9"
            placeholder="Search tomatoes, yam, chicken, goat meat, eggs, cow milk, pineapples, plantains..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          id="category-filter"
          className="input sm:w-52"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          id="sort-select"
          className="input sm:w-44"
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split(':');
            setSortBy(sb); setSortOrder(so); setPage(1);
          }}
        >
          <option value="name:asc">Name A–Z</option>
          <option value="name:desc">Name Z–A</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
        </select>

        {hasFilters && (
          <button id="clear-filters-btn" onClick={clearFilters} className="btn-ghost btn-sm gap-1 shrink-0 text-slate-500">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {cartError && <ErrorMessage message={cartError} />}

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          <Search className="w-10 h-10 mx-auto mb-2" />
          <p>No products found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            Showing {products.length} of {pagination?.total} product{pagination?.total !== 1 ? 's' : ''}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={user?.role === 'RETAILER' ? handleAddToCart : undefined}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                id="prev-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary btn-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                id="next-page-btn"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary btn-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

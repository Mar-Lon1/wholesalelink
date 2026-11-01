import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Search, Edit3, Power, Check } from 'lucide-react';
import { productsAPI } from '../services/api';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

export default function WholesalerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState('');

  const fetchMyProducts = useCallback(() => {
    setLoading(true);
    setError('');
    productsAPI
      .myListings({ page, limit: 20 })
      .then((r) => {
        setProducts(r.data.data.products);
        setPagination(r.data.data.pagination);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  async function handleToggleActive(product) {
    setActionId(product.id);
    setActionFeedback('');
    try {
      const nextActive = !product.active;
      await productsAPI.update(product.id, { active: nextActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: nextActive } : p))
      );
      setActionFeedback(`"${product.name}" is now ${nextActive ? 'active' : 'inactive'}.`);
      setTimeout(() => setActionFeedback(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Farm Produce & Harvest Listings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your harvest listings, crate/sack wholesale pricing, minimum order quantities for food vendors, and available stock.
          </p>
        </div>
        <Link
          to="/my-products/new"
          id="add-new-product-btn"
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Post New Harvest
        </Link>
      </div>

      {/* Search & Feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-my-products"
            className="input pl-9"
            placeholder="Search your produce listings by name or crop category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-slate-500">
          {products.length} harvest listing{products.length !== 1 ? 's' : ''} in your inventory
        </span>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Table / List */}
      {loading ? (
        <PageLoader />
      ) : filteredProducts.length === 0 ? (
        <div className="card p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <Package className="w-12 h-12 text-slate-300" />
          <div>
            <p className="font-semibold text-slate-700">No produce listings found</p>
            <p className="text-sm text-slate-500 mt-1">
              {search
                ? 'No harvest listings match your search query.'
                : 'You have not added any farm produce or crops to your catalogue yet.'}
            </p>
          </div>
          <Link to="/my-products/new" className="btn-primary btn-sm mt-2">
            <Plus className="w-4 h-4" /> Post Harvest Now
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-surface-border">
              <thead className="bg-surface-muted text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">MOQ</th>
                  <th className="px-4 py-3.5">Available Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border bg-white">
                {filteredProducts.map((p) => {
                  const isActioning = actionId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        {p.description && (
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="badge bg-slate-100 text-slate-700">{p.category}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-brand">
                        GH₵ {Number(p.price).toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal ml-1">/ {p.unit}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {p.minimumOrderQuantity} {p.unit}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-medium ${
                            p.availableQuantity > 10
                              ? 'text-green-700'
                              : p.availableQuantity > 0
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {p.availableQuantity} {p.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`badge ${
                            p.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/my-products/${p.id}/edit`}
                            id={`edit-product-${p.id}`}
                            className="btn-secondary btn-sm p-1.5 text-slate-600 hover:text-slate-900"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </Link>
                          <button
                            id={`toggle-product-${p.id}`}
                            disabled={isActioning}
                            onClick={() => handleToggleActive(p)}
                            className={`btn-sm px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                              p.active
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-700 hover:bg-green-50'
                            }`}
                            title={p.active ? 'Deactivate product' : 'Activate product'}
                          >
                            {isActioning ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <Power className="w-3 h-3" />
                                {p.active ? 'Deactivate' : 'Activate'}
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
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
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

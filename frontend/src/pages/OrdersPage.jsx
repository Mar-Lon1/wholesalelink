import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Filter } from 'lucide-react';
import { ordersAPI } from '../services/api';
import OrderCard from '../components/OrderCard';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED'];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    setError('');
    ordersAPI
      .list({ status: statusFilter || undefined, page, limit: 20 })
      .then((r) => {
        setOrders(r.data.data.orders);
        setPagination(r.data.data.pagination);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const isWholesaler = user?.role === 'WHOLESALER';

  return (
    <div className="page-container flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isWholesaler ? 'Food Vendor Produce Orders' : 'My Kitchen Produce Orders'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isWholesaler
            ? 'Manage incoming fresh produce orders placed by chop bars, restaurants, and caterers.'
            : 'Track your fresh farm harvest deliveries, pickup readiness, and 1-click reorders.'}
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          id="status-filter"
          className="input sm:w-52"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <span className="text-sm text-slate-500">{pagination?.total ?? '—'} orders</span>
      </div>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-2" />
          <p>No produce orders found.</p>
          {!isWholesaler && (
            <Link to="/products" className="btn-primary btn-sm mt-3 inline-flex">
              Browse Farm Produce
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            id="prev-orders-page"
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
            id="next-orders-page"
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

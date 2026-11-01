import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, productsAPI } from '../services/api';
import OrderCard from '../components/OrderCard';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function DashboardPage() {
  const { user } = useAuth();
  const isWholesaler = user?.role === 'WHOLESALER';

  return isWholesaler ? <WholesalerDashboard /> : <RetailerDashboard />;
}

function RetailerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersAPI.list({ limit: 5 })
      .then((r) => setOrders(r.data.data.orders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="page-container flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user?.profile?.businessName || 'Food Vendor'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Source farm-fresh vegetables, tubers, plantains, and cooking essentials directly from local Ghanaian farmers and market aggregators.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex flex-col gap-1">
          <p className="text-xs text-slate-500 font-medium">Total Kitchen Orders</p>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="card p-4 flex flex-col gap-1">
          <p className="text-xs text-slate-500 font-medium">Pending Delivery/Pickup</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="card p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500 font-medium">Quick action</p>
          <Link to="/products" id="browse-products-cta" className="btn-primary btn-sm mt-1 self-start">
            <Package className="w-4 h-4" /> Browse Fresh Produce
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Kitchen Produce Orders</h2>
          <Link to="/orders" className="text-sm text-brand font-medium hover:underline">View all</Link>
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : orders.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-2" />
            <p>No produce orders placed yet.</p>
            <Link to="/products" className="btn-primary btn-sm mt-3 inline-flex">Start Sourcing Harvests</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={
                  order.status === 'PENDING' && (
                    <Link to={`/orders/${order.id}`} className="btn-ghost btn-sm text-red-500">Cancel</Link>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WholesalerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      ordersAPI.list({ limit: 5 }),
      productsAPI.myListings({ limit: 5 }),
    ])
      .then(([ord, prod]) => {
        setOrders(ord.data.data.orders);
        setProducts(prod.data.data.products);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const activeProducts = products.filter((p) => p.active);

  return (
    <div className="page-container flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {user?.profile?.businessName || 'Farm Depot Dashboard'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your harvest listings, crate/sack stock, and incoming orders from Ghanaian food vendors.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500 font-medium">Active Harvest Listings</p>
          <p className="text-2xl font-bold text-brand">{activeProducts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 font-medium">New Vendor Orders</p>
          <p className="text-2xl font-bold text-amber-600">{pendingOrders.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500 font-medium">Total Orders Handled</p>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="card p-4 flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-medium">Quick action</p>
          <Link to="/my-products/new" id="add-product-cta" className="btn-primary btn-sm mt-1 self-start">
            <Plus className="w-4 h-4" /> Post New Harvest
          </Link>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Pending Vendor Orders</h2>
              <Link to="/orders" className="text-sm text-brand font-medium hover:underline">View all</Link>
            </div>
            {pendingOrders.length === 0 ? (
              <div className="card p-6 text-center text-slate-400 text-sm">No pending orders from food vendors.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingOrders.map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">My Harvest Listings</h2>
              <Link to="/my-products" className="text-sm text-brand font-medium hover:underline">View all</Link>
            </div>
            {products.length === 0 ? (
              <div className="card p-6 text-center text-slate-400 text-sm">
                No produce listed yet. <Link to="/my-products/new" className="text-brand font-medium">Post your first harvest</Link>.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {products.map((p) => (
                  <div key={p.id} className="card px-4 py-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">GH₵ {Number(p.price).toFixed(2)} / {p.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                      <Link to={`/my-products/${p.id}/edit`} className="btn-secondary btn-sm">Edit</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

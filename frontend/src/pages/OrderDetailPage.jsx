import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Truck, Store, Phone, MapPin,
  CheckCircle2, Clock, RefreshCw, XCircle, User
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'READY', label: 'Ready for Pickup / Dispatch' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchOrder = useCallback(() => {
    setLoading(true);
    setError('');
    ordersAPI
      .getById(id)
      .then((res) => setOrder(res.data.data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleStatusChange(nextStatus) {
    if (nextStatus === 'CANCELLED' && !window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setActionError('');
    setActionSuccess('');
    setActionLoading(true);
    try {
      const res = await ordersAPI.updateStatus(id, nextStatus);
      setOrder(res.data.data.order);
      setActionSuccess(`Order status updated to ${nextStatus.toLowerCase()}`);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReorder() {
    setActionError('');
    setActionSuccess('');
    setActionLoading(true);
    try {
      const res = await ordersAPI.reorder(id);
      const newOrder = res.data.data.order;
      setActionSuccess('Reorder placed successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/orders/${newOrder.id}`);
      }, 1000);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!order) return null;

  const isWholesaler = user?.role === 'WHOLESALER';
  const isRetailer = user?.role === 'RETAILER';
  const isCancelled = order.status === 'CANCELLED';

  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="page-container max-w-4xl flex flex-col gap-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="flex items-center gap-1 text-sm text-brand font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to orders
        </Link>
        <span className="text-xs text-slate-400 font-mono">Order ID: {order.id}</span>
      </div>

      {/* Header Card */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 font-mono">{order.reference}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Placed on {dateFormatted}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-2xl font-bold text-brand">GH₵ {Number(order.subtotal).toFixed(2)}</p>
          <p className="text-xs text-amber-600 font-medium">
            {order.paymentStatus === 'UNPAID' ? 'Payment pending (manual arrangement)' : order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Feedback Messages */}
      {actionError && <ErrorMessage message={actionError} />}
      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Order Status Stepper */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Order Progress</h2>
        {isCancelled ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800">
            <XCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">This order has been cancelled.</p>
              <p className="text-xs text-red-600 mt-0.5">
                No items will be prepared or dispatched. You can place a new order at any time.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                    isCurrent
                      ? 'border-brand bg-primary-50/70 text-brand-dark ring-2 ring-brand/20'
                      : isPast
                      ? 'border-green-200 bg-green-50/40 text-slate-700'
                      : 'border-surface-border text-slate-400 bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Step {idx + 1}</span>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-brand animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'font-bold text-brand-dark' : ''}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Status Transition Action Bar */}
        <div className="mt-6 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          {/* Wholesaler Controls */}
          {isWholesaler && !isCancelled && order.status !== 'COMPLETED' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-500 mr-1">Update Status:</span>

              {order.status === 'PENDING' && (
                <>
                  <button
                    id="order-confirm-btn"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('CONFIRMED')}
                    className="btn-primary btn-sm"
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Confirm Order'}
                  </button>
                  <button
                    id="order-cancel-btn"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('CANCELLED')}
                    className="btn-danger btn-sm"
                  >
                    Cancel Order
                  </button>
                </>
              )}

              {order.status === 'CONFIRMED' && (
                <>
                  <button
                    id="order-processing-btn"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('PROCESSING')}
                    className="btn-primary btn-sm"
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Start Processing'}
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('CANCELLED')}
                    className="btn-danger btn-sm"
                  >
                    Cancel Order
                  </button>
                </>
              )}

              {order.status === 'PROCESSING' && (
                <>
                  <button
                    id="order-ready-btn"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('READY')}
                    className="btn-primary btn-sm"
                  >
                    {actionLoading ? <Spinner size="sm" /> : 'Mark Ready for Pickup/Dispatch'}
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('CANCELLED')}
                    className="btn-danger btn-sm"
                  >
                    Cancel Order
                  </button>
                </>
              )}

              {order.status === 'READY' && (
                <button
                  id="order-complete-btn"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="btn-primary btn-sm"
                >
                  {actionLoading ? <Spinner size="sm" /> : 'Mark Completed'}
                </button>
              )}
            </div>
          )}

          {/* Retailer Controls */}
          {isRetailer && (
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              {order.status === 'PENDING' && (
                <button
                  id="retailer-cancel-order-btn"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange('CANCELLED')}
                  className="btn-danger btn-sm"
                >
                  {actionLoading ? <Spinner size="sm" /> : 'Cancel Order'}
                </button>
              )}

              <button
                id="reorder-btn"
                disabled={actionLoading}
                onClick={handleReorder}
                className="btn-secondary btn-sm flex items-center gap-1.5"
              >
                {actionLoading ? <Spinner size="sm" /> : <RefreshCw className="w-3.5 h-3.5 text-brand" />}
                Reorder These Items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Items Breakdown & Delivery / Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items List (2 cols) */}
        <div className="md:col-span-2 card p-6 flex flex-col gap-4">
          <h2 className="section-title text-base">Ordered Products</h2>
          <div className="divide-y divide-surface-border">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-500">
                    {item.quantity} {item.productUnit} × GH₵ {Number(item.priceAtOrder).toFixed(2)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-slate-900">
                    GH₵ {(Number(item.priceAtOrder) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-surface-border pt-4 mt-2 flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-600">Total Subtotal</span>
            <span className="text-xl font-bold text-brand">GH₵ {Number(order.subtotal).toFixed(2)}</span>
          </div>
        </div>

        {/* Sidebar: Fulfillment & Counterparty Details (1 col) */}
        <div className="flex flex-col gap-4">
          {/* Fulfillment Info */}
          <div className="card p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fulfillment</h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              {order.deliveryMethod === 'DELIVERY' ? (
                <>
                  <Truck className="w-4 h-4 text-brand" /> Early-Morning Kitchen Delivery
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 text-brand" /> Pickup at Farm Depot / Market Hub
                </>
              )}
            </div>

            {order.deliveryAddress && (
              <div className="text-xs text-slate-600 bg-surface-muted p-2.5 rounded-lg border border-surface-border">
                <p className="font-medium text-slate-700 mb-0.5">Kitchen Delivery Address:</p>
                <p>{order.deliveryAddress}</p>
              </div>
            )}

            {order.notes && (
              <div className="text-xs text-slate-600 bg-surface-muted p-2.5 rounded-lg border border-surface-border">
                <p className="font-medium text-slate-700 mb-0.5">Order Prep Notes:</p>
                <p>{order.notes}</p>
              </div>
            )}
          </div>

          {/* Counterparty Contact */}
          <div className="card p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isWholesaler ? 'Food Vendor Customer' : 'Farmer / Produce Hub Details'}
            </h3>

            {isWholesaler && order.retailer?.profile ? (
              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <p className="font-bold text-sm text-slate-900">{order.retailer.profile.businessName}</p>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {order.retailer.profile.contactName}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {order.retailer.profile.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {order.retailer.profile.location}</span>
              </div>
            ) : !isWholesaler ? (
              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <p className="text-slate-500">Fresh harvest supplied directly by verified farm aggregator.</p>
                <Link
                  to={`/suppliers/${order.wholesalerId}`}
                  className="btn-secondary btn-sm mt-1 text-center"
                >
                  View Farmer Profile
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Profile details unavailable</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

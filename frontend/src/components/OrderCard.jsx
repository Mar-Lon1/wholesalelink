import { Link } from 'react-router-dom';
import { Calendar, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order, actions }) {
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const date = new Date(order.createdAt).toLocaleDateString('en-GH', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="text-xs text-slate-500 font-mono">{order.reference}</p>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900">GH₵ {Number(order.subtotal).toFixed(2)}</p>
          <p className="text-xs text-amber-600 font-medium">{order.paymentStatus === 'UNPAID' ? 'Payment pending (manual)' : order.paymentStatus}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {itemCount} item{itemCount !== 1 ? 's' : ''}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {date}</span>
        <span>{order.deliveryMethod === 'DELIVERY' ? '🚚 Delivery' : '🏪 Pickup'}</span>
      </div>

      <div className="flex gap-2 mt-1 flex-wrap">
        <Link to={`/orders/${order.id}`} className="btn-secondary btn-sm">
          View Details
        </Link>
        {actions}
      </div>
    </div>
  );
}

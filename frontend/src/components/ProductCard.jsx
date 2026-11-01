import { MapPin, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const supplier = product.wholesaler?.profile;

  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <span className="badge bg-primary-50 text-primary-700 mt-1">{product.category}</span>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-brand">GH₵ {Number(product.price).toFixed(2)}</p>
          <p className="text-xs text-slate-500">/ {product.unit}</p>
        </div>
      </div>

      {supplier && (
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <Link
            to={`/suppliers/${product.wholesalerId}`}
            className="font-medium text-slate-700 hover:text-brand truncate"
          >
            {supplier.businessName}
          </Link>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {supplier.location}
          </span>
        </div>
      )}

      <div className="text-xs text-slate-500 flex flex-wrap gap-3">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3" /> Min: {product.minimumOrderQuantity} {product.unit}
        </span>
        <span className={product.availableQuantity > 10 ? 'text-green-600' : 'text-amber-600'}>
          {product.availableQuantity > 0 ? `${product.availableQuantity} in stock` : 'Out of stock'}
        </span>
      </div>

      <div className="flex gap-2 mt-auto">
        <Link to={`/products/${product.id}`} className="btn-secondary btn-sm flex-1 text-center">
          View Details
        </Link>
        {onAddToCart && (
          <button
            id={`add-to-cart-${product.id}`}
            onClick={() => onAddToCart(product)}
            disabled={product.availableQuantity === 0}
            className="btn-primary btn-sm flex-1"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

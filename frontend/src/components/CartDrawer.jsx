import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function CartDrawer({ cart, onUpdateQty, onRemove, onClear, onClose, onCheckout }) {
  const { items, total } = cart;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-sm bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand" /> Cart ({items.length})
          </h2>
          <button id="close-cart-btn" onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 px-6">
            <ShoppingCart className="w-12 h-12" />
            <p className="text-center">Your cart is empty. Browse products to add items.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-surface-border">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="px-4 py-3 flex gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500">GH₵ {Number(product.price).toFixed(2)} / {product.unit}</p>
                    <p className="text-xs text-brand font-medium mt-0.5">
                      GH₵ {(Number(product.price) * quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`decrease-qty-${product.id}`}
                      onClick={() => onUpdateQty(product.id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded border border-surface-border hover:bg-slate-100 text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      id={`increase-qty-${product.id}`}
                      onClick={() => onUpdateQty(product.id, quantity + 1)}
                      disabled={quantity >= product.availableQuantity}
                      className="w-7 h-7 flex items-center justify-center rounded border border-surface-border hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      id={`remove-item-${product.id}`}
                      onClick={() => onRemove(product.id)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-red-500 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-border px-4 py-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal (estimated)</span>
                <span className="font-bold text-slate-900">GH₵ {total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400">
                Final price and payment are confirmed with the supplier. This is a demo workflow — no real payment is processed.
              </p>
              <button id="checkout-btn" onClick={onCheckout} className="btn-primary w-full btn-lg">
                Place Order
              </button>
              <button id="clear-cart-btn" onClick={onClear} className="btn-ghost w-full text-sm text-slate-500">
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

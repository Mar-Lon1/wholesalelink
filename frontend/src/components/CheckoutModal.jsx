import { useState } from 'react';
import { X, ShoppingBag, Truck, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ordersAPI } from '../services/api';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

export default function CheckoutModal({ isOpen, onClose, cart, onOrderPlaced }) {
  const [deliveryMethod, setDeliveryMethod] = useState('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !cart || cart.items.length === 0) return null;

  const total = cart.items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (deliveryMethod === 'DELIVERY' && !deliveryAddress.trim()) {
      setError('Please provide a delivery address for your kitchen, restaurant, or chop bar.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        wholesalerId: cart.wholesalerId,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'DELIVERY' ? deliveryAddress.trim() : undefined,
        notes: notes.trim() || undefined,
        items: cart.items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await ordersAPI.create(payload);
      const createdOrder = res.data.data.order;
      onOrderPlaced(createdOrder);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-brand flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Review & Place Order</h2>
              <p className="text-xs text-slate-500">Confirm order details with supplier</p>
            </div>
          </div>
          <button
            id="close-checkout-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          <ErrorMessage message={error} />

          {/* Items Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Items</h3>
            <div className="bg-surface-muted rounded-xl p-3 border border-surface-border divide-y divide-surface-border max-h-48 overflow-y-auto">
              {cart.items.map(({ product, quantity }) => (
                <div key={product.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                  <div className="min-w-0 pr-3">
                    <p className="font-medium text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {quantity} {product.unit} × GH₵ {Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900 shrink-0">
                    GH₵ {(Number(product.price) * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 px-1 text-sm">
              <span className="text-slate-500">Estimated Total</span>
              <span className="text-lg font-bold text-brand">GH₵ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="label">Fulfillment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="method-pickup"
                onClick={() => setDeliveryMethod('PICKUP')}
                className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                  deliveryMethod === 'PICKUP'
                    ? 'border-brand bg-primary-50/60 text-brand-dark'
                    : 'border-surface-border hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand" />
                  <span className="font-semibold text-sm">Depot / Market Pickup</span>
                </div>
                <span className="text-xs text-slate-500">Collect directly from farmer depot or market stall</span>
              </button>

              <button
                type="button"
                id="method-delivery"
                onClick={() => setDeliveryMethod('DELIVERY')}
                className={`p-3 rounded-xl border-2 text-left flex flex-col gap-1 transition-all ${
                  deliveryMethod === 'DELIVERY'
                    ? 'border-brand bg-primary-50/60 text-brand-dark'
                    : 'border-surface-border hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand" />
                  <span className="font-semibold text-sm">Kitchen Delivery</span>
                </div>
                <span className="text-xs text-slate-500">Early-morning dispatch to your chop bar or restaurant kitchen</span>
              </button>
            </div>
          </div>

          {/* Delivery Address (if Delivery) */}
          {deliveryMethod === 'DELIVERY' && (
            <div>
              <label htmlFor="delivery-address" className="label">
                Kitchen / Chop Bar / Restaurant Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="delivery-address"
                required
                rows={2}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g., Ama's Chop Bar, Madina Zongo Junction near Total, Accra"
                className="input resize-none"
              />
            </div>
          )}

          {/* Order Notes */}
          <div>
            <label htmlFor="order-notes" className="label">
              Notes for Farmer / Produce Supplier <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="order-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Deliver before 6:30 AM fufu prep; prefer firm red tomatoes"
              className="input"
            />
          </div>

          {/* MVP Disclaimer Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Demo B2B Marketplace Workflow:</span> Payment is handled directly between you and the wholesaler (cash or MoMo upon pickup/delivery). No real card charges are made.
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              id="confirm-order-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit Order (GH₵ {total.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

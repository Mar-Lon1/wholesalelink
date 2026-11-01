import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Package, ArrowLeft } from 'lucide-react';
import { productsAPI } from '../services/api';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage({ onAddToCart, onCartOpen }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI
      .getById(id)
      .then((r) => {
        setProduct(r.data.data.product);
        setQty(r.data.data.product.minimumOrderQuantity);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    setAddError('');
    setAddSuccess(false);
    try {
      onAddToCart(product, qty);
      setAddSuccess(true);
    } catch (err) {
      setAddError(err.message);
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const supplier = product.wholesaler?.profile;

  return (
    <div className="page-container flex flex-col gap-6 max-w-4xl">
      <Link to="/products" className="flex items-center gap-1 text-sm text-brand hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Info */}
        <div className="card p-6 flex flex-col gap-4">
          <div>
            <span className="badge bg-primary-50 text-primary-700 mb-2">{product.category}</span>
            <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
            {product.description && <p className="text-sm text-slate-500 mt-2">{product.description}</p>}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-brand">GH₵ {Number(product.price).toFixed(2)}</span>
            <span className="text-slate-400 text-sm">/ {product.unit}</span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-slate-400">Min. order</dt><dd className="font-medium">{product.minimumOrderQuantity} {product.unit}</dd></div>
            <div><dt className="text-slate-400">Available</dt>
              <dd className={`font-medium ${product.availableQuantity > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                {product.availableQuantity} {product.unit}
              </dd>
            </div>
          </dl>

          {user?.role === 'RETAILER' && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <label htmlFor="product-qty" className="label shrink-0 mb-0">Quantity ({product.unit})</label>
                <input
                  id="product-qty"
                  type="number"
                  min={product.minimumOrderQuantity}
                  max={product.availableQuantity}
                  value={qty}
                  onChange={(e) => setQty(Math.max(product.minimumOrderQuantity, parseInt(e.target.value) || product.minimumOrderQuantity))}
                  className="input w-24"
                />
              </div>
              {addError && <ErrorMessage message={addError} />}
              {addSuccess && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-center justify-between">
                  <span>Added to cart!</span>
                  {onCartOpen && (
                    <button
                      type="button"
                      id="view-cart-from-detail"
                      onClick={onCartOpen}
                      className="font-semibold underline hover:text-green-900"
                    >
                      View cart →
                    </button>
                  )}
                </div>
              )}
              <button
                id="add-to-cart-detail-btn"
                onClick={handleAdd}
                disabled={product.availableQuantity === 0}
                className="btn-primary btn-lg"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Supplier Info */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-slate-800">Farmer / Produce Wholesaler</h2>
          <div className="flex flex-col gap-2">
            <p className="font-bold text-slate-900">{supplier?.businessName}</p>
            {supplier?.supplierType && <span className="badge bg-slate-100 text-slate-600">{supplier.supplierType}</span>}
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              {supplier?.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              {supplier?.phone}
            </div>
            {supplier?.description && (
              <p className="text-sm text-slate-500 mt-1">{supplier.description}</p>
            )}

            {/* Farm Fresh Guarantee Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 mt-1">
              <p className="font-semibold">🌾 Farm-To-Kitchen Sourcing Guarantee</p>
              <p className="text-emerald-700 mt-0.5">
                Freshly harvested batches with standard crate weights and wholesale discounts for food vendors, chop bars, and restaurants.
              </p>
            </div>

            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-1">
              Demo account — for demonstrating Ghanaian food vendor to produce farmer sourcing.
            </p>
          </div>
          <Link
            to={`/suppliers/${product.wholesalerId}`}
            id="view-supplier-btn"
            className="btn-secondary mt-auto"
          >
            <Package className="w-4 h-4" /> View all harvests from this supplier
          </Link>
        </div>
      </div>
    </div>
  );
}

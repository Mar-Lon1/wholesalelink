import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, Package } from 'lucide-react';
import { suppliersAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

export default function SupplierDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    suppliersAPI
      .getById(id)
      .then((r) => setSupplier(r.data.data.supplier))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart(product) {
    setCartError('');
    try {
      onAddToCart(product, product.minimumOrderQuantity);
    } catch (err) {
      setCartError(err.message);
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>;
  if (error) return <div className="page-container"><ErrorMessage message={error} /></div>;
  if (!supplier) return null;

  const profile = supplier.profile;

  return (
    <div className="page-container flex flex-col gap-6">
      <Link to="/suppliers" className="flex items-center gap-1 text-sm text-brand hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to farmers & hubs
      </Link>

      {/* Supplier Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{profile?.businessName}</h1>
            {profile?.supplierType && <span className="badge bg-slate-100 text-slate-600 self-start">{profile.supplierType}</span>}
            {profile?.description && <p className="text-sm text-slate-600 max-w-lg">{profile.description}</p>}
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mt-1 max-w-sm">
              Demo farmer / produce aggregator account for testing.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm shrink-0">
            <span className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-slate-400" /> {profile?.location}</span>
            <span className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> {profile?.phone}</span>
            <span className="flex items-center gap-2 text-slate-600"><Package className="w-4 h-4 text-slate-400" /> {supplier._count?.products ?? 0} active harvest listings</span>
          </div>
        </div>
      </div>

      {cartError && <ErrorMessage message={cartError} />}

      {/* Products */}
      <div>
        <h2 className="section-title mb-4">Fresh Farm Harvests from {profile?.businessName}</h2>
        {supplier.products?.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-2" />
            <p>No farm produce listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {supplier.products.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, wholesaler: { id: supplier.id, profile } }}
                onAddToCart={user?.role === 'RETAILER' ? handleAddToCart : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

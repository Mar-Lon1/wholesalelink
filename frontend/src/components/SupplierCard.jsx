import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';

export default function SupplierCard({ supplier }) {
  const profile = supplier.profile;
  return (
    <Link to={`/suppliers/${supplier.id}`} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow block">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{profile?.businessName}</h3>
          {profile?.supplierType && (
            <span className="badge bg-slate-100 text-slate-600 mt-1">{profile.supplierType}</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Package className="w-3.5 h-3.5" />
          {supplier._count?.products ?? 0} harvests
        </span>
      </div>

      {profile?.description && (
        <p className="text-sm text-slate-500 line-clamp-2">{profile.description}</p>
      )}

      <div className="flex items-center gap-1 text-xs text-slate-500 mt-auto">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        {profile?.location}
      </div>
    </Link>
  );
}

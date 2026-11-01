import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const ROLES = [
  { value: 'RETAILER', label: 'Food Vendor / Caterer', desc: 'Chop bar, restaurant, street food joint, or caterer buying produce' },
  { value: 'WHOLESALER', label: 'Farmer / Produce Wholesaler', desc: 'Farmer, cooperative, or market produce aggregator selling harvest' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', role: 'RETAILER',
    businessName: '', contactName: '', phone: '', location: '',
    supplierType: '', description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand text-white mb-4">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join WholesaleLink — Ghana&apos;s Fresh Farm Produce B2B Marketplace</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ErrorMessage message={error} />

            {/* Role Selection */}
            <div>
              <label className="label">I am registering as a</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    id={`role-${r.value.toLowerCase()}`}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      form.role === r.value
                        ? 'border-brand bg-primary-50'
                        : 'border-surface-border hover:border-brand/40'
                    }`}
                  >
                    <p className="font-semibold text-sm text-slate-900">{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="reg-email" className="label">Email address</label>
                <input id="reg-email" type="email" required className="input" value={form.email} onChange={set('email')} placeholder="you@business.com" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-password" className="label">Password <span className="text-slate-400 font-normal">(min. 8 characters)</span></label>
                <input id="reg-password" type="password" required minLength={8} className="input" value={form.password} onChange={set('password')} placeholder="••••••••" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-businessName" className="label">
                  {form.role === 'WHOLESALER' ? 'Farm / Aggregator Business Name' : 'Kitchen / Chop Bar / Restaurant Name'}
                </label>
                <input
                  id="reg-businessName"
                  type="text"
                  required
                  className="input"
                  value={form.businessName}
                  onChange={set('businessName')}
                  placeholder={form.role === 'WHOLESALER' ? 'e.g. Ada Vegetable & Tomato Cooperative' : "e.g. Mama Naa's Chop Bar & Kitchen"}
                />
              </div>

              <div>
                <label htmlFor="reg-contactName" className="label">Contact name</label>
                <input id="reg-contactName" type="text" required className="input" value={form.contactName} onChange={set('contactName')} placeholder="Full name" />
              </div>

              <div>
                <label htmlFor="reg-phone" className="label">Phone</label>
                <input id="reg-phone" type="tel" required className="input" value={form.phone} onChange={set('phone')} placeholder="024 XXX XXXX" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="reg-location" className="label">
                  {form.role === 'WHOLESALER' ? 'Farm / Market Depot Location' : 'Kitchen / Joint Location'}
                </label>
                <input
                  id="reg-location"
                  type="text"
                  required
                  className="input"
                  value={form.location}
                  onChange={set('location')}
                  placeholder={form.role === 'WHOLESALER' ? 'e.g. Agbogbloshie Market Hub / Techiman' : 'e.g. Madina Zongo Junction / Osu Oxford St'}
                />
              </div>

              {form.role === 'WHOLESALER' && (
                <div className="sm:col-span-2">
                  <label htmlFor="reg-supplierType" className="label">Produce specialty <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input id="reg-supplierType" type="text" className="input" value={form.supplierType} onChange={set('supplierType')} placeholder="e.g. Fresh Tomatoes, Peppers & Garden Eggs" />
                </div>
              )}

              <div className="sm:col-span-2">
                <label htmlFor="reg-description" className="label">Business description <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea id="reg-description" rows={2} className="input resize-none" value={form.description} onChange={set('description')} placeholder="Briefly describe what you cook or the farm produce you supply..." />
              </div>
            </div>

            <button id="register-submit" type="submit" className="btn-primary w-full btn-lg mt-1" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

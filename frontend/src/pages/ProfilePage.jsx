import { useEffect, useState } from 'react';
import { Building, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    location: '',
    supplierType: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    usersAPI
      .getMe()
      .then((res) => {
        const u = res.data.data.user;
        const p = u.profile || {};
        setForm({
          businessName: p.businessName || '',
          contactName: p.contactName || '',
          phone: p.phone || '',
          location: p.location || '',
          supplierType: p.supplierType || '',
          description: p.description || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await usersAPI.updateMe({
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        supplierType: form.supplierType.trim() || undefined,
        description: form.description.trim() || undefined,
      });

      const updatedProfile = res.data.data.profile;
      updateUser({ profile: updatedProfile });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>;

  const isWholesaler = user?.role === 'WHOLESALER';

  return (
    <div className="page-container max-w-2xl flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Business Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your business information and contact details.
        </p>
      </div>

      {/* Account Overview Card */}
      <div className="card p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{form.businessName || 'My Business'}</h2>
            <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge bg-white/20 text-white text-xs px-3 py-1 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> {isWholesaler ? 'Farmer / Produce Wholesaler' : 'Food Vendor / Kitchen Account'}
          </span>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorMessage message={error} />

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label htmlFor="businessName" className="label">
              {isWholesaler ? 'Farm / Aggregator Business Name' : 'Kitchen / Chop Bar / Restaurant Name'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              required
              minLength={2}
              className="input"
              value={form.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder={isWholesaler ? 'e.g. Techiman Tuber & Yam Cooperative' : "e.g. Mama Akosua's Traditional Chop Bar"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className="label">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contactName"
                required
                minLength={2}
                className="input"
                value={form.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="Full contact name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                required
                minLength={7}
                className="input"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="024 XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="label">
              {isWholesaler ? 'Farm Depot / Market Stall Location' : 'Kitchen / Chop Bar Location'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              required
              minLength={2}
              className="input"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={isWholesaler ? 'e.g. Agbogbloshie Market Produce Depot, Accra' : 'e.g. Madina Zongo Junction near Total, Accra'}
            />
          </div>

          {isWholesaler && (
            <div>
              <label htmlFor="supplierType" className="label">
                Crop & Produce Specialty <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="supplierType"
                className="input"
                value={form.supplierType}
                onChange={(e) => handleChange('supplierType', e.target.value)}
                placeholder="e.g. Fresh Tomatoes, Peppers, Yams, Plantains & Grains"
              />
            </div>
          )}

          <div>
            <label htmlFor="description" className="label">
              {isWholesaler ? 'Farm / Depot Description' : 'Kitchen / Joint Description'}{' '}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={
                isWholesaler
                  ? 'Describe your farm harvests, crate/sack availability, and delivery options...'
                  : 'Describe what your kitchen prepares (e.g. fufu, waakye, banku) and daily produce volume needs...'
              }
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="btn-primary min-w-[130px]"
            >
              {saving ? <Spinner size="sm" /> : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

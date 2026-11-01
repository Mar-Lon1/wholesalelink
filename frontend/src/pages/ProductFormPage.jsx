import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { productsAPI } from '../services/api';
import { PageLoader } from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const CATEGORY_PRESETS = [
  'Fresh Vegetables & Peppers',
  'Tubers & Roots',
  'Plantains & Bananas',
  'Leafy Greens & Fresh Herbs',
  'Fresh Fruits & Citrus',
  'Poultry & Farm-Dressed Birds',
  'Butchery & Fresh Meat',
  'Eggs & Fresh Farm Dairy',
  'Cooking Oils & Essentials',
  'Local Grains & Legumes',
  'Spices & Fresh Aromatics',
  'Other Farm Produce',
];

const UNIT_PRESETS = [
  'Wooden Crate',
  'Large Wooden Crate',
  'Crate of 30 Eggs',
  'Carton (300 Eggs)',
  'Carton (10 Birds)',
  'Batch (5 Birds)',
  '10kg Meat Carton',
  'Gallon (5L)',
  'Maxi Sack (100kg)',
  'Mini Sack (50kg)',
  'Large Bunch (Plantain)',
  '100 Tubers (Yam)',
  'Yellow Gallon (25L Oil)',
  'Basket / Rubber',
  'Bundle (50 Stems)',
  '50kg Bag',
  'Carton / Box',
  'kg',
];

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    category: CATEGORY_PRESETS[0],
    customCategory: '',
    unit: UNIT_PRESETS[0],
    customUnit: '',
    price: '',
    minimumOrderQuantity: 1,
    availableQuantity: 10,
    description: '',
    active: true,
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      productsAPI
        .getById(id)
        .then((res) => {
          const p = res.data.data.product;
          const isKnownCategory = CATEGORY_PRESETS.includes(p.category);
          const isKnownUnit = UNIT_PRESETS.includes(p.unit);

          setForm({
            name: p.name,
            category: isKnownCategory ? p.category : 'Other',
            customCategory: isKnownCategory ? '' : p.category,
            unit: isKnownUnit ? p.unit : 'Other',
            customUnit: isKnownUnit ? '' : p.unit,
            price: String(p.price),
            minimumOrderQuantity: p.minimumOrderQuantity,
            availableQuantity: p.availableQuantity,
            description: p.description || '',
            active: p.active,
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const resolvedCategory =
      form.category === 'Other' ? form.customCategory.trim() : form.category;
    const resolvedUnit =
      form.unit === 'Other' ? form.customUnit.trim() : form.unit;

    if (!resolvedCategory) {
      setError('Please provide a category for your product.');
      return;
    }
    if (!resolvedUnit) {
      setError('Please provide a unit of measurement.');
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    const moqNum = parseInt(form.minimumOrderQuantity);
    if (isNaN(moqNum) || moqNum < 1) {
      setError('Minimum order quantity must be at least 1.');
      return;
    }

    const stockNum = parseInt(form.availableQuantity);
    if (isNaN(stockNum) || stockNum < 0) {
      setError('Available quantity cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: resolvedCategory,
        unit: resolvedUnit,
        price: priceNum,
        minimumOrderQuantity: moqNum,
        availableQuantity: stockNum,
        description: form.description.trim() || undefined,
        active: form.active,
      };

      if (isEditing) {
        await productsAPI.update(id, payload);
      } else {
        await productsAPI.create(payload);
      }

      navigate('/my-products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-container"><PageLoader /></div>;

  return (
    <div className="page-container max-w-2xl flex flex-col gap-6">
      {/* Back Link */}
      <Link to="/my-products" className="flex items-center gap-1.5 text-sm text-brand font-medium hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? 'Edit Farm Produce Listing' : 'List New Farm Harvest / Produce'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isEditing
            ? 'Update your harvest details, crate/sack wholesale price, minimum kitchen order quantity, or stock.'
            : 'Post a new crop harvest or farm produce batch to be discovered by food vendors, chop bars, and restaurants across Ghana.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <ErrorMessage message={error} />

          {/* Product Name */}
          <div>
            <label htmlFor="product-name" className="label">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              required
              minLength={2}
              className="input"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Navrongo Large Red Tomatoes (Wooden Crate)"
            />
          </div>

          {/* Category & Custom Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-category" className="label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                className="input"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {form.category === 'Other' && (
              <div>
                <label htmlFor="custom-category" className="label">
                  Custom Category <span className="text-red-500">*</span>
                </label>
                <input
                  id="custom-category"
                  required
                  className="input"
                  value={form.customCategory}
                  onChange={(e) => handleChange('customCategory', e.target.value)}
                  placeholder="Specify category..."
                />
              </div>
            )}

            <div>
              <label htmlFor="product-unit" className="label">
                Unit of Sale <span className="text-red-500">*</span>
              </label>
              <select
                id="product-unit"
                className="input"
                value={form.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
              >
                {UNIT_PRESETS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            {form.unit === 'Other' && (
              <div>
                <label htmlFor="custom-unit" className="label">
                  Custom Unit <span className="text-red-500">*</span>
                </label>
                <input
                  id="custom-unit"
                  required
                  className="input"
                  value={form.customUnit}
                  onChange={(e) => handleChange('customUnit', e.target.value)}
                  placeholder="e.g. Tin, Bale, Bundle..."
                />
              </div>
            )}
          </div>

          {/* Price, MOQ, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="product-price" className="label">
                Unit Price (GH₵) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0.01"
                required
                className="input"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="product-moq" className="label">
                Min. Order Qty (MOQ) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-moq"
                type="number"
                min="1"
                required
                className="input"
                value={form.minimumOrderQuantity}
                onChange={(e) => handleChange('minimumOrderQuantity', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="product-stock" className="label">
                Available Stock <span className="text-red-500">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                required
                className="input"
                value={form.availableQuantity}
                onChange={(e) => handleChange('availableQuantity', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-desc" className="label">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="product-desc"
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g. Fresh farm harvest from Ada, harvested at 5am, firm and ideal for tomato stew and jollof prep..."
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              id="product-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="w-4 h-4 text-brand rounded border-surface-border focus:ring-brand"
            />
            <label htmlFor="product-active" className="text-sm font-medium text-slate-700 cursor-pointer">
              Active harvest listing (visible to food vendors in farm produce catalogue)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Link to="/my-products" className="btn-secondary">
              Cancel
            </Link>
            <button
              id="save-product-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary min-w-[130px]"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

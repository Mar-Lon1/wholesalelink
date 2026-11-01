import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Store, ShoppingCart, Package, ClipboardList, User,
  LogOut, Menu, X, LayoutDashboard, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cart, onCartOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const retailerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Kitchen Hub' },
    { to: '/products', icon: Package, label: 'Farm Produce' },
    { to: '/suppliers', icon: Building2, label: 'Farmers & Hubs' },
    { to: '/orders', icon: ClipboardList, label: 'Produce Orders' },
  ];

  const wholesalerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Farm Dashboard' },
    { to: '/my-products', icon: Package, label: 'Harvest Listings' },
    { to: '/orders', icon: ClipboardList, label: 'Vendor Orders' },
  ];

  const links = user?.role === 'WHOLESALER' ? wholesalerLinks : retailerLinks;
  const isActive = (to) => location.pathname.startsWith(to) && to !== '/';

  return (
    <header className="bg-brand shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg shrink-0">
            <Store className="w-6 h-6" />
            WholesaleLink
          </Link>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(to) ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user?.role === 'RETAILER' && (
              <button
                id="cart-btn"
                onClick={onCartOpen}
                className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart?.itemCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.profile?.businessName?.split(' ')[0] || 'Profile'}
                </Link>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="btn-ghost text-white/80 hover:text-white hover:bg-white/10 btn-sm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link to="/login" className="btn-ghost text-white/80 hover:text-white hover:bg-white/10 btn-sm">Sign In</Link>
                <Link to="/register" className="btn bg-white text-brand hover:bg-slate-100 btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {user
            ? links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(to) ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))
            : null}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10">
                <User className="w-4 h-4" /> Profile
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10">Sign In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-1">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

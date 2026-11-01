import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useCart } from './hooks/useCart';

// Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { PageLoader } from './components/Spinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductCataloguePage from './pages/ProductCataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import WholesalerProductsPage from './pages/WholesalerProductsPage';
import ProductFormPage from './pages/ProductFormPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicAuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><PageLoader /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQty, clearCart, itemCount, total } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function handleOpenCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function handleOrderPlaced(createdOrder) {
    clearCart();
    navigate(`/orders/${createdOrder.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted text-slate-800">
      <Navbar cart={{ ...cart, itemCount, total }} onCartOpen={() => setCartOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Public / Marketplace routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <LoginPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <RegisterPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/products"
            element={<ProductCataloguePage onAddToCart={addToCart} />}
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailPage
                onAddToCart={addToCart}
                onCartOpen={() => setCartOpen(true)}
              />
            }
          />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route
            path="/suppliers/:id"
            element={<SupplierDetailPage onAddToCart={addToCart} />}
          />

          {/* Authenticated routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Wholesaler-only product management routes */}
          <Route
            path="/my-products"
            element={
              <RoleRoute role="WHOLESALER">
                <WholesalerProductsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/my-products/new"
            element={
              <RoleRoute role="WHOLESALER">
                <ProductFormPage />
              </RoleRoute>
            }
          />
          <Route
            path="/my-products/:id/edit"
            element={
              <RoleRoute role="WHOLESALER">
                <ProductFormPage />
              </RoleRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="page-container py-16 text-center flex flex-col items-center gap-4">
                <span className="text-6xl font-extrabold text-slate-300">404</span>
                <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
                <p className="text-slate-500 max-w-sm text-sm">
                  The page you are looking for does not exist or may have moved.
                </p>
                <Link to="/" className="btn-primary btn-sm mt-2">
                  Return to Marketplace Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Cart Drawer for Retailers */}
      {cartOpen && (
        <CartDrawer
          cart={{ ...cart, itemCount, total }}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onClear={clearCart}
          onClose={() => setCartOpen(false)}
          onCheckout={handleOpenCheckout}
        />
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={{ ...cart, itemCount, total }}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-surface-border py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WholesaleLink © 2026 — Connecting Ghanaian Food Vendors & Farmers of Fresh Farm Produce</span>
          <span className="text-amber-700/80 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Demo Marketplace (Direct Kitchen & Farm Fulfillment)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

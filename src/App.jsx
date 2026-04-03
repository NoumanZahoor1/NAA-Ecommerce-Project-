import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/shop/CartDrawer';
// Keep Layout/Context imports eager
import ChatWidget from './components/features/ChatWidget';
import QuickViewModal from './components/common/QuickViewModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy Load Pages
const Home = lazy(() => import('./pages/public/Home'));
const Shop = lazy(() => import('./pages/public/Shop'));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail'));
const Login = lazy(() => import('./pages/public/Login'));
const Checkout = lazy(() => import('./pages/public/Checkout'));
const OrderSuccess = lazy(() => import('./pages/public/OrderSuccess'));
const UserDashboard = lazy(() => import('./pages/public/UserDashboard'));
const UserOrders = lazy(() => import('./pages/public/UserOrders'));
const Wishlist = lazy(() => import('./pages/public/Wishlist'));
const Support = lazy(() => import('./pages/public/Support'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogPost = lazy(() => import('./pages/public/BlogPost'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));

// Admin Pages Lazy
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/ProductList'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Loading Component
const PageLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimationControls();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        controls.start({ opacity: 0, scale: 1.1 });
        setTimeout(() => onLoadComplete?.(), 800);
      }, 500);
    }
  }, [progress, controls, onLoadComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={controls}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] overflow-hidden"
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
        />
      </div>

      {/* Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0, 0.15, 0],
              rotate: 360
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            className="absolute border border-white/10 rounded-full"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: 0
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut"
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with Shimmer Effect */}
        <div className="relative mb-8 overflow-hidden">
          {/* Shimmer Overlay */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut"
            }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          {/* Main Logo */}
          <motion.div
            initial={{ y: "110%", rotateX: 90 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2
            }}
            style={{ perspective: 1000 }}
          >
            <h1 className="text-[12rem] md:text-[16rem] font-black tracking-[-0.08em] leading-none relative">
              <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(255,255,255,0.3)]">
                NAA
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Subtitle with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center gap-6 mb-12"
        >
          <div className="flex gap-3 items-center">
            {['PREMIUM', '·', 'ATTIRE', '·', 'EST.', '2026'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: word === '·' ? 0.3 : 0.6, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }}
                className={`text-xs md:text-sm font-medium tracking-[0.3em] ${word === '·' ? 'text-white/30' : 'text-white/60'
                  } uppercase`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Decorative Line */}
          <div className="w-96 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent relative overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/3"
            />
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-80 md:w-96"
        >
          {/* Progress Percentage */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-light text-white/40 tracking-widest">LOADING</span>
            <motion.span
              className="text-xs font-light text-white/60 tabular-nums tracking-wider"
              key={Math.floor(progress)}
            >
              {Math.min(100, Math.floor(progress))}%
            </motion.span>
          </div>

          {/* Progress Track */}
          <div className="relative h-[2px] bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Glow Effect */}
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-white/50 via-white to-white/50 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            />

            {/* Animated Shimmer on Progress Bar */}
            <motion.div
              animate={{ x: ['-100%', '400%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </div>
        </motion.div>

        {/* Bottom Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-12 text-[10px] md:text-xs font-light tracking-[0.4em] text-white/30 uppercase"
        >
          Crafting Excellence
        </motion.p>
      </div>

      {/* Corner Accents */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((position) => (
        <motion.div
          key={position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`absolute ${position.includes('top') ? 'top-8' : 'bottom-8'
            } ${position.includes('left') ? 'left-8' : 'right-8'
            } w-12 h-12 border-white/20 ${position === 'top-left' ? 'border-t border-l' :
              position === 'top-right' ? 'border-t border-r' :
                position === 'bottom-left' ? 'border-b border-l' :
                  'border-b border-r'
            }`}
        />
      ))}
    </motion.div>
  );
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col border-r border-gray-800">
        <h1 className="text-2xl font-bold mb-10 tracking-wider">NAA ADMIN</h1>
        <nav className="flex flex-col gap-4 flex-1">
          <Link to="/admin/dashboard" className="hover:text-gray-300 font-medium transition-colors">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-gray-300 font-medium transition-colors">Products</Link>
          <Link to="/admin/orders" className="hover:text-gray-300 font-medium transition-colors">Orders</Link>
          <Link to="/admin/customers" className="hover:text-gray-300 font-medium transition-colors">Customers</Link>
          <Link to="/admin/settings" className="hover:text-gray-300 font-medium transition-colors">Settings</Link>
        </nav>
        <div className="mt-auto space-y-2 border-t border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors font-medium">
            Logout
          </button>
          <Link to="/" className="block text-sm text-gray-400 hover:text-white transition-colors">Back to Store</Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto dark:text-gray-100">{children}</main>
    </div>
  );
};

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

// Main Layout Wrapper for Storefront
const StoreLayout = ({ children }) => (
  <>
    <Navbar />
    <CartDrawer />
    {children}
    <ChatWidget />
    <Footer />
  </>
);

// Force remount of ProductDetail when ID changes
const ProductDetailWrapper = () => {
  const { id } = useParams();
  return <ProductDetail key={id} />;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Home /></StoreLayout>
          </Suspense>
        } />
        <Route path="/shop" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Shop /></StoreLayout>
          </Suspense>
        } />
        <Route path="/product/:id" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><ProductDetailWrapper /></StoreLayout>
          </Suspense>
        } />
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        } />
        <Route path="/forgot-password" element={
          <Suspense fallback={<PageLoader />}>
            <ForgotPassword />
          </Suspense>
        } />
        <Route path="/reset-password/:resetToken" element={
          <Suspense fallback={<PageLoader />}>
            <ResetPassword />
          </Suspense>
        } />
        <Route path="/checkout" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Checkout /></StoreLayout>
          </Suspense>
        } />
        <Route path="/order-success" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><OrderSuccess /></StoreLayout>
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><UserDashboard /></StoreLayout>
          </Suspense>
        } />
        <Route path="/orders" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><UserOrders /></StoreLayout>
          </Suspense>
        } />
        <Route path="/wishlist" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Wishlist /></StoreLayout>
          </Suspense>
        } />
        <Route path="/support/*" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Support /></StoreLayout>
          </Suspense>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><Blog /></StoreLayout>
          </Suspense>
        } />
        <Route path="/blog/:id" element={
          <Suspense fallback={<PageLoader />}>
            <StoreLayout><BlogPost /></StoreLayout>
          </Suspense>
        } />

        {/* Admin Routes - Protected */}
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
          </Suspense>
        } />
        <Route path="/admin/products" element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>
          </Suspense>
        } />
        <Route path="/admin/orders" element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>
          </Suspense>
        } />
        <Route path="/admin/customers" element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>
          </Suspense>
        } />
        <Route path="/admin/settings" element={
          <Suspense fallback={<PageLoader />}>
            <ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>
          </Suspense>
        } />
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ShopProvider>
          <AnimatePresence mode="wait">
            {isLoading && (
              <PageLoader key="loader" onLoadComplete={() => setIsLoading(false)} />
            )}
          </AnimatePresence>

          {!isLoading && (
            <div className="fade-in">
              <Router>
                <AppRoutes />
                <QuickViewModal />
              </Router>
            </div>
          )}
        </ShopProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

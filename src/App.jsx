import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Wishlist from './pages/Wishlist.jsx';
import PublicApi from './pages/PublicApi.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBooks from './pages/admin/AdminBooks.jsx';
import AdminTaxonomy from './pages/admin/AdminTaxonomy.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminApiKeys from './pages/admin/AdminApiKeys.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children, admin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:identifier" element={<BookDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/public-api" element={<PublicApi />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/wishlist" element={<Protected><Wishlist /></Protected>} />
          <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
          <Route path="/admin/books" element={<Protected admin><AdminBooks /></Protected>} />
          <Route path="/admin/taxonomy" element={<Protected admin><AdminTaxonomy /></Protected>} />
          <Route path="/admin/orders" element={<Protected admin><AdminOrders /></Protected>} />
          <Route path="/admin/api-keys" element={<Protected admin><AdminApiKeys /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container py-2">
        <Link className="navbar-brand brand fw-bold" to="/">
          <i className="bi bi-book-half me-2"></i>
          BookVerse
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/books">
                Katalog
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/recommendations">
                Rekomendasi
              </NavLink>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/wishlist">
                  Wishlist
                </NavLink>
              </li>
            )}

            {isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/orders">
                  Pesanan
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-sm btn-outline-dark dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Admin
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/admin/books">
                      Kelola Buku
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/admin/taxonomy">
                      Kategori/Penulis
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/admin/orders">
                      Pesanan
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/admin/api-keys">
                      API Keys
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-primary position-relative" to="/cart">
                    <i className="bi bi-bag me-1"></i>
                    Keranjang

                    {count > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="btn btn-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user?.name}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <span className="dropdown-item-text small text-muted">
                        {user?.email}
                      </span>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="btn btn-primary" to="/register">
                    Daftar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
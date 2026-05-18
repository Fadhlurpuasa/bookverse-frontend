import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@bookverse.test', password: 'admin12345' });
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) { setError(err.message); }
  }

  return (
    <section className="auth-section py-5">
      <div className="container">
        <div className="row justify-content-center"><div className="col-md-6 col-lg-5">
          <form className="auth-card" onSubmit={submit}>
            <h1 className="fw-bold h3">Login</h1><p className="text-muted">Masuk untuk belanja, wishlist, dan admin panel.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <label className="form-label">Email</label><input className="form-control mb-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="form-label">Password</label><input className="form-control mb-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Masuk...' : 'Login'}</button>
            <p className="text-center mt-3 mb-0">Belum punya akun? <Link to="/register">Daftar</Link></p>
          </form>
        </div></div>
      </div>
    </section>
  );
}

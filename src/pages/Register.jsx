import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try { await register(form); navigate('/'); }
    catch (err) { setError(err.message); }
  }

  return (
    <section className="auth-section py-5"><div className="container"><div className="row justify-content-center"><div className="col-md-6 col-lg-5">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="fw-bold h3">Buat Akun</h1><p className="text-muted">Daftar untuk menikmati fitur BookVerse.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <input className="form-control mb-3" name="name" placeholder="Nama lengkap" value={form.name} onChange={update} required />
        <input className="form-control mb-3" name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
        <input className="form-control mb-3" name="phone" placeholder="Nomor HP opsional" value={form.phone} onChange={update} />
        <input className="form-control mb-3" name="password" type="password" placeholder="Password minimal 6 karakter" value={form.password} onChange={update} required />
        <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Mendaftarkan...' : 'Daftar'}</button>
        <p className="text-center mt-3 mb-0">Sudah punya akun? <Link to="/login">Login</Link></p>
      </form>
    </div></div></div></section>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookApi, recApi } from '../api/endpoints';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import { unwrap } from '../utils/format';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [smartPicks, setSmartPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featured, rec] = await Promise.all([
          bookApi.list({ featured: true, limit: 6 }),
          recApi.recommend({ moods: ['tenang', 'semangat'], goals: ['belajar'], budgetMax: 150000, limit: 3 })
        ]);
        setBooks(unwrap(featured));
        setSmartPicks(unwrap(rec));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge rounded-pill text-bg-light border mb-3">Toko Buku + AI-like Recommendation</span>
              <h1 className="display-4 fw-bold lh-sm">Temukan buku yang pas dengan mood, tujuan, dan budget kamu.</h1>
              <p className="lead text-muted mt-3">BookVerse membantu pembaca memilih buku lewat katalog pintar, rekomendasi personal, wishlist, keranjang, checkout, dan public API untuk developer lain.</p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Link className="btn btn-primary btn-lg" to="/recommendations"><i className="bi bi-stars me-2"></i>Cari Rekomendasi</Link>
                <Link className="btn btn-outline-dark btn-lg" to="/books">Lihat Katalog</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-card shadow-lg">
                <div className="hero-orbit orbit-1"></div>
                <div className="hero-orbit orbit-2"></div>
                <i className="bi bi-book-half hero-icon"></i>
                <h3 className="fw-bold mt-4">Book Match Engine</h3>
                <p className="text-muted mb-0">Rekomendasi berdasarkan mood, genre, keyword, tujuan baca, format, dan rentang harga.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-3 mb-4">
          <div className="col-md-4"><Feature icon="bi bi-magic" title="Rekomendasi unik" text="Cari buku berdasarkan keinginan, bukan hanya judul." /></div>
          <div className="col-md-4"><Feature icon="bi bi-code-slash" title="Public API" text="Developer lain bisa pakai API BookVerse." /></div>
          <div className="col-md-4"><Feature icon="bi bi-shield-lock" title="Admin panel" text="Kelola buku, kategori, pesanan, dan API key." /></div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0">Buku Pilihan</h2>
          <Link to="/books" className="btn btn-sm btn-outline-primary">Lihat semua</Link>
        </div>
        {loading ? <Loading /> : <div className="row g-4">{books.map((book) => <div className="col-sm-6 col-lg-4" key={book.id}><BookCard book={book} /></div>)}</div>}

        {smartPicks.length > 0 && (
          <div className="recommend-strip mt-5 p-4 rounded-4">
            <h3 className="fw-bold mb-3"><i className="bi bi-lightbulb me-2"></i>Smart Picks Hari Ini</h3>
            <div className="row g-3">
              {smartPicks.map((book) => (
                <div className="col-md-4" key={book.id}>
                  <div className="p-3 bg-white rounded-4 h-100 border">
                    <h6 className="fw-bold">{book.title}</h6>
                    <p className="small text-muted mb-1">Score: {book.matchScore}</p>
                    <p className="small mb-0">{book.recommendationReason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Feature({ icon, title, text }) {
  return <div className="feature-card"><i className={`${icon} fs-3 text-primary`}></i><h5 className="fw-bold mt-3">{title}</h5><p className="text-muted mb-0">{text}</p></div>;
}

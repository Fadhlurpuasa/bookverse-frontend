import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookApi, wishlistApi } from '../api/endpoints';
import Loading from '../components/Loading';
import { getBookImage, rupiah, unwrap } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import api from '../api/client';

export default function BookDetail() {
  const { identifier } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  async function load() {
    setLoading(true);
    try {
      const res = await bookApi.detail(identifier);
      const data = unwrap(res);
      setBook(data);
      const rev = await api.get(`/reviews/book/${data.id}`);
      setReviews(unwrap(rev));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [identifier]);

  async function submitReview(e) {
    e.preventDefault();
    if (!isLoggedIn) return alert('Login dulu untuk review.');
    await api.put(`/reviews/book/${book.id}`, { rating: Number(rating), comment });
    setComment('');
    load();
  }

  if (loading) return <Loading />;
  if (!book) return <section className="container py-5"><h3>Buku tidak ditemukan.</h3></section>;

  const authors = book.authors?.map((a) => a.author?.name).filter(Boolean).join(', ') || '-';
  const categories = book.categories?.map((c) => c.category?.name).filter(Boolean).join(', ') || '-';
  const finalPrice = Math.round(book.price - (book.price * (book.discountPercent || 0) / 100));

  return (
    <section className="container py-5">
      <Link to="/books" className="text-decoration-none"><i className="bi bi-arrow-left"></i> Kembali ke katalog</Link>
      <div className="row g-5 mt-2">
        <div className="col-md-5 col-lg-4">
          <img src={getBookImage(book)} alt={book.title} className="img-fluid detail-cover shadow" />
        </div>
        <div className="col-md-7 col-lg-8">
          <div className="d-flex flex-wrap gap-2 mb-3"><span className="badge text-bg-primary">{book.format}</span>{book.isFeatured && <span className="badge text-bg-warning">Featured</span>}<span className="badge text-bg-light border">Stok {book.stock}</span></div>
          <h1 className="fw-bold">{book.title}</h1>
          <p className="text-muted">Oleh {authors}</p>
          <div className="h3 fw-bold text-primary mb-3">{rupiah(finalPrice)}</div>
          <p className="lead">{book.description}</p>
          {book.synopsis && <p>{book.synopsis}</p>}
          <div className="row g-3 my-3">
            <Info label="Kategori" value={categories} />
            <Info label="Penerbit" value={book.publisher?.name || '-'} />
            <Info label="Bahasa" value={book.language || '-'} />
            <Info label="Halaman" value={book.pageCount || '-'} />
            <Info label="Tahun" value={book.publishYear || '-'} />
            <Info label="Rating" value={`${book.avgRating || 0} / 5 (${book.reviewCount || 0} review)`} />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={() => isLoggedIn ? addToCart(book.id, 1).then(() => alert('Masuk keranjang.')) : alert('Login dulu.') }><i className="bi bi-bag-plus me-2"></i>Tambah Keranjang</button>
            <button className="btn btn-outline-danger btn-lg" onClick={() => isLoggedIn ? wishlistApi.toggle(book.id).then(() => alert('Wishlist diperbarui.')) : alert('Login dulu.') }><i className="bi bi-heart me-2"></i>Wishlist</button>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-5">
        <div className="col-lg-6">
          <h3 className="fw-bold mb-3">Review Pembaca</h3>
          {reviews.length === 0 && <p className="text-muted">Belum ada review.</p>}
          {reviews.map((r) => <div className="border rounded-4 p-3 mb-3" key={r.id}><div className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div><p className="mb-0">{r.comment || '-'}</p></div>)}
        </div>
        <div className="col-lg-6">
          <form className="bg-white rounded-4 border p-4" onSubmit={submitReview}>
            <h4 className="fw-bold">Tulis Review</h4>
            <select className="form-select my-3" value={rating} onChange={(e) => setRating(e.target.value)}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} Bintang</option>)}</select>
            <textarea className="form-control mb-3" rows="4" placeholder="Komentar kamu..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
            <button className="btn btn-primary">Kirim Review</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return <div className="col-sm-6 col-lg-4"><div className="p-3 rounded-4 bg-light h-100"><div className="small text-muted">{label}</div><div className="fw-semibold">{value}</div></div></div>;
}

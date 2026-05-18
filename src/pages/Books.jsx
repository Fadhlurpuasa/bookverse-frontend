import { useEffect, useState } from 'react';
import { bookApi, taxonomyApi } from '../api/endpoints';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { unwrap } from '../utils/format';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', category: '', mood: '', goal: '', format: '', maxPrice: '' });

  async function loadBooks(nextFilters = filters) {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(nextFilters).filter(([, v]) => v !== ''));
      const res = await bookApi.list({ ...params, limit: 30 });
      setBooks(unwrap(res));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
    taxonomyApi.categories().then((res) => setCategories(unwrap(res))).catch(() => {});
  }, []);

  function updateFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    loadBooks(filters);
  }

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold">Katalog Buku</h1>
        <p className="text-muted">Filter berdasarkan genre, mood, tujuan baca, format, dan budget.</p>
      </div>

      <form className="filter-card p-3 p-md-4 mb-4" onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-4"><input name="q" className="form-control" placeholder="Cari judul/keyword..." value={filters.q} onChange={updateFilter} /></div>
          <div className="col-md-2"><select name="category" className="form-select" value={filters.category} onChange={updateFilter}><option value="">Kategori</option>{categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></div>
          <div className="col-md-2"><input name="mood" className="form-control" placeholder="Mood" value={filters.mood} onChange={updateFilter} /></div>
          <div className="col-md-2"><input name="goal" className="form-control" placeholder="Tujuan" value={filters.goal} onChange={updateFilter} /></div>
          <div className="col-md-2"><select name="format" className="form-select" value={filters.format} onChange={updateFilter}><option value="">Format</option><option>PHYSICAL</option><option>EBOOK</option><option>AUDIOBOOK</option></select></div>
          <div className="col-md-3"><input type="number" name="maxPrice" className="form-control" placeholder="Budget maksimum" value={filters.maxPrice} onChange={updateFilter} /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100"><i className="bi bi-search me-1"></i>Cari</button></div>
        </div>
      </form>

      {loading ? <Loading /> : books.length === 0 ? <EmptyState title="Buku tidak ditemukan" text="Coba ubah filter pencarian." /> : (
        <div className="row g-4">
          {books.map((book) => <div className="col-sm-6 col-lg-4 col-xl-3" key={book.id}><BookCard book={book} /></div>)}
        </div>
      )}
    </section>
  );
}

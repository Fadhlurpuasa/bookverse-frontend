import { useState } from 'react';
import { recApi } from '../api/endpoints';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { unwrap } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const moodOptions = ['tenang', 'semangat', 'sedih', 'penasaran', 'produktif', 'romantis'];
const goalOptions = ['belajar', 'hiburan', 'karier', 'healing', 'bisnis', 'skripsi'];
const genreOptions = ['fiksi', 'non-fiksi', 'bisnis', 'teknologi', 'self-improvement', 'novel'];

export default function Recommendations() {
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState({ moods: [], goals: [], genres: [], keywords: '', budgetMin: '', budgetMax: '', format: '', limit: 12 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function toggle(name, value) {
    const exists = form[name].includes(value);
    setForm({ ...form, [name]: exists ? form[name].filter((v) => v !== value) : [...form[name], value] });
  }

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function buildPayload() {
    return {
      moods: form.moods,
      goals: form.goals,
      genres: form.genres,
      keywords: form.keywords.split(',').map((v) => v.trim()).filter(Boolean),
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      format: form.format || undefined,
      limit: Number(form.limit || 12)
    };
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recApi.recommend(buildPayload());
      setResults(unwrap(res));
    } finally { setLoading(false); }
  }

  async function savePreference() {
    if (!isLoggedIn) return alert('Login dulu untuk menyimpan preferensi.');
    const p = buildPayload();
    await recApi.savePreferences({ favoriteGenres: p.genres, favoriteMoods: p.moods, readingGoals: p.goals, budgetMin: p.budgetMin, budgetMax: p.budgetMax, preferredFormat: p.format });
    alert('Preferensi membaca tersimpan.');
  }

  async function forMe() {
    if (!isLoggedIn) return alert('Login dulu untuk rekomendasi personal.');
    setLoading(true);
    try { const res = await recApi.forMe(); setResults(unwrap(res)); }
    finally { setLoading(false); }
  }

  return (
    <section className="container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="sticky-lg-top rec-panel p-4 rounded-4 border bg-white">
            <h1 className="fw-bold h3">Book Match</h1>
            <p className="text-muted">Pilih yang kamu mau, nanti sistem mencari buku paling cocok.</p>
            <form onSubmit={submit}>
              <PickGroup title="Mood" name="moods" options={moodOptions} selected={form.moods} toggle={toggle} />
              <PickGroup title="Tujuan Baca" name="goals" options={goalOptions} selected={form.goals} toggle={toggle} />
              <PickGroup title="Genre" name="genres" options={genreOptions} selected={form.genres} toggle={toggle} />
              <label className="form-label fw-semibold">Keyword tambahan</label>
              <input className="form-control mb-3" name="keywords" placeholder="contoh: kopi, startup, sejarah" value={form.keywords} onChange={update} />
              <div className="row g-2">
                <div className="col"><input type="number" className="form-control" name="budgetMin" placeholder="Min" value={form.budgetMin} onChange={update} /></div>
                <div className="col"><input type="number" className="form-control" name="budgetMax" placeholder="Max" value={form.budgetMax} onChange={update} /></div>
              </div>
              <select className="form-select my-3" name="format" value={form.format} onChange={update}><option value="">Semua format</option><option>PHYSICAL</option><option>EBOOK</option><option>AUDIOBOOK</option></select>
              <button className="btn btn-primary w-100 mb-2"><i className="bi bi-stars me-1"></i>Rekomendasikan</button>
              <button type="button" className="btn btn-outline-dark w-100 mb-2" onClick={savePreference}>Simpan Preferensi</button>
              <button type="button" className="btn btn-outline-primary w-100" onClick={forMe}>Rekomendasi Untuk Saya</button>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="fw-bold mb-0">Hasil Rekomendasi</h2><span className="badge text-bg-light border">{results.length} buku</span></div>
          {loading ? <Loading text="Mencari buku paling cocok..." /> : results.length === 0 ? <EmptyState title="Belum ada rekomendasi" text="Isi preferensi di sebelah kiri lalu klik rekomendasikan." /> : (
            <div className="row g-4">{results.map((book) => <div className="col-md-6" key={book.id}><div className="position-relative"><BookCard book={book} /><div className="match-note"><b>Score {book.matchScore}</b><br />{book.recommendationReason}</div></div></div>)}</div>
          )}
        </div>
      </div>
    </section>
  );
}

function PickGroup({ title, name, options, selected, toggle }) {
  return <div className="mb-3"><div className="form-label fw-semibold">{title}</div><div className="d-flex flex-wrap gap-2">{options.map((o) => <button key={o} type="button" onClick={() => toggle(name, o)} className={`btn btn-sm rounded-pill ${selected.includes(o) ? 'btn-primary' : 'btn-outline-secondary'}`}>{o}</button>)}</div></div>;
}

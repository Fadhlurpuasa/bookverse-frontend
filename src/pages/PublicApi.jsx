import { API_URL } from '../api/client';

export default function PublicApi() {
  return (
    <section className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-5">
          <h1 className="fw-bold">Public API</h1>
          <p className="lead text-muted">BookVerse menyediakan endpoint publik agar developer lain bisa membuat frontend sendiri.</p>
          <div className="api-box"><h5 className="fw-bold">Base URL</h5><code>{API_URL}</code></div>
        </div>
        <div className="col-lg-7">
          <div className="bg-dark text-white rounded-4 p-4">
            <h5 className="fw-bold">Contoh Fetch</h5>
            <pre className="mb-0"><code>{`fetch('${API_URL}/public/books')
  .then(res => res.json())
  .then(data => console.log(data));`}</code></pre>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-bordered bg-white"><thead><tr><th>Method</th><th>Endpoint</th><th>Fungsi</th></tr></thead><tbody>
              <tr><td>GET</td><td>/public/books</td><td>Daftar buku publik</td></tr>
              <tr><td>GET</td><td>/public/books/:slug</td><td>Detail buku</td></tr>
              <tr><td>GET</td><td>/public/categories</td><td>Daftar kategori</td></tr>
              <tr><td>POST</td><td>/public/recommendations</td><td>Rekomendasi buku</td></tr>
            </tbody></table>
          </div>
        </div>
      </div>
    </section>
  );
}

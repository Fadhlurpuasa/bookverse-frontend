import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints';
import Loading from '../../components/Loading';
import { unwrap } from '../../utils/format';

export default function AdminApiKeys() {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState('BookVerse Public Client');
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() { setLoading(true); try { const res = await adminApi.apiKeys(); setKeys(unwrap(res)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function create(e) { e.preventDefault(); const res = await adminApi.createApiKey({ name }); setCreated(unwrap(res)); setName(''); load(); }
  async function toggle(id) { await adminApi.toggleApiKey(id); load(); }
  if (loading) return <Loading />;
  return <section className="container py-5"><h1 className="fw-bold mb-4">Public API Keys</h1><div className="row g-4"><div className="col-lg-5"><form className="admin-form" onSubmit={create}><h4 className="fw-bold">Buat API Key</h4><input className="form-control my-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama API key" required /><button className="btn btn-primary">Generate</button>{created?.apiKey && <div className="alert alert-warning mt-3"><b>Simpan key ini sekarang:</b><br/><code>{created.apiKey}</code></div>}</form></div><div className="col-lg-7"><div className="table-responsive"><table className="table bg-white"><thead><tr><th>Nama</th><th>Prefix</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{keys.map((k) => <tr key={k.id}><td>{k.name}</td><td><code>{k.prefix}</code></td><td>{k.isActive ? 'Aktif' : 'Nonaktif'}</td><td><button className="btn btn-sm btn-outline-primary" onClick={() => toggle(k.id)}>Toggle</button></td></tr>)}</tbody></table></div></div></div></section>;
}

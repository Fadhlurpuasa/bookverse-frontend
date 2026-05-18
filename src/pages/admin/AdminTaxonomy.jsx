import { useEffect, useState } from 'react';
import { taxonomyApi } from '../../api/endpoints';
import Loading from '../../components/Loading';
import { unwrap } from '../../utils/format';

export default function AdminTaxonomy() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [catName, setCatName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publisherName, setPublisherName] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [c, a, p] = await Promise.all([taxonomyApi.categories(), taxonomyApi.authors(), taxonomyApi.publishers()]);
      setCategories(unwrap(c)); setAuthors(unwrap(a)); setPublishers(unwrap(p));
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function add(type, e) {
    e.preventDefault();
    if (type === 'category') { await taxonomyApi.createCategory({ name: catName }); setCatName(''); }
    if (type === 'author') { await taxonomyApi.createAuthor({ name: authorName }); setAuthorName(''); }
    if (type === 'publisher') { await taxonomyApi.createPublisher({ name: publisherName }); setPublisherName(''); }
    load();
  }

  if (loading) return <Loading />;
  return <section className="container py-5"><h1 className="fw-bold mb-4">Kategori, Penulis & Penerbit</h1><div className="row g-4">
    <TaxCard title="Kategori" items={categories} value={catName} setValue={setCatName} submit={(e) => add('category', e)} />
    <TaxCard title="Penulis" items={authors} value={authorName} setValue={setAuthorName} submit={(e) => add('author', e)} />
    <TaxCard title="Penerbit" items={publishers} value={publisherName} setValue={setPublisherName} submit={(e) => add('publisher', e)} />
  </div></section>;
}
function TaxCard({ title, items, value, setValue, submit }) { return <div className="col-md-4"><div className="admin-form h-100"><h4 className="fw-bold">{title}</h4><form className="d-flex gap-2 my-3" onSubmit={submit}><input className="form-control" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Nama ${title}`} required /><button className="btn btn-primary">Tambah</button></form><ul className="list-group">{items.map((it) => <li className="list-group-item d-flex justify-content-between" key={it.id}>{it.name}<span className="text-muted small">{it.slug || ''}</span></li>)}</ul></div></div>; }

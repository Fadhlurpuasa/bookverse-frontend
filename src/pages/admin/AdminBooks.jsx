import { useEffect, useState } from 'react';
import { bookApi, taxonomyApi } from '../../api/endpoints';
import Loading from '../../components/Loading';
import { rupiah, unwrap } from '../../utils/format';

const initialForm = { title: '', description: '', synopsis: '', price: 0, discountPercent: 0, stock: 10, coverUrl: '', format: 'PHYSICAL', language: 'Indonesia', pageCount: '', publishYear: '', ageRating: '', moodTags: '', goalTags: '', keywords: '', isFeatured: false, isPublished: true, publisherId: '', categoryIds: [], authorIds: [] };

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [b, c, a, p] = await Promise.all([bookApi.adminList(), taxonomyApi.categories(), taxonomyApi.authors(), taxonomyApi.publishers()]);
      setBooks(unwrap(b)); setCategories(unwrap(c)); setAuthors(unwrap(a)); setPublishers(unwrap(p));
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function multi(name, id) {
    const exists = form[name].includes(id);
    setForm({ ...form, [name]: exists ? form[name].filter((x) => x !== id) : [...form[name], id] });
  }

  function payload() {
    const data = {
      title: form.title || '',
      description: form.description || '',
      synopsis: form.synopsis || undefined,
      isbn: form.isbn || undefined,

      price: Number(form.price || 0),
      discountPercent: Number(form.discountPercent || 0),
      stock: Number(form.stock || 0),

      coverUrl: form.coverUrl?.trim() || undefined,
      format: form.format || 'PHYSICAL',
      language: form.language || 'Indonesia',

      pageCount: form.pageCount ? Number(form.pageCount) : undefined,
      publishYear: form.publishYear ? Number(form.publishYear) : undefined,
      ageRating: form.ageRating || undefined,

      moodTags: String(form.moodTags || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),

      goalTags: String(form.goalTags || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),

      keywords: String(form.keywords || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),

      isFeatured: Boolean(form.isFeatured),
      isPublished: Boolean(form.isPublished),

      publisherId: form.publisherId || undefined,
      categoryIds: Array.isArray(form.categoryIds) ? form.categoryIds : [],
      authorIds: Array.isArray(form.authorIds) ? form.authorIds : []
    };

    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || data[key] === null || data[key] === '') {
        delete data[key];
      }
    });

    return data;
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const data = payload();

      if (!data.title || data.title.length < 2) {
        alert('Judul minimal 2 karakter.');
        return;
      }

      if (!data.description || data.description.length < 10) {
        alert('Deskripsi minimal 10 karakter.');
        return;
      }

      if (data.coverUrl && !data.coverUrl.startsWith('http')) {
        alert('Cover URL harus berupa link valid, misalnya https://...');
        return;
      }

      if (editing) {
        await bookApi.update(editing, data);
        alert('Buku diperbarui.');
      } else {
        await bookApi.create(data);
        alert('Buku dibuat.');
      }

      setForm(initialForm);
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan buku.');
    }
  }

  function edit(book) {
    setEditing(book.id);

    setForm({
      ...initialForm,

      title: book.title || '',
      description: book.description || '',
      synopsis: book.synopsis || '',
      isbn: book.isbn || '',

      price: book.price ?? 0,
      discountPercent: book.discountPercent ?? 0,
      stock: book.stock ?? 0,

      coverUrl: book.coverUrl || '',
      format: book.format || 'PHYSICAL',
      language: book.language || 'Indonesia',

      pageCount: book.pageCount || '',
      publishYear: book.publishYear || '',
      ageRating: book.ageRating || '',

      moodTags: book.moodTags?.join(', ') || '',
      goalTags: book.goalTags?.join(', ') || '',
      keywords: book.keywords?.join(', ') || '',

      isFeatured: Boolean(book.isFeatured),
      isPublished: Boolean(book.isPublished),

      publisherId: book.publisherId || '',
      categoryIds: book.categories?.map((c) => c.categoryId) || [],
      authorIds: book.authors?.map((a) => a.authorId) || []
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id) { if (confirm('Hapus buku ini?')) { await bookApi.remove(id); load(); } }

  if (loading) return <Loading />;
  return (
    <section className="container py-5"><h1 className="fw-bold mb-4">Kelola Buku</h1>
      <form className="admin-form mb-5" onSubmit={submit}>
        <h4 className="fw-bold mb-3">{editing ? 'Edit Buku' : 'Tambah Buku'}</h4>
        <div className="row g-3">
          <Input name="title" label="Judul" value={form.title} update={update} />
          <Input name="price" label="Harga" type="number" value={form.price} update={update} />
          <Input name="stock" label="Stok" type="number" value={form.stock} update={update} />
          <Input name="discountPercent" label="Diskon %" type="number" value={form.discountPercent} update={update} />
          <div className="col-md-4"><label className="form-label">Format</label><select className="form-select" name="format" value={form.format} onChange={update}><option>PHYSICAL</option><option>EBOOK</option><option>AUDIOBOOK</option></select></div>
          <div className="col-md-4"><label className="form-label">Penerbit</label><select className="form-select" name="publisherId" value={form.publisherId} onChange={update}><option value="">-</option>{publishers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <Input name="coverUrl" label="Cover URL" value={form.coverUrl} update={update} />
          <Input name="language" label="Bahasa" value={form.language} update={update} />
          <Input name="pageCount" label="Jumlah Halaman" type="number" value={form.pageCount || ''} update={update} />
          <Input name="publishYear" label="Tahun Terbit" type="number" value={form.publishYear || ''} update={update} />
          <Input name="ageRating" label="Age Rating" value={form.ageRating || ''} update={update} />
          <div className="col-12"><label className="form-label">Deskripsi</label><textarea className="form-control" name="description" rows="3" value={form.description} onChange={update}></textarea></div>
          <div className="col-12"><label className="form-label">Sinopsis</label><textarea className="form-control" name="synopsis" rows="3" value={form.synopsis || ''} onChange={update}></textarea></div>
          <Input name="moodTags" label="Mood Tags, pisahkan koma" value={form.moodTags} update={update} />
          <Input name="goalTags" label="Goal Tags, pisahkan koma" value={form.goalTags} update={update} />
          <Input name="keywords" label="Keywords, pisahkan koma" value={form.keywords} update={update} />
          <CheckGroup title="Kategori" items={categories} selected={form.categoryIds} onToggle={(id) => multi('categoryIds', id)} />
          <CheckGroup title="Penulis" items={authors} selected={form.authorIds} onToggle={(id) => multi('authorIds', id)} />
          <div className="col-12 d-flex gap-3"><label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={update} /> Featured</label><label><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={update} /> Published</label></div>
          <div className="col-12"><button className="btn btn-primary">{editing ? 'Simpan Perubahan' : 'Tambah Buku'}</button>{editing && <button type="button" className="btn btn-light ms-2" onClick={() => { setEditing(null); setForm(initialForm); }}>Batal</button>}</div>
        </div>
      </form>
      <div className="table-responsive"><table className="table table-hover bg-white align-middle"><thead><tr><th>Judul</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{books.map((b) => <tr key={b.id}><td className="fw-semibold">{b.title}</td><td>{rupiah(b.price)}</td><td>{b.stock}</td><td>{b.isPublished ? 'Published' : 'Draft'}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(b)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(b.id)}>Hapus</button></td></tr>)}</tbody></table></div>
    </section>
  );
}
function Input({ name, label, value, update, type = 'text' }) {
  return (
    <div className="col-md-4">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        type={type}
        name={name}
        value={value ?? ''}
        onChange={update}
      />
    </div>
  );
}
function CheckGroup({ title, items, selected, onToggle }) { return <div className="col-md-6"><label className="form-label">{title}</label><div className="border rounded-3 p-2 option-box">{items.map((it) => <label key={it.id} className="d-block"><input type="checkbox" checked={selected.includes(it.id)} onChange={() => onToggle(it.id)} /> {it.name}</label>)}</div></div>; }

import { useEffect, useState } from 'react';
import { wishlistApi } from '../api/endpoints';
import BookCard from '../components/BookCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { unwrap } from '../utils/format';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); try { const res = await wishlistApi.get(); setItems(unwrap(res)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  if (loading) return <Loading />;
  return <section className="container py-5"><h1 className="fw-bold mb-4">Wishlist</h1>{items.length === 0 ? <EmptyState title="Wishlist kosong" text="Simpan buku yang kamu suka." /> : <div className="row g-4">{items.map((item) => <div className="col-md-4" key={item.id}><BookCard book={item.book} onWishlist={load} /></div>)}</div>}</section>;
}

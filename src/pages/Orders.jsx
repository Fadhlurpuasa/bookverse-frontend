import { useEffect, useState } from 'react';
import { orderApi } from '../api/endpoints';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { rupiah, unwrap } from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderApi.mine().then((res) => setOrders(unwrap(res))).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading />;
  return <section className="container py-5"><h1 className="fw-bold mb-4">Pesanan Saya</h1>{orders.length === 0 ? <EmptyState title="Belum ada pesanan" /> : <div className="row g-3">{orders.map((o) => <div className="col-12" key={o.id}><div className="order-card"><div><h5 className="fw-bold">{o.invoiceNumber}</h5><p className="text-muted mb-0">{new Date(o.createdAt).toLocaleString('id-ID')} · {o.items?.length || 0} item</p></div><div className="text-end"><span className="badge text-bg-primary mb-2">{o.status}</span><div className="fw-bold">{rupiah(o.total)}</div></div></div></div>)}</div>}</section>;
}

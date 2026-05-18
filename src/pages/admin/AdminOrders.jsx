import { useEffect, useState } from 'react';
import { orderApi } from '../../api/endpoints';
import Loading from '../../components/Loading';
import { rupiah, unwrap } from '../../utils/format';

const statuses = ['PENDING','PAID','PROCESSING','SHIPPED','COMPLETED','CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); try { const res = await orderApi.adminAll(); setOrders(unwrap(res)); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function update(id, status) { await orderApi.updateStatus(id, { status }); load(); }
  if (loading) return <Loading />;
  return <section className="container py-5"><h1 className="fw-bold mb-4">Kelola Pesanan</h1><div className="table-responsive"><table className="table table-hover bg-white align-middle"><thead><tr><th>Invoice</th><th>User</th><th>Total</th><th>Status</th><th>Ubah</th></tr></thead><tbody>{orders.map((o) => <tr key={o.id}><td className="fw-semibold">{o.invoiceNumber}</td><td>{o.user?.name}<br/><span className="small text-muted">{o.user?.email}</span></td><td>{rupiah(o.total)}</td><td><span className="badge text-bg-primary">{o.status}</span></td><td><select className="form-select" value={o.status} onChange={(e) => update(o.id, e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></section>;
}

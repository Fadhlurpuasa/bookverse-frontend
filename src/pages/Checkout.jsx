import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressApi, orderApi } from '../api/endpoints';
import { useCart } from '../context/CartContext';
import { rupiah, unwrap } from '../utils/format';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [addr, setAddr] = useState({ label: 'Rumah', recipient: '', phone: '', province: '', city: '', district: '', postalCode: '', fullAddress: '', isDefault: true });

  useEffect(() => { addressApi.list().then((res) => { const data = unwrap(res); setAddresses(data); if (data[0]) setSelected(data[0].id); }).catch(() => {}); }, []);

  async function saveAddress(e) {
    e.preventDefault();
    const res = await addressApi.create(addr);
    const created = unwrap(res);
    setAddresses([created, ...addresses]);
    setSelected(created.id);
    alert('Alamat tersimpan.');
  }

  async function checkout() {
    if (!cart.items?.length) return alert('Keranjang kosong.');
    await orderApi.checkout({ addressId: selected || undefined, shippingCost: 15000, note });
    await refreshCart();
    navigate('/orders');
  }

  return (
    <section className="container py-5"><h1 className="fw-bold mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="bg-white rounded-4 border p-4 mb-4"><h4 className="fw-bold">Pilih Alamat</h4>{addresses.map((a) => <label className="address-card" key={a.id}><input type="radio" name="address" checked={selected === a.id} onChange={() => setSelected(a.id)} /> <div><b>{a.label} - {a.recipient}</b><p className="text-muted mb-0">{a.fullAddress}, {a.city}</p></div></label>)}{addresses.length === 0 && <p className="text-muted">Belum ada alamat.</p>}</div>
          <form className="bg-white rounded-4 border p-4" onSubmit={saveAddress}><h4 className="fw-bold">Tambah Alamat</h4><div className="row g-3">{['recipient','phone','province','city','district','postalCode'].map((f) => <div className="col-md-6" key={f}><input className="form-control" placeholder={f} value={addr[f]} onChange={(e) => setAddr({ ...addr, [f]: e.target.value })} /></div>)}<div className="col-12"><textarea className="form-control" placeholder="Alamat lengkap" value={addr.fullAddress} onChange={(e) => setAddr({ ...addr, fullAddress: e.target.value })}></textarea></div><div className="col-12"><button className="btn btn-outline-primary">Simpan Alamat</button></div></div></form>
        </div>
        <div className="col-lg-5"><div className="summary-card"><h4 className="fw-bold">Ringkasan Pesanan</h4><div className="d-flex justify-content-between"><span>Subtotal</span><b>{rupiah(cart.subtotal)}</b></div><div className="d-flex justify-content-between my-2"><span>Ongkir</span><b>{rupiah(15000)}</b></div><hr/><div className="d-flex justify-content-between h5"><span>Total</span><b>{rupiah((cart.subtotal || 0) + 15000)}</b></div><textarea className="form-control my-3" placeholder="Catatan" value={note} onChange={(e) => setNote(e.target.value)}></textarea><button className="btn btn-primary w-100" onClick={checkout}>Buat Pesanan</button></div></div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { getBookImage, rupiah } from '../utils/format';

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const items = cart.items || [];
  if (items.length === 0) return <section className="container py-5"><EmptyState title="Keranjang kosong" text="Tambahkan buku dari katalog dulu." /><div className="text-center mt-3"><Link to="/books" className="btn btn-primary">Belanja Buku</Link></div></section>;

  return (
    <section className="container py-5">
      <h1 className="fw-bold mb-4">Keranjang</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((item) => <div className="cart-row" key={item.id}>
            <img src={getBookImage(item.book)} alt={item.book.title} />
            <div className="flex-grow-1"><h5 className="fw-bold mb-1">{item.book.title}</h5><p className="text-muted mb-2">{rupiah(item.book.price)}</p><button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>Hapus</button></div>
            <input className="form-control qty-input" type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} />
            <div className="fw-bold">{rupiah(item.book.price * item.quantity)}</div>
          </div>)}
        </div>
        <div className="col-lg-4"><div className="summary-card"><h4 className="fw-bold">Ringkasan</h4><div className="d-flex justify-content-between my-3"><span>Subtotal</span><b>{rupiah(cart.subtotal)}</b></div><Link className="btn btn-primary w-100" to="/checkout">Checkout</Link></div></div>
      </div>
    </section>
  );
}

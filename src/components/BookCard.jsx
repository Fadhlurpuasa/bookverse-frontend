import { Link } from 'react-router-dom';
import { getBookImage, rupiah, shortText } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistApi } from '../api/endpoints';

export default function BookCard({ book, onWishlist }) {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const authors = book.authors?.map((a) => a.author?.name).filter(Boolean).join(', ') || 'Penulis tidak diketahui';
  const finalPrice = Math.round(book.price - (book.price * (book.discountPercent || 0) / 100));

  async function handleCart() {
    if (!isLoggedIn) return alert('Login dulu untuk menambahkan ke keranjang.');
    await addToCart(book.id, 1);
    alert('Buku masuk ke keranjang.');
  }

  async function handleWishlist() {
    if (!isLoggedIn) return alert('Login dulu untuk wishlist.');
    await wishlistApi.toggle(book.id);
    if (onWishlist) onWishlist();
    else alert('Wishlist diperbarui.');
  }

  return (
    <div className="card book-card h-100 border-0 shadow-sm">
      <Link to={`/books/${book.slug || book.id}`} className="book-cover-wrap">
        <img src={getBookImage(book)} alt={book.title} className="card-img-top book-cover" />
        {book.isFeatured && <span className="badge text-bg-warning book-badge">Featured</span>}
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <span className="badge rounded-pill text-bg-light border">{book.format}</span>
          <span className="small text-warning"><i className="bi bi-star-fill"></i> {book.avgRating || 0}</span>
        </div>
        <h5 className="card-title mt-3 mb-1"><Link className="text-decoration-none text-dark" to={`/books/${book.slug || book.id}`}>{book.title}</Link></h5>
        <p className="text-muted small mb-2">{authors}</p>
        <p className="card-text text-muted small flex-grow-1">{shortText(book.description)}</p>
        <div className="mb-3">
          {book.discountPercent > 0 && <span className="text-muted text-decoration-line-through small me-2">{rupiah(book.price)}</span>}
          <span className="fw-bold text-primary">{rupiah(finalPrice)}</span>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary flex-grow-1" onClick={handleCart}><i className="bi bi-bag-plus me-1"></i>Beli</button>
          <button className="btn btn-outline-danger" onClick={handleWishlist}><i className="bi bi-heart"></i></button>
        </div>
      </div>
    </div>
  );
}

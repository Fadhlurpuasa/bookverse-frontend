import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/endpoints';
import Loading from '../../components/Loading';
import { unwrap } from '../../utils/format';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setData(unwrap(res)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    ['Total Buku', data?.totalBooks || 0, 'bi-book'],
    ['Total User', data?.totalUsers || 0, 'bi-people'],
    ['Total Pesanan', data?.totalOrders || 0, 'bi-receipt']
  ];

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Admin Dashboard</h1>
          <p className="text-muted mb-0">
            Ringkasan data utama BookVerse.
          </p>
        </div>

        <Link className="btn btn-primary" to="/admin/books">
          Kelola Buku
        </Link>
      </div>

      <div className="row g-3">
        {cards.map((card) => (
          <div className="col-md-4" key={card[0]}>
            <div className="admin-stat">
              <i className={`bi ${card[2]} fs-2 text-primary`}></i>

              <p className="text-muted mt-3 mb-1">
                {card[0]}
              </p>

              <h3 className="fw-bold">
                {card[1]}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
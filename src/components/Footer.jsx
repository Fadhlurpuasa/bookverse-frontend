export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <h5 className="fw-bold mb-1">BookVerse</h5>
          <p className="text-white-50 mb-0">Toko buku pintar dengan rekomendasi personal dan API publik.</p>
        </div>
        <div className="text-white-50 small">React + Bootstrap · Express + Prisma + Supabase</div>
      </div>
    </footer>
  );
}

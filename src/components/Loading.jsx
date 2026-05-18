export default function Loading({ text = 'Memuat data...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary me-3" role="status"></div>
      <span className="text-muted">{text}</span>
    </div>
  );
}

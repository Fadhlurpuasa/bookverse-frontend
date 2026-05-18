export default function EmptyState({ title = 'Belum ada data', text = 'Data akan tampil di sini.' }) {
  return (
    <div className="text-center py-5 bg-white rounded-4 border">
      <i className="bi bi-journal-x display-4 text-muted"></i>
      <h5 className="mt-3">{title}</h5>
      <p className="text-muted mb-0">{text}</p>
    </div>
  );
}

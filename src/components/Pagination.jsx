export default function Pagination({ pagination, onPageChange, loading }) {
  if (!pagination || pagination.last_page <= 1) return null;
  return (
    <nav aria-label="Results pages" className="d-flex flex-wrap justify-content-center align-items-center gap-3 my-4">
      <button type="button" className="btn btn-outline-primary" disabled={loading || pagination.current_page <= 1} onClick={() => onPageChange(pagination.current_page - 1)}>Previous</button>
      <span role="status">Page {pagination.current_page} of {pagination.last_page} · {pagination.total} results</span>
      <button type="button" className="btn btn-outline-primary" disabled={loading || pagination.current_page >= pagination.last_page} onClick={() => onPageChange(pagination.current_page + 1)}>Next</button>
    </nav>
  );
}

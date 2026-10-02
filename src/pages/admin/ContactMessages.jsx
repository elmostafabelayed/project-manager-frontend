import usePagedCollection from '../../hooks/usePagedCollection';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

export default function ContactMessages() {
  const { items, pagination, loading, error, setPage, refresh } = usePagedCollection('/admin/contact-messages');
  return <main className="container pt-5 mt-5 pb-5">
    <Link to="/admin/dashboard">← Admin Dashboard</Link>
    <h1 className="my-4">Contact Messages</h1>
    {loading && <p role="status">Loading…</p>}
    {error && <p role="alert">{error} <button onClick={refresh}>Retry</button></p>}
    {!loading && !items.length && <p>No messages yet.</p>}
    {items.map(message => <article className="card p-4 mb-3" key={message.id}>
      <h2 className="h5">{message.subject}</h2>
      <p>{message.name} · {message.email} · {new Date(message.created_at).toLocaleString()}</p>
      <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message.message}</p>
    </article>)}
    <Pagination pagination={pagination} onPageChange={setPage} loading={loading} />
  </main>;
}

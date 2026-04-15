import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function ManageUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const userName = users.find(user => user.id == id)?.name;
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action is permanent!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#185fa5',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, delete ${userName}!`
    });

    if (!result.isConfirmed) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success("User deleted.");
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="bg-background min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h1 className="fw-bold mb-4">Manage Users</h1>
        
        {loading ? (
          <div className="text-center p-5"><div className="cl-spinner"></div></div>
        ) : (
          <div className="table-responsive bg-white shadow-sm rounded-3 p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                       <span className={`badge ${user.role_id === 1 ? 'bg-primary' : user.role_id === 2 ? 'bg-info' : 'bg-dark'}`}>
                          {user.role?.name || 'User'}
                       </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                       {currentUser?.id !== user.id ? (
                         <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-outline-danger">
                            Delete
                         </button>
                       ) : (
                         <span className="text-muted small">Current Admin</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

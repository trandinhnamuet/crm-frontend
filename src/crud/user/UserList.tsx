import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from './UserApi';
import type User from './User';

interface UserListProps {
  onEdit: (user: User) => void;
}

export default function UserList({ onEdit }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      setUsers(await getUsers());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: number) {
    console.log('handleDelete', id);
    if (!window.confirm('Delete this user?')) return;
    try {
      console.log('onOk delete', id);
      await deleteUser(id);
      fetchUsers();
    } catch (e: any) {
      console.error('Delete error', e);
      setError(e.message || 'Lỗi khi xóa user');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <table className="user-list">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.username}</td>
            <td>{u.fullname}</td>
            <td>{u.email}</td>
            <td>
              <button onClick={() => onEdit(u)}>Edit</button>
              <button onClick={() => handleDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

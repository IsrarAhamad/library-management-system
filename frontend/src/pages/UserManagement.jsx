import React, { useEffect, useState } from 'react';
import UserForm from '../components/UserForm';
import { getUsers, addUser, updateUser, deleteUser } from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refreshUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => { refreshUsers(); }, []);

  const handleSubmit = async (user) => {
    setError('');
    setMessage('');
    try {
      if (selected) {
        await updateUser(selected._id, user);
        setMessage('User updated successfully.');
      } else {
        await addUser(user);
        setMessage('User added successfully.');
      }
      await refreshUsers();
      setSelected(null);
    } catch (err) {
      setError('Unable to save user. Please verify all required fields.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');
    try {
      await deleteUser(id);
      await refreshUsers();
      setMessage('User deleted.');
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      {message && <div className="mb-3 text-green-600">{message}</div>}
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <div className="flex mb-6">
        <div className="flex-1">
          <h3 className="font-bold mb-2">{selected ? 'Edit User' : 'Add User'}</h3>
          <UserForm initial={selected || {}} onSubmit={handleSubmit} />
        </div>
        <div className="flex-1 ml-4">
          <table className="w-full bg-white rounded shadow">
            <thead><tr><th>Name</th><th>Role</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="text-blue-600 underline text-xs mr-1" onClick={() => setSelected(user)}>Edit</button>
                    <button className="text-red-600 underline text-xs" onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

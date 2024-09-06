import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useEffect, useState } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users',err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user',err);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleCreateClick = () => {
    setCreatingUser(true);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        await axios.put(`${API_URL}/${editingUser.id}`, formData);
        setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...formData } : user)));
      } else if (creatingUser) {
        // Create new user
        const response = await axios.post(API_URL, formData);
        setUsers([...users, response.data]);
      }
      setEditingUser(null);
      setCreatingUser(false);
    } catch (err) {
      console.log(err);
      setError(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setCreatingUser(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {creatingUser || editingUser ? (
        <form onSubmit={handleSubmit}>
          <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn">{editingUser ? 'Save' : 'Create'}</button>
          <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
        </form>
      ) : (
        <div>
          <button onClick={handleCreateClick} className="btn">Create User</button>
          <table>
            <thead>
              <tr>
                <th>#</th> {/* Index column */}
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td> {/* Display index */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)} className="btn">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="btn">Delete</button>
                    <Link to={`/user/${user.id}`} className="btn">Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserList;

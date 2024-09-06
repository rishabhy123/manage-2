import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user',err);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>User Details</h2>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>
      )}
    </div>
  );
}

export default UserDetail;

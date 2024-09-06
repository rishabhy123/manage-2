import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../styles.css'; // Import global styles

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          const user = response.data;
          setValue('name', user.name);
          setValue('email', user.email);
          setValue('phone', user.phone);
          setLoading(false);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          setError('Failed to fetch user');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Name:</label>
      <input type="text" {...register('name', { required: true })} />
      {errors.name && <p className="error">Name is required</p>}

      <label>Email:</label>
      <input type="email" {...register('email', { required: true })} />
      {errors.email && <p className="error">Email is required</p>}

      <label>Phone:</label>
      <input type="text" {...register('phone', { required: true })} />
      {errors.phone && <p className="error">Phone is required</p>}

      <button type="submit">Save</button>
    </form>
  );
}

export default UserForm;

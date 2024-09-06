import { Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import './styles.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>User Management</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/create" element={<UserForm />} />
          <Route path="/edit/:id" element={<UserForm />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

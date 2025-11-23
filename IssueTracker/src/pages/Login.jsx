import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import data from '../data/data.json';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserSelect = (user) => {
    login(user);
    navigate('/issues');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>Issue Tracker</h1>
          <p>Select a user to continue</p>
        </div>
        
        <div className="users-grid">
          {data.users.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onClick={handleUserSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

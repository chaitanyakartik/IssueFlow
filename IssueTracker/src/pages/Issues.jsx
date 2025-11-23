import { useAuth } from '../context/AuthContext';
import './Issues.css';

const Issues = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="issues-container">
      <div className="issues-header">
        <h1>Issues</h1>
        <div className="user-section">
          <span>Welcome, {currentUser?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="issues-content">
        <p>Issue list will be displayed here...</p>
      </div>
    </div>
  );
};

export default Issues;

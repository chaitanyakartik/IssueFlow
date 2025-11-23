import './UserCard.css';

const UserCard = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={() => onClick(user)}>
      <div className="user-avatar">
        {user.avatar}
      </div>
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <span className={`user-role ${user.role}`}>
          {user.role === 'admin' ? 'Admin' : 'User'}
        </span>
      </div>
    </div>
  );
};

export default UserCard;

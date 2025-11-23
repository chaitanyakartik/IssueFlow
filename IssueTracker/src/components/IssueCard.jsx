import { useNavigate } from 'react-router-dom';
import './IssueCard.css';

const IssueCard = ({ issue, users }) => {
  const navigate = useNavigate();
  
  // Get author details
  const author = users.find(u => u.id === issue.authorId);
  
  // Get assignee details
  const assignees = issue.assignees.map(assigneeId => 
    users.find(u => u.id === assigneeId)
  ).filter(Boolean);
  
  // Truncate description
  const truncatedDesc = issue.description.length > 120 
    ? issue.description.substring(0, 120) + '...' 
    : issue.description;
  
  // Format date
  const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const handleClick = () => {
    navigate(`/issues/${issue.id}`);
  };
  
  return (
    <div className="issue-card" onClick={handleClick}>
      <div className="issue-card-header">
        <div className="issue-title-section">
          <h3 className="issue-title">{issue.title}</h3>
          <span className={`issue-status status-${issue.status}`}>
            {issue.status}
          </span>
        </div>
        <div className="issue-meta">
          <span className="issue-author">
            by <strong>{author?.name}</strong>
          </span>
          <span className="issue-date">{createdDate}</span>
        </div>
      </div>
      
      <p className="issue-description">{truncatedDesc}</p>
      
      <div className="issue-tags">
        {issue.tags.map(tag => (
          <span key={tag} className={`tag tag-${tag}`}>
            {tag}
          </span>
        ))}
      </div>
      
      <div className="issue-footer">
        <div className="issue-assignees">
          {assignees.length > 0 && (
            <>
              <span className="assignee-label">Assigned to:</span>
              <div className="assignee-avatars">
                {assignees.map(assignee => (
                  <div 
                    key={assignee.id} 
                    className="assignee-avatar"
                    title={assignee.name}
                  >
                    {assignee.avatar}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {issue.effort && (
          <div className="issue-effort">
            <span>{issue.effort} day{issue.effort !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCard;

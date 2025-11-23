import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIssueById, updateIssue, getUsers } from '../utils/dataManager';
import './IssueDetail.css';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  
  const [issue, setIssue] = useState(null);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [customTag, setCustomTag] = useState('');
  
  const predefinedTags = [
    'bug', 'enhancement', 'documentation', 'high-priority', 'critical',
    'performance', 'ui', 'backend', 'frontend', 'security', 'mobile', 'testing'
  ];
  
  useEffect(() => {
    const foundIssue = getIssueById(id);
    const allUsers = getUsers();
    
    if (foundIssue) {
      setIssue(foundIssue);
      setEditData(foundIssue);
      setUsers(allUsers);
    } else {
      navigate('/issues');
    }
  }, [id, navigate]);
  
  if (!issue) {
    return <div className="loading">Loading...</div>;
  }
  
  const author = users.find(u => u.id === issue.authorId);
  const assignees = issue.assignees.map(assigneeId => 
    users.find(u => u.id === assigneeId)
  ).filter(Boolean);
  
  const canEdit = currentUser.id === issue.authorId;
  const canClose = isAdmin();
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(issue);
    setCustomTag('');
  };
  
  const handleSaveEdit = () => {
    const updatedIssue = updateIssue(id, editData);
    if (updatedIssue) {
      setIssue(updatedIssue);
    }
    setIsEditing(false);
    setCustomTag('');
  };
  
  const handleCloseIssue = () => {
    if (window.confirm('Are you sure you want to close this issue?')) {
      const closedIssue = {
        ...issue,
        status: 'closed',
        closedAt: new Date().toISOString()
      };
      const updated = updateIssue(id, closedIssue);
      if (updated) {
        setIssue(updated);
        setEditData(updated);
      }
    }
  };
  
  const handleReopenIssue = () => {
    const reopenedIssue = {
      ...issue,
      status: 'open',
      closedAt: null
    };
    const updated = updateIssue(id, reopenedIssue);
    if (updated) {
      setIssue(updated);
      setEditData(updated);
    }
  };
  
  const toggleAssignee = (userId) => {
    setEditData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter(id => id !== userId)
        : [...prev.assignees, userId]
    }));
  };
  
  const toggleTag = (tag) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  
  const addCustomTag = () => {
    if (customTag.trim() && !editData.tags.includes(customTag.trim().toLowerCase())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim().toLowerCase()]
      }));
      setCustomTag('');
    }
  };
  
  const handleStatusChange = (newStatus) => {
    setEditData(prev => ({ ...prev, status: newStatus }));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDeadline = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="issue-detail-container">
      <div className="issue-detail-header">
        <button className="back-button" onClick={() => navigate('/issues')}>
          ← Back to Issues
        </button>
        <div className="header-actions">
          {canEdit && issue.status !== 'closed' && !isEditing && (
            <button className="btn-edit" onClick={handleEdit}>
              Edit Issue
            </button>
          )}
          {isEditing && (
            <>
              <button className="btn-cancel" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </>
          )}
          {canClose && issue.status !== 'closed' && !isEditing && (
            <button className="btn-close-issue" onClick={handleCloseIssue}>
              Close Issue
            </button>
          )}
          {canClose && issue.status === 'closed' && !isEditing && (
            <button className="btn-reopen" onClick={handleReopenIssue}>
              Reopen Issue
            </button>
          )}
        </div>
      </div>
      
      <div className="issue-detail-content">
        <div className="issue-main">
          <div className="issue-title-section">
            {isEditing ? (
              <input
                type="text"
                className="edit-title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              />
            ) : (
              <h1>{issue.title}</h1>
            )}
            <span className={`issue-status-badge status-${issue.status}`}>
              {issue.status}
            </span>
          </div>
          
          <div className="issue-metadata">
            <div className="meta-item">
              <span className="meta-label">Created by</span>
              <div className="meta-value">
                <div className="author-info">
                  <div className="author-avatar">{author.avatar}</div>
                  <div>
                    <strong>{author.name}</strong>
                    <span className="meta-date">{formatDate(issue.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {issue.closedAt && (
              <div className="meta-item">
                <span className="meta-label">Closed</span>
                <span className="meta-value">{formatDate(issue.closedAt)}</span>
              </div>
            )}
          </div>
          
          <div className="issue-description-section">
            <h3>Description</h3>
            {isEditing ? (
              <textarea
                className="edit-description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                rows="10"
              />
            ) : (
              <p className="issue-description-full">{issue.description}</p>
            )}
          </div>
          
          {isEditing && (
            <div className="edit-status-section">
              <h3>Status</h3>
              <div className="status-buttons">
                <button
                  className={`status-btn ${editData.status === 'open' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('open')}
                >
                  Open
                </button>
                <button
                  className={`status-btn ${editData.status === 'in-progress' ? 'active' : ''}`}
                  onClick={() => handleStatusChange('in-progress')}
                >
                  In Progress
                </button>
                {canClose && (
                  <button
                    className={`status-btn ${editData.status === 'closed' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('closed')}
                  >
                    Closed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="issue-sidebar">
          <div className="sidebar-section">
            <h4>Assignees</h4>
            {isEditing ? (
              <div className="edit-assignees">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`assignee-option-detail ${editData.assignees.includes(user.id) ? 'selected' : ''}`}
                    onClick={() => toggleAssignee(user.id)}
                  >
                    <div className="assignee-avatar-small">{user.avatar}</div>
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="assignees-list">
                {assignees.length > 0 ? (
                  assignees.map(assignee => (
                    <div key={assignee.id} className="assignee-item">
                      <div className="assignee-avatar">{assignee.avatar}</div>
                      <div>
                        <div className="assignee-name">{assignee.name}</div>
                        <div className="assignee-email">{assignee.email}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-assignees">No assignees</p>
                )}
              </div>
            )}
          </div>
          
          <div className="sidebar-section">
            <h4>Tags</h4>
            {isEditing ? (
              <div>
                <div className="edit-tags">
                  {predefinedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-btn ${editData.tags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="custom-tag-input-detail">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add custom tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                  />
                  <button type="button" onClick={addCustomTag}>+</button>
                </div>
                {editData.tags.filter(tag => !predefinedTags.includes(tag)).length > 0 && (
                  <div className="custom-tags-list">
                    {editData.tags.filter(tag => !predefinedTags.includes(tag)).map(tag => (
                      <span key={tag} className="custom-tag-detail">
                        {tag}
                        <button type="button" onClick={() => toggleTag(tag)}>&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="tags-list">
                {issue.tags.map(tag => (
                  <span key={tag} className={`tag tag-${tag}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="sidebar-section">
            <h4>Effort</h4>
            {isEditing ? (
              <input
                type="number"
                className="edit-effort"
                value={editData.effort || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, effort: e.target.value ? parseInt(e.target.value) : null }))}
                placeholder="Days"
                min="1"
              />
            ) : (
              <p className="effort-value">
                {issue.effort ? `${issue.effort} day${issue.effort !== 1 ? 's' : ''}` : 'Not specified'}
              </p>
            )}
          </div>
          
          <div className="sidebar-section">
            <h4>Deadline</h4>
            {isEditing ? (
              <input
                type="date"
                className="edit-deadline"
                value={editData.deadline ? editData.deadline.split('T')[0] : ''}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  deadline: e.target.value ? new Date(e.target.value).toISOString() : null 
                }))}
              />
            ) : (
              <p className="deadline-value">{formatDeadline(issue.deadline)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;

import { useState } from 'react';
import './AddIssueModal.css';

const AddIssueModal = ({ isOpen, onClose, onSubmit, currentUser, users }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignees: [],
    tags: [],
    deadline: '',
    effort: ''
  });
  
  const [customTag, setCustomTag] = useState('');
  
  const predefinedTags = [
    'bug', 'enhancement', 'documentation', 'high-priority', 'critical',
    'performance', 'ui', 'backend', 'frontend', 'security', 'mobile', 'testing'
  ];
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newIssue = {
      id: `issue_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: 'open',
      authorId: currentUser.id,
      assignees: formData.assignees,
      tags: formData.tags,
      createdAt: new Date().toISOString(),
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      effort: formData.effort ? parseInt(formData.effort) : null
    };
    
    onSubmit(newIssue);
    handleClose();
  };
  
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assignees: [],
      tags: [],
      deadline: '',
      effort: ''
    });
    setCustomTag('');
    onClose();
  };
  
  const toggleAssignee = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(userId)
        ? prev.assignees.filter(id => id !== userId)
        : [...prev.assignees, userId]
    }));
  };
  
  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };
  
  const addCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim().toLowerCase()]
      }));
      setCustomTag('');
    }
  };
  
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Issue</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter issue title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the issue in detail"
              rows="5"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Assign To</label>
            <div className="assignee-selection">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`assignee-option ${formData.assignees.includes(user.id) ? 'selected' : ''}`}
                  onClick={() => toggleAssignee(user.id)}
                >
                  <div className="assignee-avatar-small">{user.avatar}</div>
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-selection">
              {predefinedTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-option ${formData.tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="custom-tag-input">
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
              <button type="button" onClick={addCustomTag}>Add</button>
            </div>
            {formData.tags.filter(tag => !predefinedTags.includes(tag)).length > 0 && (
              <div className="custom-tags">
                {formData.tags.filter(tag => !predefinedTags.includes(tag)).map(tag => (
                  <span key={tag} className="custom-tag">
                    {tag}
                    <button type="button" onClick={() => toggleTag(tag)}>&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="effort">Effort (days)</label>
              <input
                type="number"
                id="effort"
                value={formData.effort}
                onChange={(e) => setFormData(prev => ({ ...prev, effort: e.target.value }))}
                placeholder="e.g., 5"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIssueModal;

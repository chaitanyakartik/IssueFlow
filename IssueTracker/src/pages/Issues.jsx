import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import Dropdown from '../components/Dropdown';
import AddIssueModal from '../components/AddIssueModal';
import { getIssues, addIssue, getUsers } from '../utils/dataManager';
import './Issues.css';

const Issues = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState(null); // null, 'assigned', 'created'
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created-desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Load data on mount
  useEffect(() => {
    setIssues(getIssues());
    setUsers(getUsers());
  }, []);
  
  // Get all unique tags from issues
  const allTags = useMemo(() => {
    const tags = new Set();
    issues.forEach(issue => {
      issue.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [issues]);
  
  // Filter options
  const filterOptions = [
    { value: null, label: 'All Issues' },
    { value: 'assigned', label: 'Assigned to Me' },
    { value: 'created', label: 'Created by Me' }
  ];
  
  // Tag options
  const tagOptions = allTags.map(tag => ({
    value: tag,
    label: tag
  }));
  
  // Sort options
  const sortOptions = [
    { value: 'created-desc', label: 'Newest First' },
    { value: 'created-asc', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'status', label: 'Status' },
    { value: 'effort-desc', label: 'Effort (High to Low)' },
    { value: 'effort-asc', label: 'Effort (Low to High)' }
  ];
  
  // Filter and sort issues
  const filteredAndSortedIssues = useMemo(() => {
    let filtered = [...issues];
    
    // Apply filter type
    if (filterType === 'assigned') {
      filtered = filtered.filter(issue => 
        issue.assignees.includes(currentUser.id)
      );
    } else if (filterType === 'created') {
      filtered = filtered.filter(issue => 
        issue.authorId === currentUser.id
      );
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(issue =>
        selectedTags.some(tag => issue.tags.includes(tag))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'created-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'status':
          const statusOrder = { open: 0, 'in-progress': 1, closed: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'effort-desc':
          return (b.effort || 0) - (a.effort || 0);
        case 'effort-asc':
          return (a.effort || 0) - (b.effort || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [issues, filterType, selectedTags, sortBy, currentUser.id]);
  
  const handleAddIssue = (newIssue) => {
    const savedIssue = addIssue(newIssue);
    setIssues(prev => [savedIssue, ...prev]);
  };
  
  return (
    <div className="issues-container">
      <div className="issues-header">
        <div className="header-left">
          <h1>Issues</h1>
          <span className="issue-count">
            {filteredAndSortedIssues.length} issue{filteredAndSortedIssues.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="header-right">
          <span className="user-welcome">Welcome, {currentUser?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="issues-toolbar">
        <div className="toolbar-filters">
          <Dropdown
            label="Filter"
            options={filterOptions}
            value={filterType}
            onChange={setFilterType}
          />
          
          <Dropdown
            label="Tags"
            options={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            multiSelect={true}
          />
          
          <Dropdown
            label="Sort"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
        
        <button className="btn-new-issue" onClick={() => setIsAddModalOpen(true)}>
          + New Issue
        </button>
      </div>
      
      <div className="issues-content">
        {filteredAndSortedIssues.length === 0 ? (
          <div className="no-issues">
            <p>No issues found</p>
            <button className="btn-create-first" onClick={() => setIsAddModalOpen(true)}>
              Create your first issue
            </button>
          </div>
        ) : (
          filteredAndSortedIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              users={users}
            />
          ))
        )}
      </div>
      
      <AddIssueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddIssue}
        currentUser={currentUser}
        users={users}
      />
    </div>
  );
};

export default Issues;

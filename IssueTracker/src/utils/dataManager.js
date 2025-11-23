import initialData from '../data/data.json';

const STORAGE_KEY = 'issueflow_data';

// Initialize localStorage with data from JSON file if not already present
const initializeData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(storedData);
};

// Get all data
export const getData = () => {
  return initializeData();
};

// Get all issues
export const getIssues = () => {
  const data = getData();
  return data.issues || [];
};

// Get single issue by ID
export const getIssueById = (id) => {
  const data = getData();
  return data.issues.find(issue => issue.id === id);
};

// Add new issue
export const addIssue = (newIssue) => {
  const data = getData();
  data.issues = [newIssue, ...data.issues];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return newIssue;
};

// Update existing issue
export const updateIssue = (id, updatedIssue) => {
  const data = getData();
  const index = data.issues.findIndex(issue => issue.id === id);
  
  if (index !== -1) {
    data.issues[index] = { ...data.issues[index], ...updatedIssue };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.issues[index];
  }
  
  return null;
};

// Delete/Close issue
export const deleteIssue = (id) => {
  const data = getData();
  data.issues = data.issues.filter(issue => issue.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return true;
};

// Get all users
export const getUsers = () => {
  const data = getData();
  return data.users || [];
};

// Reset data to initial state (useful for testing)
export const resetData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

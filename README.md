# IssueFlow

IssueFlow is a React-based issue tracker application designed to help teams manage their tasks and issues efficiently. It provides features like user authentication, issue listing, filtering, sorting, and CRUD (Create, Read, Update, Delete) operations. The application also ensures data persistence using the browser's localStorage.

## Features

- **User Authentication**: Secure login functionality to access the application.
- **Issue Listing**: View all issues in a clean and organized layout.
- **Filtering and Sorting**: Filter issues by status, priority, or other criteria, and sort them for better visibility.
- **CRUD Operations**: Create, read, update, and delete issues seamlessly.
- **Data Persistence**: All data is stored in the browser's localStorage, ensuring that changes are retained even after refreshing the page.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

```
IssueTracker/
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable components (e.g., Dropdown, AddIssueModal)
│   ├── pages/             # Application pages (e.g., Issues, IssueDetail)
│   ├── utils/             # Utility functions (e.g., dataManager.js for localStorage operations)
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main application component
│   ├── index.css          # Base styles
│   ├── main.jsx           # Application entry point
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chaitanyakartik/IssueFlow.git
   ```

2. Navigate to the project directory:
   ```bash
   cd IssueFlow/IssueTracker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## Usage

1. **Login**: Use the login page to authenticate.
2. **View Issues**: Navigate to the issues page to see all issues.
3. **Add Issues**: Use the "Add Issue" button to create a new issue.
4. **Edit Issues**: Click on an issue to view and edit its details.
5. **Filter and Sort**: Use the dropdowns to filter and sort issues.
6. **Close Issues**: Mark issues as closed when resolved.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **React Router**: For navigation between pages.
- **Vite**: Development environment for fast builds and hot module replacement.
- **localStorage**: For data persistence.

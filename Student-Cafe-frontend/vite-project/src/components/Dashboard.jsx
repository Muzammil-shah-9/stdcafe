import { Link } from 'react-router-dom'

const Dashboard = ({ isAuthenticated, authChecked }) => (
  <div className="container mt-5">
    <h2>Dashboard Page</h2>
    {!authChecked ? <p>Checking your sign-in…</p> : isAuthenticated ? <p>Welcome! You are signed in.</p> : <p>Please <Link to="/login">log in</Link> first.</p>}
  </div>
)

export default Dashboard

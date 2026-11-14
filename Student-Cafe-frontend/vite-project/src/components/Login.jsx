import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api'

const Login = ({ onAuthenticated }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, form)
      localStorage.setItem('token', res.data.token)
      onAuthenticated?.()
      navigate('/', { replace: true })
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="col-md-6">
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input id="login-email" type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">Password</label>
          <input id="login-password" type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Login</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  )
}

export default Login

import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = ({ onAuthenticated }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/users/register', form)
      if (!res.data.token) throw new Error('Registration succeeded but sign-in could not be completed. Please log in.')
      localStorage.setItem('token', res.data.token)
      onAuthenticated?.()
      setMessage(res.data.message || 'Registration successful')
      setTimeout(() => navigate('/', { replace: true }), 600)
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Error occurred')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="col-md-6">
        <div className="mb-3">
          <label htmlFor="register-name" className="form-label">Name</label>
          <input id="register-name" type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="register-email" className="form-label">Email</label>
          <input id="register-email" type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="register-password" className="form-label">Password</label>
          <input id="register-password" type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  )
}

export default Register

import { useState } from 'react'
import { useBusiness } from '../context/BusinessContext'

const Clients = () => {
  const { clients, addClient, deleteClient } = useBusiness()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      alert('Name and Phone are required!')
      return
    }
    addClient(formData)
    setFormData({ name: '', phone: '', email: '', address: '' })
    setShowForm(false)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete client "${name}"?`)) {
      deleteClient(id)
    }
  }

  return (
    <div className="page-wrap clients-page">
      {/* Header */}
      <div className="page-head">
        <div className="page-head-copy">
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">Manage your client database</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${
            showForm
              ? 'btn-muted'
              : 'btn-gold'
          }`}
        >
          {showForm ? '✕ Cancel' : '+ Add Client'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="form-panel">
          <h2 className="form-title">New Client</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid two-col">
              <div className="field-wrap">
                <label className="field-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Client name"
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="client@email.com"
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="City, Area"
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary btn-success"
              >
                ✓ Save Client
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="empty-panel">
          <div className="empty-icon">👥</div>
          <p className="empty-title">No clients yet</p>
          <p className="empty-text">Add your first client to get started</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map(client => (
            <div
              key={client.id}
              className="client-card"
            >
              <div className="client-top">
                <div className="client-id-wrap">
                  <div className="client-avatar">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="client-name">{client.name}</h3>
                    <p className="client-phone">{client.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(client.id, client.name)}
                  className="client-delete"
                >
                  🗑️
                </button>
              </div>
              {(client.email || client.address) && (
                <div className="client-meta">
                  {client.email && <p>📧 {client.email}</p>}
                  {client.address && <p>📍 {client.address}</p>}
                </div>
              )}
              <p className="client-added">Added: {client.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Clients

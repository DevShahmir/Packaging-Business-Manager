import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBusiness } from '../context/BusinessContext'

const Orders = () => {
  const { clients, orders, addOrder } = useBusiness()

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    clientId: '',
    boxType: 'Rigid Box',
    quantity: '',
    size: '',
    material: '',
    printing: '',
    finishing: '',
    deadline: '',
    totalAmount: ''
  })

  const boxTypes = ['Rigid Box', 'Tuck Box', 'Sleeve Box', 'Mailer Box', 'Display Box', 'Gift Box']

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.clientId || !formData.quantity || !formData.totalAmount || !formData.deadline) {
      alert('Please fill required fields!')
      return
    }
    addOrder({
      ...formData,
      clientId: Number(formData.clientId),
      quantity: Number(formData.quantity),
      totalAmount: Number(formData.totalAmount)
    })
    setFormData({
      clientId: '',
      boxType: 'Rigid Box',
      quantity: '',
      size: '',
      material: '',
      printing: '',
      finishing: '',
      deadline: '',
      totalAmount: ''
    })
    setShowForm(false)
  }

  const getClientName = (id) => {
    const client = clients.find(c => c.id === id)
    return client ? client.name : 'Unknown'
  }

  const getDaysRemaining = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline.split('/').reverse().join('-'))
    return Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
  }

  const formatPKR = (amount) => '₨ ' + Number(amount).toLocaleString('en-PK')

  const statusStyles = {
    'Pending': 'status-chip status-pending',
    'In Production': 'status-chip status-production',
    'Completed': 'status-chip status-completed',
    'Delivered': 'status-chip status-delivered',
    'Fully Paid': 'status-chip status-paid'
  }

  return (
    <div className="page-wrap orders-page">
      {/* Header */}
      <div className="page-head">
        <div className="page-head-copy">
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Track and manage your orders</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${
            showForm
              ? 'btn-muted'
              : 'btn-gold'
          }`}
        >
          {showForm ? '✕ Cancel' : '+ New Order'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="form-panel">
          <h2 className="form-title">New Order</h2>

          {clients.length === 0 ? (
            <div className="empty-inline">
              <p className="warning-text">Please add a client first!</p>
              <Link to="/clients" className="inline-link">
                Go to Clients →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid three-col">
                <div className="field-wrap">
                  <label className="field-label">Client *</label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="field-input"
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Box Type</label>
                  <select
                    name="boxType"
                    value={formData.boxType}
                    onChange={handleChange}
                    className="field-input"
                  >
                    {boxTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="5000"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="10x8x4 inches"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="Art Card 300gsm"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Printing</label>
                  <input
                    type="text"
                    name="printing"
                    value={formData.printing}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="CMYK, Spot UV"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Finishing</label>
                  <input
                    type="text"
                    name="finishing"
                    value={formData.finishing}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="Matte Lamination"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Deadline *</label>
                  <input
                    type="text"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">Total Amount (PKR) *</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="2000000"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary btn-success"
                >
                  ✓ Create Order
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="empty-panel">
          <div className="empty-icon">📦</div>
          <p className="empty-title">No orders yet</p>
          <p className="empty-text">Create your first order to get started</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const daysLeft = getDaysRemaining(order.deadline)
            const isOverdue = daysLeft < 0 && order.status !== 'Delivered'
            const pending = order.totalAmount - order.amountPaid
            const progress = (order.amountPaid / order.totalAmount) * 100

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className={`order-card ${isOverdue ? 'is-overdue' : 'is-normal'}`}
              >
                <div className="order-card-row">
                  {/* Order Info */}
                  <div className="order-info">
                    <div className="order-title-row">
                      <h3 className="order-id-title">
                        Order #{order.id.toString().slice(-4)}
                      </h3>
                      <span className={statusStyles[order.status]}>
                        {order.status}
                      </span>
                    </div>
                    <p className="order-client">{getClientName(order.clientId)}</p>
                    <p className="order-subtext">
                      📦 {order.boxType} • Qty: {order.quantity.toLocaleString()}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="order-amount-wrap">
                    <p className="order-amount">{formatPKR(order.totalAmount)}</p>
                    <div className="progress-wrap">
                      <div className="progress-track progress-sm">
                        <div className="progress-fill progress-green" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="progress-text">{Math.round(progress)}% paid</p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="order-deadline-wrap">
                    <p className={`deadline-badge ${isOverdue ? 'deadline-overdue' : daysLeft <= 7 ? 'deadline-soon' : 'deadline-safe'}`}>
                      {isOverdue ? 'OVERDUE' : `${daysLeft} days`}
                    </p>
                    <p className="deadline-date">Due: {order.deadline}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders

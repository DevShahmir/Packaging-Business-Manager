import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBusiness } from '../context/BusinessContext'

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getOrder, getClient, updateOrderStatus, addPayment, deleteOrder } = useBusiness()

  const [paymentAmount, setPaymentAmount] = useState('')

  const order = getOrder(Number(id))

  if (!order) {
    return (
      <div className="page-wrap order-detail-page order-not-found-wrap">
        <div className="empty-panel">
          <div className="empty-icon">❌</div>
          <p className="warning-text">Order not found!</p>
          <button onClick={() => navigate('/orders')} className="inline-link btn-link-clear">
            ← Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const client = getClient(order.clientId)
  const pending = order.totalAmount - order.amountPaid
  const progress = (order.amountPaid / order.totalAmount) * 100

  const formatPKR = (amount) => '₨ ' + Number(amount).toLocaleString('en-PK')

  const getDaysRemaining = () => {
    const today = new Date()
    const deadline = new Date(order.deadline.split('/').reverse().join('-'))
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  }

  const daysLeft = getDaysRemaining()
  const isOverdue = daysLeft < 0 && order.status !== 'Delivered'

  const handlePayment = (e) => {
    e.preventDefault()
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      alert('Enter valid amount!')
      return
    }
    if (Number(paymentAmount) > pending) {
      alert('Amount exceeds pending balance!')
      return
    }
    addPayment(order.id, paymentAmount)
    setPaymentAmount('')
  }

  const handleDelete = () => {
    if (window.confirm('Delete this order?')) {
      deleteOrder(order.id)
      navigate('/orders')
    }
  }

  const statuses = ['Pending', 'In Production', 'Completed', 'Delivered']

  const statusStyles = {
    'Pending': 'status-chip status-pending status-outline',
    'In Production': 'status-chip status-production status-outline',
    'Completed': 'status-chip status-completed status-outline',
    'Delivered': 'status-chip status-delivered status-outline',
    'Fully Paid': 'status-chip status-paid status-outline'
  }

  return (
    <div className="page-wrap order-detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <button onClick={() => navigate('/orders')} className="inline-link btn-link-clear back-btn">
            ← Back to Orders
          </button>
          <h1 className="page-title">Order #{order.id.toString().slice(-4)}</h1>
          <p className="page-subtitle">Created: {order.createdAt}</p>
        </div>
        <div className="detail-head-actions">
          <span className={statusStyles[order.status]}>
            {order.status}
          </span>
          <button
            onClick={handleDelete}
            className="btn-outline-danger"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left Column */}
        <div className="detail-left-col">
          {/* Client Card */}
          <div className="detail-card client-detail-card">
            <h2 className="detail-card-title">Client Details</h2>
            <div className="client-detail-row">
              <div className="client-detail-avatar">
                {client?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="client-detail-name">{client?.name || 'Unknown'}</p>
                <p className="client-detail-phone">{client?.phone}</p>
                {client?.email && <p className="client-detail-email">{client.email}</p>}
              </div>
            </div>
          </div>

          {/* Specs Card */}
          <div className="detail-card">
            <h2 className="detail-card-title">Order Specifications</h2>
            <div className="spec-grid">
              {[
                { label: 'Box Type', value: order.boxType, icon: '📦' },
                { label: 'Quantity', value: order.quantity.toLocaleString(), icon: '🔢' },
                { label: 'Size', value: order.size || '-', icon: '📐' },
                { label: 'Material', value: order.material || '-', icon: '📄' },
                { label: 'Printing', value: order.printing || '-', icon: '🎨' },
                { label: 'Finishing', value: order.finishing || '-', icon: '✨' }
              ].map((item, i) => (
                <div key={i} className="spec-item">
                  <span className="spec-icon">{item.icon}</span>
                  <p className="spec-label">{item.label}</p>
                  <p className="spec-value">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="detail-card">
            <h2 className="detail-card-title">Payment History</h2>
            {order.payments.length === 0 ? (
              <p className="panel-empty">No payments recorded yet</p>
            ) : (
              <div className="payments-history-list">
                {order.payments.map((p, i) => (
                  <div key={i} className="payment-row">
                    <div className="payment-row-left">
                      <div className="payment-check-wrap">
                        <span>✓</span>
                      </div>
                      <span className="payment-date">{p.date}</span>
                    </div>
                    <span className="payment-amount">+{formatPKR(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Update */}
          <div className="detail-card">
            <h2 className="detail-card-title">Update Status</h2>
            <div className="status-actions">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order.id, status)}
                  className={`status-toggle-btn ${
                    order.status === status
                      ? statusStyles[status]
                      : 'status-toggle-idle'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="detail-right-col">
          {/* Payment Card */}
          <div className="detail-card payment-summary-card">
            <h2 className="detail-card-title center">Payment Summary</h2>

            <div className="summary-total-block">
              <p className="summary-label">Total Amount</p>
              <p className="summary-total">{formatPKR(order.totalAmount)}</p>
            </div>

            <div className="summary-two-cards">
              <div className="summary-chip summary-received">
                <p className="summary-chip-label">Received</p>
                <p className="summary-chip-value">{formatPKR(order.amountPaid)}</p>
              </div>
              <div className="summary-chip summary-pending">
                <p className="summary-chip-label">Pending</p>
                <p className="summary-chip-value">{formatPKR(pending)}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="summary-progress-wrap">
              <div className="progress-track progress-lg">
                <div
                  className="progress-fill progress-gold"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text center">
                {Math.round(progress)}% Paid
              </p>
            </div>

            {/* Add Payment */}
            {pending > 0 && (
              <form onSubmit={handlePayment} className="add-payment-form">
                <label className="field-label center">Add Payment</label>
                <div className="add-payment-row">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="field-input center"
                    placeholder="Amount"
                  />
                  <button
                    type="submit"
                    className="btn-primary btn-success"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Deadline Card */}
          <div className={`detail-card deadline-card ${isOverdue ? 'deadline-card-overdue' : 'deadline-card-normal'}`}>
            <h2 className="detail-card-title center">Deadline</h2>
            <p className="deadline-date-big">{order.deadline}</p>
            <div className={`deadline-note ${isOverdue ? 'deadline-note-overdue' : daysLeft <= 7 ? 'deadline-note-soon' : 'deadline-note-safe'}`}>
              <p className={`deadline-note-text ${isOverdue ? 'deadline-overdue' : daysLeft <= 7 ? 'deadline-soon' : 'deadline-safe'}`}>
                {isOverdue
                  ? `⚠️ ${Math.abs(daysLeft)} days overdue!`
                  : `${daysLeft} days remaining`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

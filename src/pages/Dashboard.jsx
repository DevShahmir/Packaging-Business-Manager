import { useBusiness } from '../context/BusinessContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { clients, orders } = useBusiness()

  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Fully Paid').length
  const totalPending = orders.reduce((sum, o) => sum + (o.totalAmount - o.amountPaid), 0)
  const totalReceived = orders.reduce((sum, o) => sum + o.amountPaid, 0)

  const today = new Date()
  const ordersDueSoon = orders.filter(o => {
    if (o.status === 'Delivered') return false
    const deadline = new Date(o.deadline.split('/').reverse().join('-'))
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    return daysLeft <= 7 && daysLeft >= 0
  })

  const overdueOrders = orders.filter(o => {
    if (o.status === 'Delivered') return false
    const deadline = new Date(o.deadline.split('/').reverse().join('-'))
    return deadline < today
  })

  const recentPayments = orders
    .flatMap(o => o.payments.map(p => ({ ...p, orderId: o.id })))
    .sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')))
    .slice(0, 5)

  const formatPKR = (amount) => '₨ ' + Number(amount).toLocaleString('en-PK')

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="hero-panel">
        <p className="hero-kicker">ROYAL COMMAND CENTER</p>
        <h1 className="hero-title">Dashboard</h1>
        <p className="hero-text">Welcome back. Here is your business overview at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-clients">
          <div className="stat-glow" />
          <div className="stat-icon-wrap">
            <span className="stat-icon">👥</span>
          </div>
          <p className="stat-label">Total Clients</p>
          <p className="stat-value">{clients.length}</p>
        </div>

        <div className="stat-card stat-orders">
          <div className="stat-glow" />
          <div className="stat-icon-wrap">
            <span className="stat-icon">📦</span>
          </div>
          <p className="stat-label">Active Orders</p>
          <p className="stat-value accent-blue">{activeOrders}</p>
        </div>

        <div className="stat-card stat-received">
          <div className="stat-glow" />
          <div className="stat-icon-wrap">
            <span className="stat-icon">💰</span>
          </div>
          <p className="stat-label">Received</p>
          <p className="stat-value money accent-green">{formatPKR(totalReceived)}</p>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-glow" />
          <div className="stat-icon-wrap">
            <span className="stat-icon">⏳</span>
          </div>
          <p className="stat-label">Pending</p>
          <p className="stat-value money accent-rose">{formatPKR(totalPending)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="panel-grid">
        {/* Overdue */}
        <div className="info-panel panel-overdue">
          <div className="panel-head">
            <h2>⚠️ Overdue Orders</h2>
          </div>
          <div className="panel-body">
            {overdueOrders.length === 0 ? (
              <p className="panel-empty">✓ No overdue orders</p>
            ) : (
              <ul className="panel-list">
                {overdueOrders.map(o => (
                  <li key={o.id} className="panel-row">
                    <Link to={`/orders/${o.id}`} className="panel-link">
                      Order #{o.id.toString().slice(-4)}
                    </Link>
                    <span className="panel-date">{o.deadline}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Due This Week */}
        <div className="info-panel panel-due">
          <div className="panel-head">
            <h2>📅 Due This Week</h2>
          </div>
          <div className="panel-body">
            {ordersDueSoon.length === 0 ? (
              <p className="panel-empty">No orders due this week</p>
            ) : (
              <ul className="panel-list">
                {ordersDueSoon.map(o => (
                  <li key={o.id} className="panel-row">
                    <Link to={`/orders/${o.id}`} className="panel-link">
                      Order #{o.id.toString().slice(-4)}
                    </Link>
                    <span className="panel-date">{o.deadline}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="info-panel panel-payments">
          <div className="panel-head">
            <h2>💵 Recent Payments</h2>
          </div>
          <div className="panel-body">
            {recentPayments.length === 0 ? (
              <p className="panel-empty">No payments yet</p>
            ) : (
              <ul className="panel-list">
                {recentPayments.map((p, i) => (
                  <li key={i} className="panel-row">
                    <span className="panel-id">#{p.orderId.toString().slice(-4)}</span>
                    <span className="panel-amount">+{formatPKR(p.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link
          to="/clients"
          className="action-btn btn-dark"
        >
          + Add Client
        </Link>
        <Link
          to="/orders"
          className="action-btn btn-gold"
        >
          + New Order
        </Link>
      </div>
    </div>
  )
}

export default Dashboard

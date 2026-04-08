import { createContext, useContext, useState, useEffect } from 'react'

// Create context to share data across all pages
const BusinessContext = createContext()

// Custom hook to use context easily
export const useBusiness = () => useContext(BusinessContext)

// Provider component wraps the app
export const BusinessProvider = ({ children }) => {
  // CLIENTS STATE - load from localStorage
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('clients')
    return saved ? JSON.parse(saved) : []
  })

  // ORDERS STATE - load from localStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders')
    return saved ? JSON.parse(saved) : []
  })

  // Save clients to localStorage when changed
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  // Save orders to localStorage when changed
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // ADD CLIENT
  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now(), // unique ID
      createdAt: new Date().toLocaleDateString('en-GB')
    }
    setClients([...clients, newClient])
  }

  // DELETE CLIENT
  const deleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id))
  }

  // ADD ORDER
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      payments: [], // payment history
      amountPaid: 0,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString('en-GB')
    }
    setOrders([...orders, newOrder])
  }

  // UPDATE ORDER STATUS
  const updateOrderStatus = (id, status) => {
    setOrders(orders.map(o =>
      o.id === id ? { ...o, status } : o
    ))
  }

  // ADD PAYMENT TO ORDER
  const addPayment = (orderId, amount) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const newPayment = {
          amount: Number(amount),
          date: new Date().toLocaleDateString('en-GB')
        }
        const newAmountPaid = o.amountPaid + Number(amount)
        return {
          ...o,
          payments: [...o.payments, newPayment],
          amountPaid: newAmountPaid,
          status: newAmountPaid >= o.totalAmount ? 'Fully Paid' : o.status
        }
      }
      return o
    }))
  }

  // DELETE ORDER
  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id))
  }

  // Get client by ID
  const getClient = (id) => clients.find(c => c.id === id)

  // Get order by ID
  const getOrder = (id) => orders.find(o => o.id === id)

  // Values to share
  const value = {
    clients,
    orders,
    addClient,
    deleteClient,
    addOrder,
    updateOrderStatus,
    addPayment,
    deleteOrder,
    getClient,
    getOrder
  }

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  )
}

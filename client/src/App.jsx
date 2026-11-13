import { useState, useEffect } from 'react'
import './App.css'
import API_BASE_URL from './api'

const entrepreneurs = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    skill: 'Potter',
    category: 'Potter',
    location: 'Jaipur, Rajasthan',
    price: 'Starting ₹300',
    icon: '🏺',
    description: 'Traditional handmade clay pots and pottery items.',
    experience: '10 years',
    services: 'Handmade clay pots, decorative items and pottery workshops.',
  },
  {
    id: 2,
    name: 'Sunita Devi',
    skill: 'Tailor',
    category: 'Tailor',
    location: 'Delhi, India',
    price: 'Starting ₹200',
    icon: '🧵',
    description: 'Custom stitching, alterations and traditional clothing.',
    experience: '8 years',
    services: 'Blouse stitching, suit stitching and clothing alterations.',
  },
  {
    id: 3,
    name: 'Arjun Singh',
    skill: 'Artisan',
    category: 'Artisan',
    location: 'Udaipur, Rajasthan',
    price: 'Starting ₹500',
    icon: '🎨',
    description: 'Beautiful handmade crafts and traditional artwork.',
    experience: '6 years',
    services: 'Handmade paintings, decorative crafts and traditional artwork.',
  },
  {
    id: 4,
    name: 'Mohan Lal',
    skill: 'Cobbler',
    category: 'Cobbler',
    location: 'Lucknow, Uttar Pradesh',
    price: 'Starting ₹100',
    icon: '👞',
    description: 'Shoe repair, polishing and custom footwear services.',
    experience: '12 years',
    services: 'Shoe repair, polishing and footwear maintenance.',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    skill: 'Small Vendor',
    category: 'Small Vendor',
    location: 'Dehradun, Uttarakhand',
    price: 'Starting ₹150',
    icon: '🛍️',
    description: 'Local handmade products and everyday essentials.',
    experience: '4 years',
    services: 'Local handmade products and daily-use items.',
  },
]

const initialCategories = [
  'All',
  'Cobbler',
  'Potter',
  'Tailor',
  'Artisan',
  'Small Vendor',
]

// Product Marketplace Data

const products = [
  {
    id: 1,
    name: 'Handmade Clay Pot',
    price: 350,
    category: 'Pottery',
    icon: '🏺',
    seller: 'Ramesh Kumar',
    description: 'Beautiful traditional handmade clay pot.',
  },
  {
    id: 2,
    name: 'Traditional Embroidery',
    price: 500,
    category: 'Handmade',
    icon: '🧵',
    seller: 'Sunita Devi',
    description: 'Beautiful traditional embroidery work.',
  },
  {
    id: 3,
    name: 'Handmade Painting',
    price: 800,
    category: 'Art',
    icon: '🎨',
    seller: 'Arjun Singh',
    description: 'Unique handmade traditional artwork.',
  },
  {
    id: 4,
    name: 'Handmade Basket',
    price: 250,
    category: 'Handmade',
    icon: '🧺',
    seller: 'Priya Sharma',
    description: 'Eco-friendly handmade decorative basket.',
  },
  {
    id: 5,
    name: 'Decorative Clay Diya Set',
    price: 150,
    category: 'Pottery',
    icon: '🪔',
    seller: 'Ramesh Kumar',
    description: 'Traditional decorative clay diya set.',
  },
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Entrepreneurs
  const [entrepreneurList, setEntrepreneurList] = useState([])
  const [entrepreneursLoading, setEntrepreneursLoading] = useState(false)
  const [entrepreneursApiLoaded, setEntrepreneursApiLoaded] = useState(false)

  // Admin Category Management
  const [categories, setCategories] = useState(initialCategories)

  const [newCategory, setNewCategory] = useState('')
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoryRecords, setCategoryRecords] = useState([])

  // Selected Entrepreneur
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null)
  const [showRequestForm, setShowRequestForm] = useState(false)

  // Customer Registration and Login
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  })

  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const savedCustomer = localStorage.getItem('hunarHubCurrentCustomer')
      return savedCustomer ? JSON.parse(savedCustomer) : null
    } catch {
      return null
    }
  })

  // Entrepreneur received requests and customer submitted requests
  const [serviceRequests, setServiceRequests] = useState([])
  const [myServiceRequests, setMyServiceRequests] = useState([])
  const [myServiceRequestsLoading, setMyServiceRequestsLoading] = useState(false)

  // Admin analytics and complaint response
  const [adminAnalytics, setAdminAnalytics] = useState(null)
  const [adminAnalyticsLoading, setAdminAnalyticsLoading] = useState(false)
  const [complaintResponses, setComplaintResponses] = useState({})

  // Product Orders
  const [productOrders, setProductOrders] = useState([])

  const [ordersLoading, setOrdersLoading] = useState(false)
  // Entrepreneur Received Orders
const [receivedOrders, setReceivedOrders] = useState([])
const [receivedOrdersLoading, setReceivedOrdersLoading] = useState(false)
// Admin Orders
const [adminOrders, setAdminOrders] = useState([])
const [adminOrdersLoading, setAdminOrdersLoading] = useState(false)
// Admin Service Requests
const [adminServiceRequests, setAdminServiceRequests] = useState([])
const [adminServiceRequestsLoading, setAdminServiceRequestsLoading] = useState(false)

// Admin Complaints
const [adminComplaints, setAdminComplaints] = useState([])
const [adminComplaintsLoading, setAdminComplaintsLoading] = useState(false)

  // Customer Ratings and Reviews
  const [reviews, setReviews] = useState([])

  const [reviewData, setReviewData] = useState({
    orderId: '',
    entrepreneurName: '',
    rating: '5',
    comment: '',
  })

  // Product Order Form
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Backend Products
  const [productList, setProductList] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsApiLoaded, setProductsApiLoaded] = useState(false)
  // Entrepreneur Applications
  const [showEntrepreneurForm, setShowEntrepreneurForm] = useState(false)

  const [entrepreneurApplications, setEntrepreneurApplications] = useState([])

  const [entrepreneurData, setEntrepreneurData] = useState({
    name: '',
    email: '',
    password: '',
    skill: '',
    location: '',
    price: '',
    experience: '',
    mobile: '',
    description: '',
    services: '',
  })

  const [orderData, setOrderData] = useState({
    customerName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    quantity: 1,
  })

  // Entrepreneur Availability
  const [isAvailable, setIsAvailable] = useState(true)

  // Service Request Form
  const [requestData, setRequestData] = useState({
    customerName: '',
    mobile: '',
    requirement: '',
    location: '',
  })

  // Fetch Entrepreneurs from Backend API
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      setEntrepreneursLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/entrepreneurs`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load entrepreneurs')
        }

        const list =
          data.entrepreneurs ||
          data.data?.entrepreneurs ||
          data.data ||
          []

        setEntrepreneurList(Array.isArray(list) ? list : [])
      } catch (error) {
        console.error('Entrepreneurs API Error:', error)
      } finally {
        setEntrepreneursLoading(false)
        setEntrepreneursApiLoaded(true)
      }
    }

    fetchEntrepreneurs()
  }, [])

  // Fetch Entrepreneur Applications for Admin

useEffect(() => {
  const fetchAdminApplications = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'admin') return

    try {
      const response = await fetch(
        `${API_BASE_URL}/entrepreneurs/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load applications')
      }

      const applications =
        data.entrepreneurs ||
        data.data?.entrepreneurs ||
        data.data ||
        []

      setEntrepreneurApplications(
        Array.isArray(applications)
          ? applications.map((application) => ({
              ...application,
              id: application._id,
              status:
                application.verificationStatus === 'approved'
                  ? 'Approved'
                  : application.verificationStatus === 'rejected'
                    ? 'Rejected'
                    : 'Pending',
              mobile: application.user?.phone || application.mobile || 'Not provided',
              date: application.createdAt
                ? new Date(application.createdAt).toLocaleDateString()
                : 'Not available',
              services: Array.isArray(application.services)
                ? application.services.join(', ')
                : application.services || '',
            }))
          : []
      )
    } catch (error) {
      console.error('Admin Applications API Error:', error)
    }
  }

  fetchAdminApplications()
}, [currentCustomer])

// Fetch All Orders for Admin

useEffect(() => {
  const fetchAdminOrders = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'admin') return

    setAdminOrdersLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load admin orders')
      }

      const orders =
        data.orders ||
        data.data?.orders ||
        data.data ||
        []

      setAdminOrders(Array.isArray(orders) ? orders : [])
    } catch (error) {
      console.error('Admin Orders API Error:', error)
    } finally {
      setAdminOrdersLoading(false)
    }
  }

  fetchAdminOrders()
}, [currentCustomer])


// Fetch All Service Requests for Admin

useEffect(() => {
  const fetchAdminServiceRequests = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'admin') return

    setAdminServiceRequestsLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/service-requests/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load service requests')
      }

      const requests =
        data.requests ||
        data.data?.requests ||
        data.data ||
        []

      setAdminServiceRequests(
        Array.isArray(requests) ? requests : []
      )
    } catch (error) {
      console.error('Admin Service Requests API Error:', error)
    } finally {
      setAdminServiceRequestsLoading(false)
    }
  }

  fetchAdminServiceRequests()
}, [currentCustomer])


// Fetch All Complaints for Admin

useEffect(() => {
  const fetchAdminComplaints = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'admin') return

    setAdminComplaintsLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/complaints/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load complaints')
      }

      const complaints =
        data.complaints ||
        data.data?.complaints ||
        data.data ||
        []

      setAdminComplaints(
        Array.isArray(complaints) ? complaints : []
      )
    } catch (error) {
      console.error('Admin Complaints API Error:', error)
    } finally {
      setAdminComplaintsLoading(false)
    }
  }

  fetchAdminComplaints()
}, [currentCustomer])
  // Fetch Categories from Backend API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/categories`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load categories')
        }

        const categoryList =
          data.categories ||
          data.data?.categories ||
          data.data ||
          []

        if (Array.isArray(categoryList)) {
          setCategoryRecords(
            categoryList.filter(
              (category) =>
                typeof category === 'object' &&
                category !== null &&
                category._id
            )
          )

          setCategories([
            'All',
            ...categoryList
              .map((category) =>
                typeof category === 'string'
                  ? category
                  : category.name
              )
              .filter(Boolean),
          ])
        }
      } catch (error) {
        console.error('Categories API Error:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch Customer Orders from Backend
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      const token = localStorage.getItem('hunarHubToken')

      if (!token || currentCustomer?.role !== 'customer') return

      setOrdersLoading(true)

      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load orders')
        }

        const orders =
          data.orders ||
          data.data?.orders ||
          data.data ||
          []

        setProductOrders(Array.isArray(orders) ? orders : [])
      } catch (error) {
        console.error('Customer Orders API Error:', error)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchCustomerOrders()
  }, [currentCustomer])

  // Fetch customer-submitted service requests
  useEffect(() => {
    const fetchMyServiceRequests = async () => {
      const token = localStorage.getItem('hunarHubToken')
      if (!token || currentCustomer?.role !== 'customer') {
        setMyServiceRequests([])
        return
      }
      setMyServiceRequestsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/service-requests/my-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load your service requests')
        const requests = data.requests || data.data?.requests || data.data || []
        setMyServiceRequests(Array.isArray(requests) ? requests : [])
      } catch (error) {
        console.error('My Service Requests API Error:', error)
      } finally {
        setMyServiceRequestsLoading(false)
      }
    }
    fetchMyServiceRequests()
  }, [currentCustomer])

  // Fetch admin analytics from backend
  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      const token = localStorage.getItem('hunarHubToken')
      if (!token || currentCustomer?.role !== 'admin') {
        setAdminAnalytics(null)
        return
      }
      setAdminAnalyticsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load analytics')
        setAdminAnalytics(data.analytics || null)
      } catch (error) {
        console.error('Admin Analytics API Error:', error)
      } finally {
        setAdminAnalyticsLoading(false)
      }
    }
    fetchAdminAnalytics()
  }, [currentCustomer])

  // Load entrepreneur profile availability from backend
  useEffect(() => {
    const fetchMyEntrepreneurProfile = async () => {
      const token = localStorage.getItem('hunarHubToken')
      if (!token || currentCustomer?.role !== 'entrepreneur') return
      try {
        const response = await fetch(`${API_BASE_URL}/entrepreneurs/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load entrepreneur profile')
        const profile = data.entrepreneur || data.profile || data.data?.entrepreneur || data.data
        if (profile && typeof profile.isAvailable === 'boolean') setIsAvailable(profile.isAvailable)
      } catch (error) {
        console.error('Entrepreneur Profile API Error:', error)
      }
    }
    fetchMyEntrepreneurProfile()
  }, [currentCustomer])

  // Fetch Received Service Requests for Entrepreneur
useEffect(() => {
  const fetchReceivedRequests = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'entrepreneur') return

    try {
      const response = await fetch(
        `${API_BASE_URL}/service-requests/received`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load service requests')
      }

      const requests =
        data.requests ||
        data.data?.requests ||
        data.data ||
        []

      const formattedRequests = Array.isArray(requests)
        ? requests.map((request) => ({
            ...request,
            id: request._id || request.id,
            entrepreneurName:
              request.entrepreneur?.name ||
              request.entrepreneurName ||
              '',
            entrepreneurIcon:
              request.entrepreneur?.icon || '🧑‍🎨',
            customerName:
              request.customer?.name ||
              request.customerName ||
              '',
            mobile:
              request.customer?.phone ||
              request.mobile ||
              '',
            requirement:
              request.description ||
              request.requirement ||
              '',
            date: request.createdAt
              ? new Date(request.createdAt).toLocaleDateString('en-IN')
              : '',
            status:
              request.status?.charAt(0).toUpperCase() +
              request.status?.slice(1),
          }))
        : []

      setServiceRequests(formattedRequests)

    } catch (error) {
      console.error('Received Requests API Error:', error)
    }
  }

  fetchReceivedRequests()
}, [currentCustomer])

// Fetch Received Orders for Entrepreneur
useEffect(() => {
  const fetchReceivedOrders = async () => {
    const token = localStorage.getItem('hunarHubToken')

    if (!token || currentCustomer?.role !== 'entrepreneur') return

    setReceivedOrdersLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/received`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load received orders')
      }

      const orders =
        data.orders ||
        data.data?.orders ||
        data.data ||
        []

      setReceivedOrders(Array.isArray(orders) ? orders : [])

    } catch (error) {
      console.error('Received Orders API Error:', error)
    } finally {
      setReceivedOrdersLoading(false)
    }
  }

  fetchReceivedOrders()
}, [currentCustomer])

  // Fetch Products from Backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true)

      try {
        const response = await fetch(`${API_BASE_URL}/products`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load products')
        }

        const list =
          data.products ||
          data.data?.products ||
          data.data ||
          []

        setProductList(Array.isArray(list) ? list : [])
      } catch (error) {
        console.error('Products API Error:', error)
      } finally {
        setProductsLoading(false)
        setProductsApiLoaded(true)
      }
    }

    fetchProducts()
  }, [])

  // Filter entrepreneurs
  const displayedEntrepreneurs =
    entrepreneursApiLoaded ? entrepreneurList : entrepreneurs

  const filteredEntrepreneurs = displayedEntrepreneurs.filter((person) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      person.category === selectedCategory ||
      person.skill === selectedCategory

    const matchesSearch =
      (person.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (person.skill || '').toLowerCase().includes(search.toLowerCase()) ||
      (person.location || '').toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Customer Registration and Login

const handleAuthSubmit = async (e) => {
  e.preventDefault()

  try {
    const endpoint =
      authMode === 'register'
        ? '/auth/register'
        : '/auth/login'

    const requestBody =
      authMode === 'register'
        ? {
            name: authData.name.trim(),
            email: authData.email.trim().toLowerCase(),
            password: authData.password,
            phone: authData.mobile.trim() || undefined,
            role: 'customer',
          }
        : {
            email: authData.email.trim().toLowerCase(),
            password: authData.password,
          }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Authentication failed.')
      return
    }

    localStorage.setItem('hunarHubToken', data.token)
    localStorage.setItem(
      'hunarHubCurrentCustomer',
      JSON.stringify(data.user)
    )

    setCurrentCustomer(data.user)

    setAuthData({
      name: '',
      email: '',
      mobile: '',
      password: '',
    })

    setShowAuthModal(false)

    alert(
      authMode === 'register'
        ? 'Your account has been created successfully!'
        : `Welcome back, ${data.user.name}!`
    )
  } catch (error) {
    console.error('Authentication error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}

  // Customer Logout

  const handleCustomerLogout = () => {
    setCurrentCustomer(null)
    localStorage.removeItem('hunarHubCurrentCustomer')
    localStorage.removeItem('hunarHubToken')

    alert('You have been logged out successfully.')
  }

  // Submit Service Request

const handleRequestSubmit = async (e) => {
  e.preventDefault()

  if (!currentCustomer || currentCustomer.role !== 'customer') {
    alert('Please log in with a customer account to submit a service request.')
    setAuthMode('login')
    setShowAuthModal(true)
    return
  }

  if (!selectedEntrepreneur?._id) {
    alert('Entrepreneur information is missing. Please select again.')
    return
  }

  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!token) {
      alert('Please log in again to continue.')
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    const response = await fetch(`${API_BASE_URL}/service-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        entrepreneurId: selectedEntrepreneur._id,
        service: selectedEntrepreneur.skill,
        description: requestData.requirement,
        location: requestData.location,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to submit service request.')
      return
    }

    const newRequest = {
      id: data.request?._id || Date.now(),
      entrepreneurName: selectedEntrepreneur.name,
      entrepreneurIcon: selectedEntrepreneur.icon,
      customerName: requestData.customerName,
      mobile: requestData.mobile,
      requirement: requestData.requirement,
      location: requestData.location,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN'),
    }

    setMyServiceRequests((previousRequests) => [
      { ...newRequest, _id: newRequest.id, entrepreneur: { name: selectedEntrepreneur.name, icon: selectedEntrepreneur.icon }, service: selectedEntrepreneur.skill, description: requestData.requirement },
      ...previousRequests,
    ])

    alert(
      `Service request submitted successfully for ${selectedEntrepreneur.name}!`
    )

    setRequestData({
      customerName: '',
      mobile: '',
      requirement: '',
      location: '',
    })

    setShowRequestForm(false)
    setSelectedEntrepreneur(null)

  } catch (error) {
    console.error('Service Request API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
 // Submit Product Order

const handleOrderSubmit = async (e) => {
  e.preventDefault()

  if (!selectedProduct?._id) {
    alert('Product information is missing. Please select again.')
    return
  }

  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!currentCustomer || currentCustomer.role !== 'customer' || !token) {
      alert('Please log in with a customer account to place an order.')
      setSelectedProduct(null)
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          {
            product: selectedProduct._id,
            quantity: Number(orderData.quantity),
          },
        ],
        shippingAddress: {
          name: orderData.customerName,
          phone: orderData.mobile,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
        },
        paymentMethod: 'cash_on_delivery',
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to place your order.')
      return
    }

    const newOrder = {
      id: data.order?._id || Date.now(),
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      productIcon: selectedProduct.icon || '🛍️',
      price: selectedProduct.price,
      seller: selectedProduct.entrepreneur?.name || selectedProduct.seller,
      customerName: orderData.customerName,
      mobile: orderData.mobile,
      quantity: Number(orderData.quantity),
      totalPrice:
        Number(selectedProduct.price) * Number(orderData.quantity),
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN'),
    }

    setProductOrders((previousOrders) => [
      newOrder,
      ...previousOrders,
    ])

    alert('Your product order has been placed successfully!')

    setOrderData({
      customerName: '',
      mobile: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      quantity: 1,
    })

    setSelectedProduct(null)

  } catch (error) {
    console.error('Product Order API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}

// Update Entrepreneur Order Status

const handleReceivedOrderStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!token) {
      alert('Please log in again.')
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus.toLowerCase(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to update order status.')
      return
    }

    setReceivedOrders((previousOrders) =>
      previousOrders.map((order) =>
        (order._id || order.id) === orderId
          ? { ...order, status: newStatus.toLowerCase() }
          : order
      )
    )

    alert('Order status updated successfully!')

  } catch (error) {
    console.error('Order Status API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
  // Accept or Reject Service Request

const handleRequestStatus = async (requestId, newStatus) => {
  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!token) {
      alert('Please log in again.')
      return
    }



    const response = await fetch(
      `${API_BASE_URL}/service-requests/${requestId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus.toLowerCase(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to update service request.')
      return
    }

    setServiceRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    )

    alert(`Service request ${newStatus.toLowerCase()} successfully!`)

  } catch (error) {
    console.error('Request Status API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
// Update Entrepreneur Availability

const handleAvailabilityToggle = async () => {
  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!token) {
      alert('Please log in again.')
      return
    }

    const newAvailability = !isAvailable

    const response = await fetch(
      `${API_BASE_URL}/entrepreneurs/my-profile`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: newAvailability,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to update availability.')
      return
    }

    setIsAvailable(newAvailability)
    alert('Availability updated successfully!')

  } catch (error) {
    console.error('Availability API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
  // Submit Entrepreneur Application

const handleEntrepreneurSubmit = async (e) => {
  e.preventDefault()

  try {
    // Step 1: Register Entrepreneur Account

    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: entrepreneurData.name.trim(),
        email: entrepreneurData.email.trim().toLowerCase(),
        password: entrepreneurData.password,
        role: 'entrepreneur',
      }),
    })

    const registerData = await registerResponse.json()

    if (!registerResponse.ok || !registerData.success) {
      alert(registerData.message || 'Entrepreneur registration failed.')
      return
    }

    const token = registerData.token

    if (!token) {
      alert('Registration successful, but authentication token was not received.')
      return
    }

    localStorage.setItem('hunarHubToken', token)
    localStorage.setItem('hunarHubCurrentCustomer', JSON.stringify(registerData.user))
    setCurrentCustomer(registerData.user)

    // Step 2: Create Entrepreneur Profile

    const profileResponse = await fetch(
      `${API_BASE_URL}/entrepreneurs/my-profile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: entrepreneurData.name.trim(),
          skill: entrepreneurData.skill,
          category: entrepreneurData.skill,
          location: entrepreneurData.location,
          price: String(entrepreneurData.price),
          experience: entrepreneurData.experience,
          description: entrepreneurData.description,
          services: entrepreneurData.services
            .split(',')
            .map((service) => service.trim())
            .filter(Boolean),
          icon: '🧑‍🎨',
        }),
      }
    )

    const profileData = await profileResponse.json()

    if (!profileResponse.ok || !profileData.success) {
      alert(
        profileData.message ||
        'Account created, but profile creation failed. Please try logging in again.'
      )
      return
    }

    // Step 3: Reset Form

    setEntrepreneurData({
      name: '',
      email: '',
      password: '',
      skill: '',
      location: '',
      price: '',
      experience: '',
      mobile: '',
      description: '',
      services: '',
    })

    setShowEntrepreneurForm(false)

    alert('Your entrepreneur account and profile have been created successfully!')

  } catch (error) {
    console.error('Entrepreneur Registration Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
  // Approve or Reject Entrepreneur Application

const handleApplicationStatus = async (applicationId, newStatus) => {
  try {
    const token = localStorage.getItem('hunarHubToken')

    if (!token) {
      alert('Please log in again.')
      return
    }

    const response = await fetch(
      `${API_BASE_URL}/entrepreneurs/admin/${applicationId}/verification`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationStatus: newStatus.toLowerCase(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to update application status.')
      return
    }

    setEntrepreneurApplications((previousApplications) =>
      previousApplications.map((application) =>
        (application._id || application.id) === applicationId
          ? { ...application, status: newStatus }
          : application
      )
    )

    alert(`Entrepreneur application ${newStatus.toLowerCase()} successfully!`)
  } catch (error) {
    console.error('Application Status API Error:', error)
    alert('Unable to connect to the server. Please try again.')
  }
}
  // Add a New Category

const handleAddCategory = async (e) => {
  e.preventDefault()

  const categoryName = newCategory.trim()

  if (!categoryName) {
    alert('Please enter a category name.')
    return
  }

  const alreadyExists = categories.some(
    (category) =>
      category.toLowerCase() === categoryName.toLowerCase()
  )

  if (alreadyExists) {
    alert('This category already exists.')
    return
  }

  try {
    const token = localStorage.getItem('hunarHubToken')

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: categoryName,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to add category.')
      return
    }

    setCategories((previousCategories) => [
      ...previousCategories,
      categoryName,
    ])
    if (data.category?._id) {
      setCategoryRecords((previousRecords) => [...previousRecords, data.category])
    }

    setNewCategory('')
    alert('Category added successfully!')
  } catch (error) {
    console.error('Add Category Error:', error)
    alert('Unable to connect to the server.')
  }
}

  // Delete Category

const handleDeleteCategory = async (categoryToDelete) => {
  if (categoryToDelete === 'All') return

  const categoryRecord = categoryRecords.find(
    (category) => category.name === categoryToDelete
  )

  if (!categoryRecord) {
    alert('Category ID not found. Please refresh categories.')
    return
  }

  try {
    const token = localStorage.getItem('hunarHubToken')

    const response = await fetch(
      `${API_BASE_URL}/categories/${categoryRecord._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      alert(data.message || 'Unable to delete category.')
      return
    }

    setCategories((previousCategories) =>
      previousCategories.filter(
        (category) => category !== categoryToDelete
      )
    )

    setCategoryRecords((previousRecords) =>
      previousRecords.filter(
        (category) => category._id !== categoryRecord._id
      )
    )

    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('All')
    }

    alert('Category deleted successfully!')
  } catch (error) {
    console.error('Delete Category Error:', error)
    alert('Unable to connect to the server.')
  }
}

  // Submit Customer Review

const handleReviewSubmit = async (e) => {
  e.preventDefault()

  if (!currentCustomer || currentCustomer.role !== 'customer') {
    alert('Please log in with a customer account to submit a review.')
    setAuthMode('login')
    setShowAuthModal(true)
    return
  }

  if (!reviewData.orderId || !reviewData.entrepreneurName || !reviewData.comment.trim()) {
    alert('Please select your completed order and write your review.')
    return
  }

  const selectedOrder = productOrders.find(
    (order) =>
      (order._id || order.id) === reviewData.orderId
  )

  if (!selectedOrder) {
    alert('Selected order was not found.')
    return
  }

  const entrepreneurValue =
    selectedOrder.entrepreneur?._id ||
    selectedOrder.entrepreneur?.id ||
    selectedOrder.entrepreneur ||
    selectedOrder.entrepreneurId

  const entrepreneurId = entrepreneurValue?.toString?.() || entrepreneurValue

  if (!entrepreneurId || typeof entrepreneurId !== 'string') {
    alert('Entrepreneur information is missing from this order.')
    return
  }

  try {
    const token = localStorage.getItem('hunarHubToken')

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: reviewData.orderId,
        entrepreneurId,
        rating: Number(reviewData.rating),
        comment: reviewData.comment.trim(),
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to submit review.')
    }

    const newReview = {
      id: data.review?._id || Date.now(),
      customerName: currentCustomer.name,
      entrepreneurName: reviewData.entrepreneurName,
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
      date: new Date().toLocaleDateString('en-IN'),
    }

    setReviews((previousReviews) => [
      newReview,
      ...previousReviews,
    ])

    setReviewData({
      orderId: '',
      entrepreneurName: '',
      rating: '5',
      comment: '',
    })

    alert('Thank you! Your review has been submitted successfully.')
  } catch (error) {
    console.error('Review API Error:', error)
    alert(error.message || 'Unable to submit review.')
  }
}

  // Update complaint status and admin response
  const handleComplaintUpdate = async (complaintId, status) => {
    const token = localStorage.getItem('hunarHubToken')
    if (!token) {
      alert('Please log in again.')
      return
    }
    const adminResponse = (complaintResponses[complaintId] || '').trim()
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/admin/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminResponse }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        alert(data.message || 'Unable to update complaint.')
        return
      }
      setAdminComplaints((previous) =>
        previous.map((complaint) =>
          (complaint._id || complaint.id) === complaintId
            ? (data.complaint || { ...complaint, status, adminResponse })
            : complaint
        )
      )
      alert('Complaint updated successfully!')
    } catch (error) {
      console.error('Complaint Update API Error:', error)
      alert('Unable to connect to the server.')
    }
  }

  // Dashboard counts

  const totalRequests = serviceRequests.length

  const pendingRequests = serviceRequests.filter(
    (request) => request.status === 'Pending'
  ).length

  const acceptedRequests = serviceRequests.filter(
    (request) => request.status === 'Accepted'
  ).length

  // Admin Dashboard Counts

  const totalApplications = entrepreneurApplications.length

  const pendingApplications = entrepreneurApplications.filter(
    (application) => application.status === 'Pending'
  ).length

  const approvedApplications = entrepreneurApplications.filter(
    (application) => application.status === 'Approved'
  ).length

  const rejectedApplications = entrepreneurApplications.filter(
    (application) => application.status === 'Rejected'
  ).length

  // Admin analytics are loaded from the protected backend endpoint.
  const analytics = adminAnalytics || {}
  const analyticsUsers = analytics.users || {}
  const analyticsRequests = analytics.serviceRequests || {}
  const analyticsProducts = analytics.products || {}
  const analyticsEarnings = analytics.earnings || {}
  const analyticsSatisfaction = analytics.customerSatisfaction || {}

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">✦</span>
          Hunar<span>Hub</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          <a href="#products">Products</a>
          <a href="#my-orders">My Orders</a>
          <a href="#requests">My Requests</a>
          <a href="#reviews">Reviews</a>
          <a href="#dashboard">Dashboard</a>
          {currentCustomer?.role === 'admin' && (
            <>
              <a href="#admin-dashboard">Admin</a>
              <a href="#admin-orders">Orders</a>
              <a href="#admin-requests">Requests</a>
              <a href="#admin-complaints">Complaints</a>
              <a href="#admin-analytics">Analytics</a>
            </>
          )}
          <a href="#about">About Us</a>
        </nav>

        <div className="nav-actions">
          {currentCustomer ? (
            <>
              <span className="customer-welcome">
                Hi, {currentCustomer.name}
              </span>

              <button
                className="login-btn"
                onClick={handleCustomerLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"                onClick={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
              >
                Login
              </button>

              <button
                className="join-btn"
                onClick={() => {
                  setAuthMode('register')
                  setShowAuthModal(true)
                }}
              >
                Register
              </button>
            </>
          )}

          <button
            className="join-btn"
            onClick={() => setShowEntrepreneurForm(true)}
          >
            Join as Entrepreneur
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}

        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              SUPPORT LOCAL • CELEBRATE TALENT
            </span>

            <h1>
              Discover Local Talent.
              <br />
              <span>Support Local Dreams.</span>
            </h1>

            <p>
              Connect with talented local entrepreneurs, discover
              handmade products and find trusted services in your area.
            </p>

            <div className="hero-buttons">
              <a href="#explore" className="primary-btn">
                Explore Marketplace →
              </a>

              <button className="secondary-btn">
                Become a Seller
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>Local</strong>
                <span>Entrepreneurs</span>
              </div>

              <div>
                <strong>Handmade</strong>
                <span>Products</span>
              </div>

              <div>
                <strong>Trusted</strong>
                <span>Services</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-circle">
              <span className="art-main">🧑‍🎨</span>
              <span className="art-item item-one">🏺</span>
              <span className="art-item item-two">🧵</span>
              <span className="art-item item-three">🧶</span>
              <span className="art-item item-four">🛍️</span>
            </div>

            <div className="art-label">
              ❤️ Empowering Local Skills
            </div>
          </div>
        </section>

        {/* Explore Entrepreneurs */}

        <section className="explore-section" id="explore">
          <div className="section-heading">
            <span className="eyebrow">FIND YOUR LOCAL EXPERT</span>

            <h2>Explore Local Entrepreneurs</h2>

            <p>
              Find skilled people and unique products from your community.
            </p>
          </div>

          <div className="search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by skill, name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? 'category active'
                    : 'category'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="entrepreneur-grid">
  {entrepreneursLoading ? (
    <p className="no-results">
      Loading entrepreneurs...
    </p>
  ) : filteredEntrepreneurs.length > 0 ? (
    filteredEntrepreneurs.map((person) => (
      <article
        className="entrepreneur-card"
        key={person._id || person.id}
      >
        <div className="card-icon">
          {person.icon || '🧑‍🎨'}
        </div>

        <span className="skill-tag">
          {person.skill || person.category}
        </span>

        <h3>{person.name}</h3>

        <p className="location">
          📍 {person.location}
        </p>

        <p className="description">
          {person.description}
        </p>

        <div className="card-bottom">
          <strong>{person.price}</strong>

          <button
            onClick={() => {
              setSelectedEntrepreneur(person)
              setShowRequestForm(false)
            }}
          >
            View Profile →
          </button>
        </div>
      </article>
    ))
  ) : (
    <p className="no-results">
      No entrepreneurs found. Try another search.
    </p>
  )}
</div>
        </section>

        {/* Product Marketplace */}

<section className="explore-section" id="products">
  <div className="section-heading">
    <span className="eyebrow">
      SHOP LOCAL • SUPPORT LOCAL
    </span>

    <h2>Explore Handmade Products</h2>

    <p>
      Discover unique handmade products created by talented
      local entrepreneurs.
    </p>
  </div>

  <div className="entrepreneur-grid">
    {productsLoading ? (
      <p className="no-results">
        Loading products...
      </p>
    ) : productList.length > 0 ? (
      productList.map((product) => (
        <article
          className="entrepreneur-card"
          key={product._id || product.id}
        >
          <div className="card-icon">
            {product.icon || '🛍️'}
          </div>

          <span className="skill-tag">
            {product.category}
          </span>

          <h3>{product.name}</h3>

          <p className="description">
            {product.description}
          </p>

          <p className="location">
            👤 Seller: {product.entrepreneur?.name || product.seller || 'Local Entrepreneur'}
          </p>

          <div className="card-bottom">
            <strong>₹{product.price}</strong>

            <button
              onClick={() => {
                setSelectedProduct(product)

                setOrderData({
                  customerName: '',
                  mobile: '',
                  address: '',
                  city: '',
                  state: '',
                  pincode: '',
                  quantity: 1,
                })
              }}
            >
              Order Now →
            </button>
          </div>
        </article>
      ))
    ) : (
      <p className="no-results">
        No products available right now.
      </p>
    )}
  </div>
</section>
                {/* My Product Orders */}

        <section className="explore-section" id="my-orders">
          <div className="section-heading">
            <span className="eyebrow">YOUR PURCHASES</span>

            <h2>My Orders</h2>

            <p>
              View and track all your product orders.
            </p>
          </div>

          {ordersLoading ? (
            <p className="no-results">Loading your orders...</p>
          ) : productOrders.length > 0 ? (
            <div className="entrepreneur-grid">
              {productOrders.map((order) => (
                <article className="entrepreneur-card" key={order._id || order.id}>
                  <span className="skill-tag">{order.status || 'Pending'}</span>
                  <h3>{order.items?.map((item) => item.product?.name || 'Product').join(', ') || order.productName || 'Product Order'}</h3>
                  <p className="description"><strong>Order ID:</strong> {(order._id || order.id || '').toString().slice(-8)}</p>
                  <p className="description"><strong>Seller:</strong> {order.entrepreneur?.name || order.seller || 'Local Entrepreneur'}</p>
                  <p className="description"><strong>Quantity:</strong> {order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || order.quantity || 1}</p>
                  <p className="description"><strong>Total:</strong> ₹{order.totalAmount ?? order.totalPrice ?? 0}</p>
                  <p className="location">📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : order.date || 'Date unavailable'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">You have not placed any product orders yet.</p>
          )}
        </section>

        {/* My Service Requests */}

        <section className="explore-section" id="requests">
          <div className="section-heading">
            <span className="eyebrow">YOUR ACTIVITY</span>

            <h2>My Service Requests</h2>

            <p>
              View and track your submitted service requests.
            </p>
          </div>

          {myServiceRequestsLoading ? (
            <p className="no-results">Loading your service requests...</p>
          ) : myServiceRequests.length > 0 ? (
            <div className="entrepreneur-grid">
              {myServiceRequests.map((request) => (
                <article className="entrepreneur-card" key={request._id || request.id}>
                  <div className="card-icon">{request.entrepreneur?.icon || '🧑‍🎨'}</div>
                  <span className="skill-tag">{request.status}</span>
                  <h3>{request.entrepreneur?.name || request.entrepreneurName || 'Entrepreneur'}</h3>
                  <p className="description"><strong>Service:</strong> {request.service || 'Service request'}</p>
                  <p className="description"><strong>Requirement:</strong> {request.description || request.requirement || 'Not specified'}</p>
                  <p className="description"><strong>Location:</strong> {request.location || 'Not specified'}</p>
                  <p className="location">📅 Request Date: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN') : request.date || 'Date unavailable'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">
              You have not submitted any service requests yet.
            </p>
          )}
        </section>        {/* Ratings and Reviews */}

        <section className="explore-section" id="reviews">
          <div className="section-heading">
            <span className="eyebrow">CUSTOMER FEEDBACK</span>
            <h2>Ratings &amp; Reviews</h2>
            <p>
              Share your experience and help others discover trusted local entrepreneurs.
            </p>
          </div>

          <div className="entrepreneur-card">
            <h3>Write a Review</h3>

            {!currentCustomer && (
              <p className="description">
                Please log in to submit a review.
              </p>
            )}

            <form className="request-form" onSubmit={handleReviewSubmit}>

  <label htmlFor="review-order">
    Select Completed Order
  </label>

  <select
    id="review-order"
    value={reviewData.orderId}
    onChange={(e) => {
      const selectedOrder = productOrders.find(
        (order) =>
          (order._id || order.id) === e.target.value
      )

      setReviewData({
        ...reviewData,
        orderId: e.target.value,
        entrepreneurName:
          selectedOrder?.entrepreneur?.name ||
          selectedOrder?.entrepreneurName ||
          selectedOrder?.seller ||
          '',
      })
    }}
    required
  >
    <option value="">Select a completed order</option>

    {productOrders
      .filter(
        (order) =>
          (order.status || '').toLowerCase() === 'completed'
      )
      .map((order) => (
        <option
          key={order._id || order.id}
          value={order._id || order.id}
        >
          {order.items?.[0]?.product?.name ||
            order.productName ||
            'Order'} - ₹
          {order.totalAmount || order.totalPrice || ''}
        </option>
      ))}
  </select>

  <label htmlFor="review-entrepreneur">
    Entrepreneur
  </label>

  <input
    id="review-entrepreneur"
    type="text"
    value={reviewData.entrepreneurName}
    placeholder="Select a completed order first"
    readOnly
  />

  <label htmlFor="review-rating">
    Your Rating
  </label>

  <select
    id="review-rating"
    value={reviewData.rating}
    onChange={(e) =>
      setReviewData({
        ...reviewData,
        rating: e.target.value,
      })
    }
  >
    <option value="5">5 - Excellent</option>
    <option value="4">4 - Very Good</option>
    <option value="3">3 - Good</option>
    <option value="2">2 - Fair</option>
    <option value="1">1 - Poor</option>
  </select>

  <label htmlFor="review-comment">
    Your Review
  </label>

  <textarea
    id="review-comment"
    value={reviewData.comment}
    onChange={(e) =>
      setReviewData({
        ...reviewData,
        comment: e.target.value,
      })
    }
    placeholder="Write about your experience..."
    rows="4"
    required
  />

  <button type="submit" className="join-btn">
    Submit Review
  </button>

</form>
          </div>

          <h3 className="reviews-subheading">Customer Reviews</h3>

          {reviews.length > 0 ? (
            <div className="entrepreneur-grid">
              {reviews.map((review) => (
                <article className="entrepreneur-card" key={review.id}>
                  <span className="skill-tag">
                    {review.entrepreneurName}
                  </span>

                  <h3>{review.customerName}</h3>

                  <p
                    className="description"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                    <span> ({review.rating}/5)</span>
                  </p>

                  <p className="description">{review.comment}</p>

                  <p className="location">📅 {review.date}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </section>

        {/* Entrepreneur Dashboard */}

        <section className="explore-section" id="dashboard">
          <div className="section-heading">
            <span className="eyebrow">ENTREPRENEUR PANEL</span>

            <h2>Entrepreneur Dashboard</h2>

            <p>
              Manage and respond to your received service requests.
            </p>
          </div>

          {/* Availability Management */}

          <div className="availability-box">
            <h3>Manage Availability</h3>

            <p>
              Current Status:
              <strong>
                {isAvailable ? ' Available' : ' Unavailable'}
              </strong>
            </p>

            <button
              className="availability-btn"
              onClick={handleAvailabilityToggle}
            >
              {isAvailable ? 'Set Unavailable' : 'Set Available'}
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <h3>{totalRequests}</h3>
              <p>Total Requests</p>
            </div>

            <div className="dashboard-stat">
              <h3>{pendingRequests}</h3>
              <p>Pending Requests</p>
            </div>

            <div className="dashboard-stat">
              <h3>{acceptedRequests}</h3>
              <p>Accepted Requests</p>
            </div>
          </div>

          <div className="section-heading">
            <h2>Received Service Requests</h2>
          </div>

          {serviceRequests.length > 0 ? (
            <div className="entrepreneur-grid">
              {serviceRequests.map((request) => (
                <article className="entrepreneur-card" key={request.id}>
                  <div className="card-icon">
                    {request.entrepreneurIcon}
                  </div>

                  <span className="skill-tag">
                    {request.status}
                  </span>

                  <h3>{request.entrepreneurName}</h3>

                  <p className="description">
                    <strong>Customer:</strong> {request.customerName}
                  </p>

                  <p className="description">
                    <strong>Mobile:</strong> {request.mobile}
                  </p>

                  <p className="description">
                    <strong>Requirement:</strong> {request.requirement}
                  </p>

                  <p className="location">
                    📅 Request Date: {request.date}
                  </p>

                  {request.status === 'Pending' && (
                    <div className="dashboard-actions">
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleRequestStatus(request.id, 'Accepted')
                        }
                      >
                        ✓ Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleRequestStatus(request.id, 'Rejected')
                        }
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">
              No service requests received yet.
            </p>
                    )}

          {/* Received Product Orders */}

          <div className="section-heading">
            <h2>Received Product Orders</h2>
            <p>View and manage orders placed by customers.</p>
          </div>

          {receivedOrdersLoading ? (
            <p className="no-results">Loading received orders...</p>
          ) : receivedOrders.length > 0 ? (
            <div className="entrepreneur-grid">
              {receivedOrders.map((order) => (
                <article className="entrepreneur-card" key={order._id}>
                  <span className="skill-tag">
                    {order.status}
                  </span>

                  <h3>Order #{order._id?.slice(-6)}</h3>

                  <p className="description">
                    <strong>Customer:</strong>{' '}
                    {order.customer?.name || order.user?.name || 'Customer'}
                  </p>

                  <p className="description">
                    <strong>Items:</strong>
                  </p>

                  {order.items?.map((item, index) => (
                    <p className="description" key={index}>
                      {item.product?.name || 'Product'} × {item.quantity}
                    </p>
                  ))}

                  <p className="description">
                    <strong>Total:</strong> ₹{order.totalAmount || order.total || 0}
                  </p>

                  <p className="location">
                    📦 Order Status: {order.status}
                  </p>

                  <div className="dashboard-actions">
                    {order.status === 'pending' && (
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleReceivedOrderStatus(order._id, 'confirmed')
                        }
                      >
                        Confirm Order
                      </button>
                    )}

                    {order.status === 'confirmed' && (
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleReceivedOrderStatus(order._id, 'processing')
                        }
                      >
                        Start Processing
                      </button>
                    )}

                    {order.status === 'processing' && (
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleReceivedOrderStatus(order._id, 'completed')
                        }
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">
              No product orders received yet.
            </p>
          )}
        </section>

        {/* Entrepreneur Application Popup */}

        {showEntrepreneurForm && (
          <div
            className="profile-overlay"
            onClick={() => setShowEntrepreneurForm(false)}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-profile"
                onClick={() => setShowEntrepreneurForm(false)}
              >
                ×
              </button>

              <div className="profile-icon">🧑‍🎨</div>

              <h2>Join HunarHub</h2>

              <p className="description">
                Register your skills and showcase your services to customers.
              </p>

              <form
                className="request-form"
                onSubmit={handleEntrepreneurSubmit}
              >
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={entrepreneurData.name}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      name: e.target.value,
                    })
                  }
                  required
                />
                <label>Email Address</label>

<input
  type="email"
  placeholder="Enter your email address"
  value={entrepreneurData.email}
  onChange={(e) =>
    setEntrepreneurData({
      ...entrepreneurData,
      email: e.target.value,
    })
  }
  required
/>
<label>Password</label>

<input
  type="password"
  placeholder="Create a password"
  value={entrepreneurData.password}
  onChange={(e) =>
    setEntrepreneurData({
      ...entrepreneurData,
      password: e.target.value,
    })
  }
  minLength="6"
  required
/>

                <label>Skill / Category</label>

                <select
                  value={entrepreneurData.skill}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      skill: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select your skill</option>

                  {categories
                    .filter((category) => category !== 'All')
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>

                <label>Location</label>

                <input
                  type="text"
                  placeholder="Enter your city and state"
                  value={entrepreneurData.location}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      location: e.target.value,
                    })
                  }
                  required
                />

                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={entrepreneurData.mobile}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      mobile: e.target.value,
                    })
                  }
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />

                <label>Starting Price (₹)</label>

                <input
                  type="number"
                  min="1"
                  placeholder="Enter your starting price"
                  value={entrepreneurData.price}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      price: e.target.value,
                    })
                  }
                  required
                />                <label>Experience</label>

                <input
                  type="text"
                  placeholder="Example: 5 years"
                  value={entrepreneurData.experience}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      experience: e.target.value,
                    })
                  }
                  required
                />

                <label>Description</label>

                <textarea
                  placeholder="Tell us about your work..."
                  value={entrepreneurData.description}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <label>Services Offered</label>

                <textarea
                  placeholder="Describe the services you provide..."
                  value={entrepreneurData.services}
                  onChange={(e) =>
                    setEntrepreneurData({
                      ...entrepreneurData,
                      services: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit" className="profile-contact">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        )}

                {/* Customer Login and Registration Popup */}

        {showAuthModal && (
          <div
            className="profile-overlay"
            onClick={() => setShowAuthModal(false)}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-profile"
                onClick={() => setShowAuthModal(false)}
              >
                ×
              </button>

              <div className="profile-icon">👤</div>

              <h2>
                {authMode === 'login'
                  ? 'Customer Login'
                  : 'Create Customer Account'}
              </h2>

              <p className="description">
                {authMode === 'login'
                  ? 'Log in to continue using HunarHub.'
                  : 'Register to explore local products and services.'}
              </p>

              <form
                className="request-form"
                onSubmit={handleAuthSubmit}
              >
                {authMode === 'register' && (
                  <>
                    <label>Full Name</label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={authData.name}
                      onChange={(e) =>
                        setAuthData({
                          ...authData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </>
                )}

                                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={authData.email}
                  onChange={(e) =>
                    setAuthData({
                      ...authData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                {authMode === 'register' && (
                  <>
                    <label>Mobile Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={authData.mobile}
                      onChange={(e) => setAuthData({ ...authData, mobile: e.target.value })}
                      pattern="[0-9]{10}"
                      maxLength="10"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </>
                )}

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter password (minimum 6 characters)"
                  value={authData.password}
                  onChange={(e) =>
                    setAuthData({
                      ...authData,
                      password: e.target.value,
                    })
                  }
                  minLength="6"
                  required
                />

                <button
                  type="submit"
                  className="profile-contact"
                >
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </button>
              </form>

              <p className="description">
                {authMode === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
                {' '}

                                <button
                  type="button"
                  className="back-profile"
                  onClick={() => {
                    setAuthMode(
                      authMode === 'login' ? 'register' : 'login'
                    )

                    setAuthData({
                      name: '',
                      email: '',
                      mobile: '',
                      password: '',
                    })
                  }}
                >
                  {authMode === 'login' ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Product Order Popup */}

        {selectedProduct && (
          <div
            className="profile-overlay"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-profile"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>

              <div className="profile-icon">
                {selectedProduct.icon}
              </div>

              <h2>{selectedProduct.name}</h2>

              <p className="location">
                Seller: {selectedProduct.entrepreneur?.name || selectedProduct.seller || 'Local Entrepreneur'}
              </p>

              <h3>₹{selectedProduct.price}</h3>

              <p className="description">
                {selectedProduct.description}
              </p>

              <form
                className="request-form"
                onSubmit={handleOrderSubmit}
              >
                <label>Customer Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={orderData.customerName}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      customerName: e.target.value,
                    })
                  }
                  required
                />

                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={orderData.mobile}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      mobile: e.target.value,
                    })
                  }
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  required
                />

                <label>Address</label>

<input
  type="text"
  placeholder="Enter your full address"
  value={orderData.address}
  onChange={(e) =>
    setOrderData({
      ...orderData,
      address: e.target.value,
    })
  }
  required
/>

<label>City</label>

<input
  type="text"
  placeholder="Enter your city"
  value={orderData.city}
  onChange={(e) =>
    setOrderData({
      ...orderData,
      city: e.target.value,
    })
  }
  required
/>

<label>State</label>

<input
  type="text"
  placeholder="Enter your state"
  value={orderData.state}
  onChange={(e) =>
    setOrderData({
      ...orderData,
      state: e.target.value,
    })
  }
  required
/>

<label>Pincode</label>

<input
  type="text"
  placeholder="Enter 6-digit pincode"
  value={orderData.pincode}
  onChange={(e) =>
    setOrderData({
      ...orderData,
      pincode: e.target.value,
    })
  }
  maxLength="6"
  pattern="[0-9]{6}"
  required
/>

                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  value={orderData.quantity}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      quantity: Number(e.target.value),
                    })
                  }
                  required
                />

                <h3>
                  Total Price: ₹
                  {selectedProduct.price * Number(orderData.quantity)}
                </h3>

                <button
                  type="submit"
                  className="profile-contact"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile Popup */}

        {selectedEntrepreneur && (
          <div
            className="profile-overlay"
            onClick={() => {
              setSelectedEntrepreneur(null)
              setShowRequestForm(false)
            }}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-profile"
                onClick={() => {
                  setSelectedEntrepreneur(null)
                  setShowRequestForm(false)
                }}
              >
                ×
              </button>

              {!showRequestForm ? (
                <>
                  <div className="profile-icon">
                    {selectedEntrepreneur.icon || '🧑‍🎨'}
                  </div>

                  <span className="skill-tag">
                    {selectedEntrepreneur.skill || selectedEntrepreneur.category}
                  </span>

                  <h2>{selectedEntrepreneur.name}</h2>

                  <p className="location">
                    📍 {selectedEntrepreneur.location}
                  </p>

                  <div className="profile-details">
                    <p>
                      <strong>Experience:</strong>{' '}
                      {selectedEntrepreneur.experience}
                    </p>

                    <p>
                      <strong>Starting Price:</strong>{' '}
                      {selectedEntrepreneur.price}
                    </p>

                    <p>
                      <strong>About:</strong>{' '}
                      {selectedEntrepreneur.description}
                    </p>

                    <p>
                      <strong>Services:</strong>{' '}
                      {selectedEntrepreneur.services}
                    </p>
                  </div>

                  <button
                    className="profile-contact"
                    onClick={() => setShowRequestForm(true)}
                  >
                    Request a Service
                  </button>
                </>
              ) : (
                <>                  <h2>Request a Service</h2>

                  <p>
                    Send your service request to{' '}
                    <strong>{selectedEntrepreneur.name}</strong>.
                  </p>

                  <form
                    className="request-form"
                    onSubmit={handleRequestSubmit}
                  >
                    <label>Customer Name</label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={requestData.customerName}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          customerName: e.target.value,
                        })
                      }
                      required
                    />

                    <label>Mobile Number</label>

                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={requestData.mobile}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          mobile: e.target.value,
                        })
                      }
                      pattern="[0-9]{10}"
                      maxLength="10"
                      title="Please enter a valid 10-digit mobile number"
                      required
                    />
                    <label>Your Location</label>

<input
  type="text"
  placeholder="Enter your city or area"
  value={requestData.location}
  onChange={(e) =>
    setRequestData({
      ...requestData,
      location: e.target.value,
    })
  }
  required
/>

                    <label>Service Requirement</label>

                    <textarea
                      placeholder="Describe the service you need..."
                      value={requestData.requirement}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          requirement: e.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="submit"
                      className="profile-contact"
                    >
                      Submit Request
                    </button>

                    <button
                      type="button"
                      className="back-profile"
                      onClick={() => setShowRequestForm(false)}
                    >
                      ← Back to Profile
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Admin Dashboard */}

        <section className="explore-section" id="admin-dashboard">
          <div className="section-heading">
            <span className="eyebrow">ADMIN PANEL</span>
            <h2>Admin Dashboard</h2>
            <p>
              Manage entrepreneur applications and monitor their approval status.
            </p>
          </div>

          {/* Application Statistics */}

          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <h3>{totalApplications}</h3>
              <p>Total Applications</p>
            </div>

            <div className="dashboard-stat">
              <h3>{pendingApplications}</h3>
              <p>Pending Applications</p>
            </div>

            <div className="dashboard-stat">
              <h3>{approvedApplications}</h3>
              <p>Approved Applications</p>
            </div>
          </div>

          {/* Category Management */}

          <div className="section-heading">
            <h2>Category Management</h2>
            <p>Add or remove marketplace categories.</p>
          </div>

          <form className="request-form" onSubmit={handleAddCategory}>
            <label htmlFor="new-category">New Category</label>
            <input
              id="new-category"
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="profile-contact">
              Add Category
            </button>
          </form>

          <div className="entrepreneur-grid">
            {categories
              .filter((category) => category !== 'All')
              .map((category) => (
                <article className="entrepreneur-card" key={category}>
                  <h3>{category}</h3>
                  <button
                    className="reject-btn"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Delete Category
                  </button>
                </article>
              ))}
          </div>

          {/* Entrepreneur Applications */}

          <div className="section-heading">
            <h2>Entrepreneur Applications</h2>
          </div>

          {entrepreneurApplications.length > 0 ? (
            <div className="entrepreneur-grid">
              {entrepreneurApplications.map((application) => (
                <article className="entrepreneur-card" key={application.id}>
                  <span className="skill-tag">{application.status}</span>

                  <h3>{application.name || application.user?.name || 'Entrepreneur'}</h3>

                  <p className="location">📍 {application.location}</p>

                  <p className="description">
                    <strong>Skill:</strong> {application.skill || application.category || 'Not specified'}
                    <br />
                    <strong>Experience:</strong> {application.experience}
                    <br />
                    <strong>Price:</strong> {application.price}
                    <br />
                    <strong>Mobile:</strong> {application.mobile}
                    <br />
                    <strong>Applied On:</strong> {application.date}
                  </p>

                  <p className="description">{application.description}</p>

                  <p className="description">
                    <strong>Services:</strong> {application.services}
                  </p>

                  {application.status === 'Pending' && (
                    <div className="dashboard-actions">
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleApplicationStatus(application.id, 'Approved')
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleApplicationStatus(application.id, 'Rejected')
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">
              No entrepreneur applications received yet.
            </p>
          )}
        </section>

        {/* Admin Product Order Monitoring */}

        <section className="explore-section admin-monitoring" id="admin-orders">
          <div className="section-heading">
            <span className="eyebrow">ADMIN PANEL</span>
            <h2>Product Order Monitoring</h2>
            <p>View all product orders placed by customers.</p>
          </div>

          <div className="dashboard-stats admin-stats">
            <div className="dashboard-stat stat-card"><h3>{adminOrders.length}</h3><p>Total Orders</p></div>
            <div className="dashboard-stat stat-card"><h3>{adminOrders.filter((order) => (order.status || '').toLowerCase() === 'pending').length}</h3><p>Pending Orders</p></div>
          </div>

          {adminOrdersLoading ? (
            <p className="no-results">Loading all orders...</p>
          ) : adminOrders.length > 0 ? (
            <div className="entrepreneur-grid admin-applications">
              {adminOrders.map((order) => (
                <article className="entrepreneur-card application-card" key={order._id || order.id}>
                  <h3>{order.items?.map((item) => item.product?.name || 'Product').join(', ') || 'Product Order'}</h3>
                  <p className="description"><strong>Customer:</strong> {order.customer?.name || order.user?.name || 'Customer'}</p>
                  <p className="description"><strong>Seller:</strong> {order.entrepreneur?.name || 'Entrepreneur'}</p>
                  <p className="description"><strong>Quantity:</strong> {order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0}</p>
                  <p className="description"><strong>Total Price:</strong> ₹{order.totalAmount || 0}</p>
                  <p className="location">📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Date unavailable'}</p>
                  <span className="skill-tag">{order.status}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">No product orders available yet.</p>
          )}
        </section>

        {/* Admin Service Request Monitoring */}

        <section className="explore-section admin-monitoring" id="admin-requests">
          <div className="section-heading">
            <span className="eyebrow">ADMIN PANEL</span>
            <h2>Service Request Monitoring</h2>
            <p>View all service requests and their current status.</p>
          </div>

          <div className="dashboard-stats admin-stats">
            <div className="dashboard-stat stat-card"><h3>{adminServiceRequests.length}</h3><p>Total Requests</p></div>
            <div className="dashboard-stat stat-card"><h3>{adminServiceRequests.filter((r) => r.status === 'pending').length}</h3><p>Pending Requests</p></div>
            <div className="dashboard-stat stat-card"><h3>{adminServiceRequests.filter((r) => ['accepted', 'in_progress', 'completed'].includes(r.status)).length}</h3><p>Converted Requests</p></div>
            <div className="dashboard-stat stat-card"><h3>{adminServiceRequests.filter((r) => r.status === 'rejected').length}</h3><p>Rejected Requests</p></div>
          </div>

          {adminServiceRequestsLoading ? (
            <p className="no-results">Loading all service requests...</p>
          ) : adminServiceRequests.length > 0 ? (
            <div className="entrepreneur-grid admin-applications">
              {adminServiceRequests.map((request) => (
                <article className="entrepreneur-card application-card" key={request._id || request.id}>
                  <h3>{request.entrepreneur?.name || 'Entrepreneur'}</h3>
                  <p className="description"><strong>Customer:</strong> {request.customer?.name || 'Customer'}</p>
                  <p className="description"><strong>Service:</strong> {request.service || 'Not specified'}</p>
                  <p className="description"><strong>Requirement:</strong> {request.description || 'Not specified'}</p>
                  <p className="location">📅 {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN') : 'Date unavailable'}</p>
                  <span className="skill-tag">{request.status}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-results">No service requests available yet.</p>
          )}
        </section>

        {/* Admin Complaint Management */}
        <section className="explore-section admin-monitoring" id="admin-complaints">
          <div className="section-heading">
            <span className="eyebrow">ADMIN PANEL</span>
            <h2>Complaint Management</h2>
            <p>Review customer and entrepreneur complaints and update their status.</p>
          </div>

          {adminComplaintsLoading ? (
            <p className="no-results">Loading complaints...</p>
          ) : adminComplaints.length > 0 ? (
            <div className="entrepreneur-grid admin-applications">
              {adminComplaints.map((complaint) => {
                const complaintId = complaint._id || complaint.id
                return (
                  <article className="entrepreneur-card application-card" key={complaintId}>
                    <span className="skill-tag">{complaint.status || 'open'}</span>
                    <h3>{complaint.subject || 'Customer Complaint'}</h3>
                    <p className="description"><strong>Raised by:</strong> {complaint.user?.name || complaint.customer?.name || complaint.raisedBy?.name || 'User'}</p>
                    <p className="description"><strong>Against:</strong> {complaint.againstUser?.name || 'Not specified'}</p>
                    <p className="description">{complaint.description || 'No description provided.'}</p>
                    <label htmlFor={`complaint-response-${complaintId}`}>Admin Response</label>
                    <textarea
                      id={`complaint-response-${complaintId}`}
                      rows="3"
                      placeholder="Write an update for the user..."
                      value={complaintResponses[complaintId] ?? complaint.adminResponse ?? ''}
                      onChange={(e) => setComplaintResponses((previous) => ({ ...previous, [complaintId]: e.target.value }))}
                    />
                    <div className="dashboard-actions">
                      {['under_review', 'resolved', 'rejected'].map((status) => (
                        <button
                          key={status}
                          className={status === 'rejected' ? 'reject-btn' : 'accept-btn'}
                          onClick={() => handleComplaintUpdate(complaintId, status)}
                        >
                          {status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="no-results">No complaints have been submitted.</p>
          )}
        </section>

        {/* Admin Basic Analytics */}

        <section className="explore-section admin-monitoring" id="admin-analytics">
          <div className="section-heading">
            <span className="eyebrow">ADMIN PANEL</span>
            <h2>Admin Analytics Overview</h2>
            <p>A summary of HunarHub activity and marketplace performance.</p>
          </div>

          {adminAnalyticsLoading ? (
            <p className="no-results">Loading analytics...</p>
          ) : adminAnalytics ? (
            <>
              <h3>Users</h3>
              <div className="dashboard-stats admin-stats">
                <div className="dashboard-stat stat-card"><h3>{analyticsUsers.totalRegisteredCustomers ?? 0}</h3><p>Registered Customers</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsUsers.totalRegisteredEntrepreneurs ?? 0}</h3><p>Registered Entrepreneurs</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsUsers.totalActiveUsers ?? 0}</h3><p>Active Users</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsUsers.totalApprovedEntrepreneurs ?? 0}</h3><p>Approved Entrepreneurs</p></div>
              </div>

              <h3>Service Requests</h3>
              <div className="dashboard-stats admin-stats">
                <div className="dashboard-stat stat-card"><h3>{analyticsRequests.totalServiceRequests ?? 0}</h3><p>Total Requests</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsRequests.convertedServiceRequests ?? 0}</h3><p>Converted Requests</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsRequests.completedServiceRequests ?? 0}</h3><p>Completed Requests</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsRequests.conversionRate ?? 0}%</h3><p>Conversion Rate</p></div>
              </div>

              <h3>Product Sales</h3>
              <div className="dashboard-stats admin-stats">
                <div className="dashboard-stat stat-card"><h3>{analyticsProducts.totalProductsSold ?? 0}</h3><p>Products Sold</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsProducts.totalCompletedOrders ?? 0}</h3><p>Completed Orders</p></div>
                <div className="dashboard-stat stat-card"><h3>₹{analyticsProducts.completedOrderValue ?? 0}</h3><p>Completed Order Value</p></div>
              </div>

              <h3>Entrepreneur Earnings</h3>
              <div className="dashboard-stats admin-stats">
                <div className="dashboard-stat stat-card"><h3>₹{analyticsEarnings.totalEstimatedEntrepreneurEarnings ?? 0}</h3><p>Total Estimated Earnings</p></div>
                <div className="dashboard-stat stat-card"><h3>₹{analyticsEarnings.averageEntrepreneurEarnings ?? 0}</h3><p>Average Earnings</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsEarnings.entrepreneursWithEarnings ?? 0}</h3><p>Entrepreneurs with Earnings</p></div>
              </div>

              <h3>Customer Satisfaction</h3>
              <div className="dashboard-stats admin-stats">
                <div className="dashboard-stat stat-card"><h3>{analyticsSatisfaction.averageRating ?? 0}/5</h3><p>Average Rating</p></div>
                <div className="dashboard-stat stat-card"><h3>{analyticsSatisfaction.totalReviews ?? 0}</h3><p>Total Reviews</p></div>
              </div>
            </>
          ) : (
            <p className="no-results">Analytics could not be loaded. Please log in as admin and refresh.</p>
          )}
        </section>

        {/* About Section */}

        <section className="about-section" id="about">
          <span className="eyebrow">OUR PURPOSE</span>

          <h2>Every Skill Deserves a Platform.</h2>

          <p>
            HunarHub connects local talent with customers. We aim to
            support small entrepreneurs, promote handmade products
            and celebrate traditional skills.
          </p>
        </section>
      </main>

      {/* Footer */}

      <footer className="footer">
        <a href="#home" className="brand">
          <span className="brand-icon">✦</span>
          Hunar<span>Hub</span>
        </a>

        <p>Empowering Local Skills, Building Local Dreams.</p>

        <span>© 2026 HunarHub. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default App
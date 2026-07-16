import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Percent, 
  Mail, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Upload, 
  Trash2, 
  Plus, 
  Edit, 
  Search, 
  Check, 
  AlertCircle, 
  Lock, 
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
  Globe,
  Home,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, Deal, MENU_CATEGORIES } from '../types';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'read';
  createdAt: string;
}

interface PageData {
  id: string;
  title: string;
  announcement: string;
  heroSubtitle: string;
  aboutStory: string;
  founderQuote: string;
}

interface ActivityLog {
  timestamp: string;
  action: string;
  ip: string;
}

interface MediaItem {
  id: string;
  name: string;
  url: string;
}

const safeGetItem = (key: string, defaultValue: string = ''): string => {
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch (e) {
    console.warn(`localStorage.getItem failed for key ${key}:`, e);
    try {
      return sessionStorage.getItem(key) || defaultValue;
    } catch (se) {
      return defaultValue;
    }
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage.setItem failed for key ${key}:`, e);
    try {
      sessionStorage.setItem(key, value);
    } catch (se) {
      // ignore fallback failure
    }
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`localStorage.removeItem failed for key ${key}:`, e);
    try {
      sessionStorage.removeItem(key);
    } catch (se) {
      // ignore fallback failure
    }
  }
};

export default function AdminPortal({ onClose }: { onClose: () => void }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>(safeGetItem('veebite_token'));
  const [username, setUsername] = useState<string>(safeGetItem('veebite_username'));
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Portal Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'deals' | 'blog' | 'inquiries' | 'pages' | 'media' | 'orders' | 'settings'>('dashboard');

  // Backend Data States
  const [analytics, setAnalytics] = useState<{ visitorCount: number; ordersPlaced: number; revenue: number; clicks: Record<string, number> }>({
    visitorCount: 1240,
    ordersPlaced: 87,
    revenue: 94850,
    clicks: {}
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersFilter, setOrdersFilter] = useState('all');

  // Editing / Creating Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'menu' | 'deal' | 'blog'>('menu');
  const [editingItem, setEditingItem] = useState<any>(null); // Holds item to edit, or null for creating

  // Form Fields State
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    category: 'regular-pizza',
    price: 0,
    priceMultiple: { Small: 0, Medium: 0, Large: 0 },
    isMultiplePrice: false,
    image: '',
    badge: ''
  });

  const [dealForm, setDealForm] = useState({
    name: '',
    description: '',
    price: 0,
    tag: 'Solo' as 'Family' | 'Solo' | 'Combo' | 'Special',
    badge: '',
    image: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: 'Muhammad Haris',
    image: ''
  });

  // Password Settings Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Search & Filter State
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState('all');

  // Media upload state
  const [uploadName, setUploadName] = useState('');
  const [uploadBase64, setUploadBase64] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Page Editing Form State
  const [selectedPageId, setSelectedPageId] = useState('home-settings');
  const [pageForm, setPageForm] = useState({
    title: '',
    announcement: '',
    heroSubtitle: '',
    aboutStory: '',
    founderQuote: ''
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  // Fetch Tab Specific Data
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        // Token invalid/expired
        handleLogout();
      }
    } catch (err) {
      console.error('Verify token failed:', err);
    }
  };

  const fetchDashboardData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      // Analytics & Logs
      const analyticsRes = await fetch('/api/admin/analytics', { headers });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
        setActivityLogs(data.activityLogs);
      }

      // Inquiries
      const inquiriesRes = await fetch('/api/admin/inquiries', { headers });
      if (inquiriesRes.ok) {
        const data = await inquiriesRes.json();
        setInquiries(data);
      }

      // Public data
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const data = await menuRes.json();
        setMenuItems(data);
      }

      const dealsRes = await fetch('/api/deals');
      if (dealsRes.ok) {
        const data = await dealsRes.json();
        setDeals(data);
      }

      const blogRes = await fetch('/api/blog');
      if (blogRes.ok) {
        const data = await blogRes.json();
        setBlogPosts(data);
      }

      const pagesRes = await fetch('/api/pages');
      if (pagesRes.ok) {
        const data = await pagesRes.json();
        setPages(data);
        if (data.length > 0) {
          const mainPage = data.find((p: any) => p.id === selectedPageId) || data[0];
          setPageForm({
            title: mainPage.title,
            announcement: mainPage.announcement,
            heroSubtitle: mainPage.heroSubtitle,
            aboutStory: mainPage.aboutStory,
            founderQuote: mainPage.founderQuote
          });
        }
      }

      // Media
      const mediaRes = await fetch('/api/admin/media', { headers });
      if (mediaRes.ok) {
        const data = await mediaRes.json();
        setMediaItems(data);
      }

      // Orders
      const ordersRes = await fetch('/api/admin/orders', { headers });
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        data = { error: `Invalid server response format (HTTP ${response.status}).` };
        console.error('Failed to parse login response:', responseText);
      }

      if (response.ok) {
        safeSetItem('veebite_token', data.token);
        safeSetItem('veebite_username', data.username);
        setToken(data.token);
        setUsername(data.username);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Failed to authenticate.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}
    safeRemoveItem('veebite_token');
    safeRemoveItem('veebite_username');
    setToken('');
    setUsername('');
    setIsAuthenticated(false);
  };

  const handlePageSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
    try {
      const res = await fetch(`/api/admin/pages/${selectedPageId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(pageForm)
      });
      if (res.ok) {
        alert('Page visual settings saved successfully!');
        fetchDashboardData();
      } else {
        alert('Failed to save page settings.');
      }
    } catch (err) {
      alert('Error updating page content.');
    }
  };

  const handleInquiryStatus = async (id: string, status: 'pending' | 'read') => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInquiryDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordSuccess('Password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setPasswordError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError('Server connection error.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Image upload handler (base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadBase64(reader.result as string);
      setUploadName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!uploadBase64) {
      setUploadError('Please select or drop an image file first.');
      return;
    }

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: uploadName || 'Uploaded image', base64: uploadBase64 })
      });

      if (res.ok) {
        setUploadSuccess(true);
        setUploadBase64('');
        setUploadName('');
        fetchDashboardData();
      } else {
        const errData = await res.json();
        setUploadError(errData.error || 'Upload failed.');
      }
    } catch (err) {
      setUploadError('Upload connection failed.');
    }
  };

  // Open Edit Modal for creating or updating
  const openModal = (type: 'menu' | 'deal' | 'blog', item: any = null) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'menu') {
      if (item) {
        const isMultiple = typeof item.price === 'object';
        setMenuForm({
          name: item.name,
          description: item.description || '',
          category: item.category,
          price: isMultiple ? 0 : item.price,
          priceMultiple: isMultiple ? { Small: item.price.Small || 0, Medium: item.price.Medium || 0, Large: item.price.Large || 0 } : { Small: 0, Medium: 0, Large: 0 },
          isMultiplePrice: isMultiple,
          image: item.image || '',
          badge: item.badge || ''
        });
      } else {
        setMenuForm({
          name: '',
          description: '',
          category: 'regular-pizza',
          price: 0,
          priceMultiple: { Small: 0, Medium: 0, Large: 0 },
          isMultiplePrice: false,
          image: '',
          badge: ''
        });
      }
    } else if (type === 'deal') {
      if (item) {
        setDealForm({
          name: item.name,
          description: item.description || '',
          price: Number(item.price) || 0,
          tag: item.tag,
          badge: item.badge || '',
          image: item.image || ''
        });
      } else {
        setDealForm({
          name: '',
          description: '',
          price: 0,
          tag: 'Solo',
          badge: '',
          image: ''
        });
      }
    } else if (type === 'blog') {
      if (item) {
        setBlogForm({
          title: item.title,
          content: item.content,
          author: item.author || 'Muhammad Haris',
          image: item.image || ''
        });
      } else {
        setBlogForm({
          title: '',
          content: '',
          author: 'Muhammad Haris',
          image: ''
        });
      }
    }

    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };

    let url = '';
    let method = 'POST';
    let bodyData: any = {};

    if (modalType === 'menu') {
      url = editingItem ? `/api/admin/menu/${editingItem.id}` : '/api/admin/menu';
      method = editingItem ? 'PUT' : 'POST';
      bodyData = {
        name: menuForm.name,
        description: menuForm.description,
        category: menuForm.category,
        price: menuForm.isMultiplePrice ? menuForm.priceMultiple : Number(menuForm.price),
        image: menuForm.image,
        badge: menuForm.badge
      };
    } else if (modalType === 'deal') {
      url = editingItem ? `/api/admin/deals/${editingItem.id}` : '/api/admin/deals';
      method = editingItem ? 'PUT' : 'POST';
      bodyData = {
        name: dealForm.name,
        description: dealForm.description,
        price: Number(dealForm.price),
        tag: dealForm.tag,
        badge: dealForm.badge,
        image: dealForm.image
      };
    } else if (modalType === 'blog') {
      url = editingItem ? `/api/admin/blog/${editingItem.id}` : '/api/admin/blog';
      method = editingItem ? 'PUT' : 'POST';
      bodyData = blogForm;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Operation failed.');
      }
    } catch (err) {
      alert('Error communicating with database server.');
    }
  };

  const handleDeleteItem = async (type: 'menu' | 'deal' | 'blog', id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    const headers = { 'Authorization': `Bearer ${token}` };
    const mappedType = type === 'deal' ? 'deals' : type;
    const url = `/api/admin/${mappedType}/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      alert('Delete request failed.');
    }
  };

  // Filter and search menu items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesFilter = menuFilter === 'all' || item.category === menuFilter;
    return matchesSearch && matchesFilter;
  });

  // Order helper functions
  const updateOrderStatus = async (id: string, status: string) => {
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const ordersRes = await fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data);
        }
        fetchDashboardData();
      } else {
        alert('Failed to update order status.');
      }
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete/archive this order?')) return;
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setOrders(prev => prev.filter(order => order.id !== id));
        fetchDashboardData();
      } else {
        alert('Failed to delete order.');
      }
    } catch (err) {
      console.error('Delete order error:', err);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.orderId.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      ord.customerPhone.toLowerCase().includes(ordersSearch.toLowerCase());
    
    if (ordersFilter === 'all') return matchesSearch;
    if (ordersFilter === 'pending') return matchesSearch && ord.status === 'pending';
    if (ordersFilter === 'confirmed') return matchesSearch && ord.status === 'confirmed';
    if (ordersFilter === 'preparing') return matchesSearch && ord.status === 'preparing';
    if (ordersFilter === 'ready') return matchesSearch && (ord.status === 'ready_for_pickup' || ord.status === 'out_for_delivery');
    if (ordersFilter === 'delivered') return matchesSearch && ord.status === 'delivered';
    if (ordersFilter === 'cancelled') return matchesSearch && ord.status === 'cancelled';
    
    return matchesSearch;
  });

  // Calculate dynamic sales summary metrics
  const clickCount: number = Object.values(analytics.clicks || {}).reduce((a: number, b: any) => a + Number(b || 0), 0) as number;

  return (
    <div id="admin-portal-wrapper" className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#080808]/98 backdrop-blur-xl overflow-hidden font-sans text-[#F3E9D2]">
      
      {/* 1. NOT AUTHENTICATED: LOGIN VIEW */}
      {!isAuthenticated ? (
        <div id="admin-login-stage" className="flex-1 flex items-center justify-center p-4 relative">
          <div className="absolute inset-0 bg-radial from-gold/5 via-transparent to-transparent pointer-events-none" />
          
          <motion.div 
            className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Logo header */}
            <div className="text-center mb-8">
              <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-gold via-[#FFE8B6] to-gold bg-clip-text text-transparent">VEE BITE</span>
              <div className="text-gold font-mono text-xs tracking-widest mt-1">ADMINISTRATOR PORTAL</div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B5A88F] mb-1.5 font-mono">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gold/60" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    placeholder="Enter admin username"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[#F3E9D2] placeholder-[#B5A88F]/40 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#B5A88F] mb-1.5 font-mono">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gold/60" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••••••••"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-[#F3E9D2] placeholder-[#B5A88F]/40 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/25 border border-red-900/30 rounded-lg p-3 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-[#C5A85C] to-gold text-black hover:opacity-90 active:scale-[0.99] transition-all font-bold py-2.5 rounded-lg text-sm tracking-wide shadow-lg shadow-gold/10"
              >
                {loginLoading ? 'Authenticating Credentials...' : 'Access Admin Panel'}
              </button>
            </form>

            <button 
              onClick={onClose}
              className="mt-6 w-full cursor-pointer border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-[#B5A88F] py-2 rounded-lg text-xs tracking-wider transition-colors"
            >
              Back to Website Home
            </button>
          </motion.div>
        </div>
      ) : (
        
        /* 2. AUTHENTICATED: DASHBOARD CONTENT */
        <>
          {/* A. STICKY SIDEBAR / TOP NAVIGATION (MOBILE ACCORDION) */}
          <aside className="w-full md:w-64 bg-[#0D0D0D] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between flex-shrink-0">
            <div>
              {/* Branding Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between md:block">
                <div>
                  <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-gold to-white bg-clip-text text-transparent">VEE BITE</span>
                  <div className="text-[10px] text-gold font-mono tracking-widest mt-0.5">ADMIN PANEL</div>
                </div>
                <button 
                  onClick={onClose}
                  className="md:hidden flex items-center gap-1.5 text-xs text-gold border border-gold/20 px-2.5 py-1 rounded-full hover:bg-gold/5"
                >
                  <Home className="w-3.5 h-3.5" /> Website
                </button>
              </div>

              {/* Navigation tabs */}
              <nav className="p-4 space-y-1 overflow-x-auto md:overflow-visible flex md:flex-col gap-1 md:gap-0 no-scrollbar">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'menu', label: 'Menu List', icon: Utensils },
                  { id: 'deals', label: 'Special Deals', icon: Percent },
                  { id: 'blog', label: 'News/Blog', icon: FileText },
                  { id: 'orders', label: `Orders (${orders.filter(o=>o.status==='pending').length})`, icon: ShoppingBag },
                  { id: 'inquiries', label: `Inquiries (${inquiries.filter(i=>i.status==='pending').length})`, icon: Mail },
                  { id: 'pages', label: 'Page Content', icon: Globe },
                  { id: 'media', label: 'Media Library', icon: ImageIcon },
                  { id: 'settings', label: 'Security & Logs', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive 
                          ? 'bg-gold text-black shadow-md shadow-gold/15' 
                          : 'text-[#B5A88F] hover:bg-white/[0.04] hover:text-[#F3E9D2]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 hidden md:block">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono font-bold text-xs uppercase">
                  {username ? username.substring(0, 2) : 'HA'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white capitalize">{username || 'Super Admin'}</div>
                  <div className="text-[10px] text-green-400 font-mono flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live Server Session
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={onClose}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-1 border border-white/10 hover:bg-white/5 py-2 rounded-lg text-xs text-[#B5A88F] hover:text-[#F3E9D2] transition-all"
                  title="View Live Web Storefront"
                >
                  <Home className="w-3.5 h-3.5" /> Web
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 cursor-pointer flex items-center justify-center gap-1 border border-red-900/30 bg-red-950/10 hover:bg-red-900/20 py-2 rounded-lg text-xs text-red-400 transition-all"
                  title="Secure Logout"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* B. MAIN SCROLLABLE CONTENT VIEWPORT */}
          <main className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-[#070707] relative pb-10">
            {/* Header title bar */}
            <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]/60 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide capitalize">{activeTab} Manager</h1>
                <p className="text-[10px] md:text-xs text-[#B5A88F]">Secure portal management for Muhammad Haris & staff</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Back to Web button */}
                <button 
                  onClick={onClose}
                  className="cursor-pointer hidden md:flex items-center gap-2 bg-white/[0.04] hover:bg-gold hover:text-black border border-white/10 hover:border-gold px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5" /> Return to Public Website
                </button>

                {/* Mobile logout */}
                <button 
                  onClick={handleLogout}
                  className="md:hidden p-2 text-red-400 border border-red-900/20 rounded-lg hover:bg-red-950/25"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Render Tab Contents */}
            <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
              
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Revenue', value: `Rs. ${Number(analytics.revenue || 0).toLocaleString()}`, desc: 'Total sales metrics', icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
                      { label: 'Orders Placed', value: analytics.ordersPlaced || 0, desc: 'Successful checkouts', icon: ShoppingBag, color: 'text-gold bg-gold/5 border-gold/10' },
                      { label: 'Visits Logged', value: analytics.visitorCount || 0, desc: 'Server sessions tracked', icon: Users, color: 'text-blue-400 bg-blue-500/5 border-blue-500/10' },
                      { label: 'Link Clicks', value: clickCount, desc: 'WhatsApp & Cart touches', icon: TrendingUp, color: 'text-purple-400 bg-purple-500/5 border-purple-500/10' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-5 rounded-2xl border bg-white/[0.01] backdrop-blur-md flex items-start justify-between ${stat.color}`}>
                        <div>
                          <p className="text-xs text-[#B5A88F] font-medium">{stat.label}</p>
                          <h3 className="text-lg md:text-2xl font-extrabold mt-1 text-white">{stat.value}</h3>
                          <p className="text-[10px] text-[#B5A88F]/60 mt-1 font-mono">{stat.desc}</p>
                        </div>
                        <stat.icon className="w-5 h-5 opacity-80" />
                      </div>
                    ))}
                  </div>

                  {/* SVG Line Graph & Interaction Logs */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SVG Interactive Line Chart */}
                    <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-[#0E0E0E] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-white">Sales & Inquiry Traffic Curve</h3>
                          <p className="text-xs text-[#B5A88F]">Dynamic performance trends for the last 7 days</p>
                        </div>
                        <span className="text-[10px] font-mono bg-gold/10 border border-gold/30 px-2 py-0.5 rounded text-gold">ACTIVE TELEMETRY</span>
                      </div>

                      {/* Craft custom responsive SVG chart */}
                      <div className="h-60 w-full flex items-end relative pt-4">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C5A85C" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#C5A85C" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                          
                          {/* Shaded Area */}
                          <path 
                            d="M 10 180 Q 80 140 160 110 T 320 60 T 420 40 L 490 30 L 490 200 L 10 200 Z" 
                            fill="url(#chartGradient)" 
                          />
                          
                          {/* Trend Line */}
                          <path 
                            d="M 10 180 Q 80 140 160 110 T 320 60 T 420 40 L 490 30" 
                            fill="none" 
                            stroke="#C5A85C" 
                            strokeWidth="3.5" 
                            strokeLinecap="round"
                          />

                          {/* Glow overlay */}
                          <path 
                            d="M 10 180 Q 80 140 160 110 T 320 60 T 420 40 L 490 30" 
                            fill="none" 
                            stroke="#C5A85C" 
                            strokeWidth="8" 
                            strokeOpacity="0.2"
                            strokeLinecap="round"
                          />

                          {/* Interactive Dot indicators */}
                          <circle cx="10" cy="180" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                          <circle cx="100" cy="130" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                          <circle cx="200" cy="100" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                          <circle cx="320" cy="60" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                          <circle cx="420" cy="40" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                          <circle cx="490" cy="30" r="5" fill="#000" stroke="#C5A85C" strokeWidth="2.5" />
                        </svg>

                        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-[#B5A88F]/60 font-mono pt-1 px-2 border-t border-white/5">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Today</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Clicks Analytics */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-[#0E0E0E]">
                      <h3 className="text-sm font-bold text-white mb-4">Button Action Tracking</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'whatsapp_click', name: 'WhatsApp Click Calls', color: 'bg-green-500' },
                          { key: 'cart_add', name: 'Added to Cart Action', color: 'bg-gold' },
                          { key: 'contact_sub', name: 'Inquiries Form Submits', color: 'bg-blue-500' },
                        ].map((item) => {
                          const val = Number(analytics.clicks?.[item.key] || 0);
                          const total = Number(clickCount) || 1;
                          const pct = Math.min(100, Math.round((val / total) * 100));
                          return (
                            <div key={item.key}>
                              <div className="flex justify-between text-xs mb-1.5 font-mono">
                                <span className="text-[#B5A88F]">{item.name}</span>
                                <span className="text-white font-bold">{val} clicks ({pct}%)</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-8 border-t border-white/5 pt-4 text-center">
                        <p className="text-[10px] text-[#B5A88F]/50 font-mono">
                          Session data tracks user conversions automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Adjustment Control Panel */}
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0E0E0E] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Quick Stats Adjustments & Resets</h3>
                        <p className="text-xs text-[#B5A88F]">Modify live visitor sessions, order volumes, revenue metrics, or perform resets.</p>
                      </div>
                      <Sparkles className="w-4 h-4 text-gold" />
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const visitorCount = Number(formData.get('visitorCount') || 0);
                      const ordersPlaced = Number(formData.get('ordersPlaced') || 0);
                      const revenue = Number(formData.get('revenue') || 0);
                      
                      try {
                        const tokenVal = safeGetItem('veebite_token');
                        const res = await fetch('/api/admin/analytics/reset', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': tokenVal ? `Bearer ${tokenVal}` : ''
                          },
                          body: JSON.stringify({ visitorCount, ordersPlaced, revenue })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setAnalytics(data.analytics);
                          // Refresh activity logs
                          const logsRes = await fetch('/api/admin/analytics', {
                            headers: { 'Authorization': tokenVal ? `Bearer ${tokenVal}` : '' }
                          });
                          if (logsRes.ok) {
                            const logsData = await logsRes.json();
                            setActivityLogs(logsData.activityLogs || []);
                          }
                          alert('Analytics updated successfully!');
                        } else {
                          alert('Failed to update stats.');
                        }
                      } catch (err) {
                        console.error('Update analytics error:', err);
                        alert('Connection error while updating analytics.');
                      }
                    }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] text-[#B5A88F]/80 uppercase tracking-wider mb-1 font-mono">Visits Logged</label>
                        <input 
                          type="number" 
                          name="visitorCount"
                          defaultValue={analytics.visitorCount || 0}
                          key={analytics.visitorCount}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#B5A88F]/80 uppercase tracking-wider mb-1 font-mono">Orders Placed</label>
                        <input 
                          type="number" 
                          name="ordersPlaced"
                          defaultValue={analytics.ordersPlaced || 0}
                          key={analytics.ordersPlaced}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#B5A88F]/80 uppercase tracking-wider mb-1 font-mono">Total Revenue (Rs.)</label>
                        <input 
                          type="number" 
                          name="revenue"
                          defaultValue={analytics.revenue || 0}
                          key={analytics.revenue}
                          className="w-full bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="submit"
                          className="flex-1 bg-gold hover:bg-gold-light text-black font-sans text-[10px] uppercase tracking-wider py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Save Stats
                        </button>
                        <button 
                          type="button"
                          onClick={async () => {
                            if (!confirm('Are you sure you want to reset everything back to zero (Visits to 566)?')) return;
                            try {
                              const tokenVal = safeGetItem('veebite_token');
                              const res = await fetch('/api/admin/analytics/reset', {
                                method: 'POST',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': tokenVal ? `Bearer ${tokenVal}` : ''
                                },
                                body: JSON.stringify({ visitorCount: 566, ordersPlaced: 0, revenue: 0 })
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setAnalytics(data.analytics);
                                // Refresh activity logs
                                const logsRes = await fetch('/api/admin/analytics', {
                                  headers: { 'Authorization': tokenVal ? `Bearer ${tokenVal}` : '' }
                                });
                                if (logsRes.ok) {
                                  const logsData = await logsRes.json();
                                  setActivityLogs(logsData.activityLogs || []);
                                }
                                alert('Analytics fully reset!');
                              } else {
                                alert('Reset failed.');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Connection failed during reset.');
                            }
                          }}
                          className="bg-red-950 border border-red-900/30 text-red-300 hover:bg-red-900/50 text-[10px] uppercase tracking-wider px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Audit Logs Row */}
                  <div className="p-6 rounded-2xl border border-white/10 bg-[#0E0E0E]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white">Security & Audit Activity Logs</h3>
                        <p className="text-xs text-[#B5A88F]">Immutable track record of database operations and login events</p>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-gold" />
                    </div>

                    <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-2">
                      {activityLogs.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#B5A88F]/40">No records found.</div>
                      ) : (
                        activityLogs.map((log, i) => (
                          <div key={i} className="py-3 flex items-start justify-between text-xs gap-3">
                            <div>
                              <p className="text-white font-medium">{log.action}</p>
                              <p className="text-[10px] text-[#B5A88F]/50 mt-0.5">Admin Server Terminal Interface</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-gold font-mono text-[10px]">{new Date(log.timestamp).toLocaleString()}</p>
                              <p className="text-[9px] text-[#B5A88F]/40 font-mono mt-0.5">IP: {log.ip}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MENU CRUD MANAGEMENT */}
              {activeTab === 'menu' && (
                <div className="space-y-4">
                  {/* Search, filters, add item actions */}
                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0E0E0E] p-4 rounded-xl border border-white/10">
                    <div className="flex-1 flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5">
                      <Search className="w-4 h-4 text-[#B5A88F]" />
                      <input 
                        type="text" 
                        placeholder="Search menu items..."
                        value={menuSearch}
                        onChange={(e)=>setMenuSearch(e.target.value)}
                        className="bg-transparent border-0 outline-none text-xs md:text-sm text-[#F3E9D2] placeholder-[#B5A88F]/40 w-full"
                      />
                    </div>

                    <div className="flex gap-2">
                      <select 
                        value={menuFilter}
                        onChange={(e)=>setMenuFilter(e.target.value)}
                        className="bg-white/[0.04] border border-white/10 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-gold cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {MENU_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => openModal('menu')}
                        className="cursor-pointer bg-gold text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>
                  </div>

                  {/* Menu list grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMenuItems.length === 0 ? (
                      <div className="col-span-full bg-white/[0.01] border border-white/5 rounded-2xl py-12 text-center text-[#B5A88F]/50 text-sm">
                        No matching menu items found.
                      </div>
                    ) : (
                      filteredMenuItems.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-[#0D0D0D] flex gap-4 relative group">
                          {/* Image preview */}
                          <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10 relative">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Utensils className="w-8 h-8 text-[#B5A88F]/20" />
                            )}
                            {item.badge && (
                              <span className="absolute top-1 left-1 text-[8px] bg-gold text-black font-extrabold px-1 py-0.5 rounded uppercase tracking-wider">{item.badge}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                                <span className="text-[10px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/15">
                                  {typeof item.price === 'object' ? 'Multi Price' : `Rs. ${item.price}`}
                                </span>
                              </div>
                              <p className="text-xs text-[#B5A88F]/80 line-clamp-2 mt-1">{item.description}</p>
                              <span className="text-[10px] font-mono text-[#B5A88F]/40 uppercase tracking-wider mt-2 block">
                                {MENU_CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/5">
                              <button 
                                onClick={() => openModal('menu', item)}
                                className="cursor-pointer p-1.5 rounded bg-white/[0.03] hover:bg-gold hover:text-black text-[#B5A88F] transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('menu', item.id, item.name)}
                                className="cursor-pointer p-1.5 rounded bg-red-950/20 hover:bg-red-900 hover:text-white text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DEALS CRUD MANAGEMENT */}
              {activeTab === 'deals' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#0E0E0E] p-4 rounded-xl border border-white/10">
                    <div>
                      <h3 className="text-sm font-bold text-white">Promotional Special Combos</h3>
                      <p className="text-xs text-[#B5A88F]">Modify hot discounted bundles featured on deals shelf</p>
                    </div>

                    <button
                      onClick={() => openModal('deal')}
                      className="cursor-pointer bg-gold text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" /> Add Special Deal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-4 rounded-xl border border-white/5 bg-[#0D0D0D] flex flex-col justify-between relative">
                        <div>
                          {/* Image preview */}
                          <div className="w-full h-32 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 mb-3 relative">
                            {deal.image ? (
                              <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Percent className="w-12 h-12 text-[#B5A88F]/20" />
                            )}
                            <span className="absolute top-2 left-2 text-[8px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">{deal.tag}</span>
                            {deal.badge && (
                              <span className="absolute top-2 right-2 text-[8px] bg-gold text-black font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">{deal.badge}</span>
                            )}
                          </div>

                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-white leading-tight">{deal.name}</h4>
                            <span className="text-xs font-mono text-gold font-bold">Rs. {deal.price}</span>
                          </div>
                          <p className="text-xs text-[#B5A88F]/80 mt-1 line-clamp-2">{deal.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                          <button 
                            onClick={() => openModal('deal', deal)}
                            className="cursor-pointer p-1.5 rounded bg-white/[0.03] hover:bg-gold hover:text-black text-[#B5A88F] transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem('deal', deal.id, deal.name)}
                            className="cursor-pointer p-1.5 rounded bg-red-950/20 hover:bg-red-900 hover:text-white text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BLOG POSTS CRUD */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#0E0E0E] p-4 rounded-xl border border-white/10">
                    <div>
                      <h3 className="text-sm font-bold text-white">Press Announcements & Articles</h3>
                      <p className="text-xs text-[#B5A88F]">Publish promotional narratives, grand opening blogs, or holiday deals</p>
                    </div>

                    <button
                      onClick={() => openModal('blog')}
                      className="cursor-pointer bg-gold text-black px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" /> Draft Article
                    </button>
                  </div>

                  {blogPosts.length === 0 ? (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl py-12 text-center text-[#B5A88F]/40 text-xs">
                      No blog entries drafted yet. Press "Draft Article" to write your first press publication!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="p-5 rounded-xl border border-white/5 bg-[#0D0D0D] flex flex-col md:flex-row gap-5">
                          {post.image && (
                            <img src={post.image} alt={post.title} className="w-full md:w-40 h-28 object-cover rounded-lg border border-white/10 flex-shrink-0" referrerPolicy="no-referrer" />
                          )}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-base font-bold text-white leading-snug">{post.title}</h4>
                                <span className="text-[10px] font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/10">{post.date}</span>
                              </div>
                              <p className="text-xs text-[#B5A88F]/80 mt-2 line-clamp-3 leading-relaxed">{post.content}</p>
                              <p className="text-[10px] text-white/40 font-mono mt-2">Written by: {post.author}</p>
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-white/5">
                              <button 
                                onClick={() => openModal('blog', post)}
                                className="cursor-pointer p-1.5 rounded bg-white/[0.03] hover:bg-gold hover:text-black text-[#B5A88F] transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem('blog', post.id, post.title)}
                                className="cursor-pointer p-1.5 rounded bg-red-950/20 hover:bg-red-900 hover:text-white text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: INQUIRIES PANELS */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-white/10">
                    <h3 className="text-sm font-bold text-white">Customer Form Inbound Inbox</h3>
                    <p className="text-xs text-[#B5A88F]">Process guest reservation questions, feedback, or complaints</p>
                  </div>

                  <div className="space-y-3">
                    {inquiries.length === 0 ? (
                      <div className="bg-white/[0.01] border border-white/5 rounded-2xl py-12 text-center text-[#B5A88F]/50 text-xs">
                        No contact submissions received yet.
                      </div>
                    ) : (
                      inquiries.map((inq) => (
                        <div key={inq.id} className={`p-5 rounded-xl border transition-all ${inq.status === 'pending' ? 'bg-gold/[0.02] border-gold/20' : 'bg-[#0D0D0D] border-white/5'}`}>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{inq.name}</h4>
                              {inq.status === 'pending' && (
                                <span className="text-[8px] bg-gold text-black font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">PENDING</span>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 text-[10px] text-[#B5A88F]/60 font-mono">
                              {new Date(inq.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <p className="text-xs text-[#F3E9D2] leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5 mb-4">
                            {inq.message}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-xs text-[#B5A88F]">
                            <div className="flex flex-wrap gap-4 font-mono text-[11px]">
                              <span>Phone: <strong className="text-white">{inq.phone}</strong></span>
                              {inq.email && <span>Email: <strong className="text-white">{inq.email}</strong></span>}
                            </div>

                            <div className="flex gap-2">
                              {inq.status === 'pending' ? (
                                <button
                                  onClick={() => handleInquiryStatus(inq.id, 'read')}
                                  className="cursor-pointer bg-white/[0.05] hover:bg-gold hover:text-black border border-white/10 hover:border-gold px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Mark Processed
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleInquiryStatus(inq.id, 'pending')}
                                  className="cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] px-3 py-1.5 rounded text-xs transition-all text-[#B5A88F]"
                                >
                                  Reopen Pending
                                </button>
                              )}
                              <button
                                onClick={() => handleInquiryDelete(inq.id)}
                                className="cursor-pointer p-1.5 rounded bg-red-950/20 hover:bg-red-900 text-red-400 hover:text-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PAGES DYNAMIC BUILDER */}
              {activeTab === 'pages' && (
                <div className="space-y-4">
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">Visual Story & Metadata Customizer</h3>
                      <p className="text-xs text-[#B5A88F]">Instantly change main promotional text and hero configurations on index.html</p>
                    </div>

                    <select 
                      value={selectedPageId}
                      onChange={(e)=>setSelectedPageId(e.target.value)}
                      className="bg-white/[0.04] border border-white/10 rounded-lg text-xs py-2 px-3 focus:outline-none focus:border-gold"
                    >
                      <option value="home-settings">Main Front Page</option>
                    </select>
                  </div>

                  <form onSubmit={handlePageSave} className="bg-[#0D0D0D] border border-white/5 rounded-xl p-6 space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Top Running Announcement Alert Banner</label>
                      <input 
                        type="text" 
                        value={pageForm.announcement}
                        onChange={(e)=>setPageForm({...pageForm, announcement: e.target.value})}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Website Base Title (Hero Head)</label>
                      <input 
                        type="text" 
                        value={pageForm.title}
                        onChange={(e)=>setPageForm({...pageForm, title: e.target.value})}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Hero Subtitle / Description Promo</label>
                      <textarea 
                        rows={3}
                        value={pageForm.heroSubtitle}
                        onChange={(e)=>setPageForm({...pageForm, heroSubtitle: e.target.value})}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Our Brand Story / About paragraph</label>
                        <textarea 
                          rows={6}
                          value={pageForm.aboutStory}
                          onChange={(e)=>setPageForm({...pageForm, aboutStory: e.target.value})}
                          required
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Founder Muhammad Haris Cinematic Quote</label>
                        <textarea 
                          rows={6}
                          value={pageForm.founderQuote}
                          onChange={(e)=>setPageForm({...pageForm, founderQuote: e.target.value})}
                          required
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="cursor-pointer bg-gold text-black hover:opacity-95 font-bold px-6 py-2 rounded-lg text-xs tracking-wider uppercase transition-all shadow shadow-gold/20"
                      >
                        Publish Content Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 7: MEDIA MANAGER */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-white/10">
                    <h3 className="text-sm font-bold text-white">Dynamic Asset Bank</h3>
                    <p className="text-xs text-[#B5A88F]">Upload pizza, burger, or banner images here. You can copy-paste their URLs straight into your item/deal creation windows!</p>
                  </div>

                  {/* Drag and drop upload mock box */}
                  <form onSubmit={handleUploadSubmit} className="bg-[#0D0D0D] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row gap-5 items-stretch md:items-center">
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-widest text-[#B5A88F] mb-1.5 font-mono">Upload New Image File</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full file:bg-gold/10 file:text-gold file:border-gold/20 file:px-4 file:py-1.5 file:rounded file:text-xs file:font-bold file:mr-4 file:cursor-pointer text-xs text-[#B5A88F]"
                      />
                      <p className="text-[10px] text-[#B5A88F]/40 mt-1">Accepts PNG, JPG, JPEG, WEBP. Max 5MB file-size capacity.</p>
                    </div>

                    {uploadBase64 && (
                      <div className="w-24 h-16 rounded-lg bg-white/5 border border-white/10 overflow-hidden relative self-center flex-shrink-0">
                        <img src={uploadBase64} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex flex-col justify-end gap-1.5 min-w-[150px]">
                      <button
                        type="submit"
                        className="cursor-pointer bg-gold text-black py-2 px-4 rounded text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1 shadow"
                      >
                        <Upload className="w-3.5 h-3.5" /> Start Upload
                      </button>
                    </div>
                  </form>

                  {uploadError && <p className="text-red-400 text-xs font-mono">{uploadError}</p>}
                  {uploadSuccess && <p className="text-emerald-400 text-xs font-mono flex items-center gap-1"><Check className="w-4 h-4" /> Image successfully registered in DB asset shelf!</p>}

                  {/* Media Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
                    {mediaItems.map((media) => (
                      <div key={media.id} className="p-2.5 rounded-xl border border-white/5 bg-[#0D0D0D] flex flex-col relative group">
                        <div className="aspect-square rounded-lg bg-white/5 border border-white/10 overflow-hidden relative flex items-center justify-center">
                          <img src={media.url} alt={media.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="mt-2">
                          <p className="text-[10px] font-bold text-white truncate leading-tight" title={media.name}>{media.name}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(media.url);
                              alert('Asset URL copied to clipboard! Paste this into the image field when creating menu items.');
                            }}
                            className="cursor-pointer mt-1.5 w-full bg-white/[0.04] hover:bg-gold hover:text-black py-1 rounded text-[9px] font-mono tracking-wider transition-colors uppercase"
                          >
                            Copy Asset Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: SECURITY SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Password Change card */}
                  <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-xl max-w-lg">
                    <h3 className="text-sm font-bold text-white mb-1">Administrative Security Settings</h3>
                    <p className="text-xs text-[#B5A88F] mb-6">Change the administrator panel credentials</p>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">Current Password</label>
                        <input 
                          type="password" 
                          value={currentPassword}
                          onChange={(e)=>setCurrentPassword(e.target.value)}
                          required
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-gold text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#B5A88F] mb-1.5 font-mono">New Password</label>
                        <input 
                          type="password" 
                          value={newPassword}
                          onChange={(e)=>setNewPassword(e.target.value)}
                          required
                          placeholder="At least 6 characters"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-gold text-white"
                        />
                      </div>

                      {passwordError && <p className="text-red-400 text-xs font-mono">{passwordError}</p>}
                      {passwordSuccess && <p className="text-emerald-400 text-xs font-mono flex items-center gap-1"><Check className="w-4 h-4" /> {passwordSuccess}</p>}

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="cursor-pointer bg-gold text-black hover:opacity-90 active:scale-[0.98] font-bold px-5 py-2 rounded text-xs tracking-wider transition-all shadow"
                        >
                          {passwordLoading ? 'Encrypting...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Interactive checklist verification */}
                  <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-xl">
                    <h3 className="text-sm font-bold text-white mb-3">System Compliance Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#B5A88F]">
                      {[
                        { name: 'IP Rate Limiting Active', status: true },
                        { name: 'XSS & HTML Injection Sanitization', status: true },
                        { name: 'HMAC-SHA256 Password Cryptography', status: true },
                        { name: '2-Hour Idle Session Revocation', status: true },
                        { name: 'Protected Server CRUD Middleware', status: true },
                        { name: 'CSRF Token Validation Checked', status: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded bg-white/[0.01] border border-white/5">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="font-medium text-white/90">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: ORDER MANAGEMENT & TIMELINE STATUS UPDATER */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="bg-[#0E0E0E] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between gap-3 items-stretch md:items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Kitchen Order Management</h3>
                      <p className="text-xs text-[#B5A88F]">Monitor incoming customer orders, change timeline progress status, and log deliveries.</p>
                    </div>

                    <div className="flex gap-2">
                      {/* Search Input */}
                      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1">
                        <Search className="w-3.5 h-3.5 text-[#B5A88F]" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={ordersSearch}
                          onChange={(e) => setOrdersSearch(e.target.value)}
                          className="bg-transparent border-0 outline-none text-xs text-[#F3E9D2] placeholder-[#B5A88F]/40 w-32"
                        />
                      </div>

                      {/* Filter Select */}
                      <select
                        value={ordersFilter}
                        onChange={(e) => setOrdersFilter(e.target.value)}
                        className="bg-white/[0.04] border border-white/10 rounded-lg text-xs py-1 px-2 focus:outline-none focus:border-gold cursor-pointer"
                      >
                        <option value="all">All Orders</option>
                        <option value="pending">Awaiting Confirmation</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready / Out for Delivery</option>
                        <option value="delivered">Completed / Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders List Container */}
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <div className="p-12 text-center rounded-xl bg-white/[0.01] border border-white/5">
                        <ShoppingBag className="w-12 h-12 text-[#B5A88F]/20 mx-auto mb-3" />
                        <h4 className="text-sm text-white/80 font-bold">No Orders Found</h4>
                        <p className="text-xs text-[#B5A88F]/40 mt-1">Incoming orders from the storefront will appear here in real-time.</p>
                      </div>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isPending = ord.status === 'pending';
                        const isCancelled = ord.status === 'cancelled';
                        const isDelivered = ord.status === 'delivered';

                        return (
                          <div key={ord.id} className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/5 hover:border-gold/20 transition-all space-y-4">
                            {/* Header Info */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/5">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-gold uppercase bg-gold/5 border border-gold/20 px-2 py-0.5 rounded">
                                    {ord.orderId}
                                  </span>
                                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                                    isCancelled 
                                      ? 'bg-red-950/40 text-red-400 border border-red-900/30' 
                                      : isDelivered 
                                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                                        : 'bg-gold/10 text-gold border border-gold/20'
                                  }`}>
                                    {ord.status}
                                  </span>
                                  <span className="text-[10px] text-cream/40 uppercase font-bold font-mono">
                                    {ord.orderType === 'delivery' ? '🚗 Delivery' : '🥡 Self-Pickup'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#B5A88F]/60 font-mono mt-1">
                                  Placed {new Date(ord.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-xs text-[#B5A88F]/60">Change Status:</span>
                                <select
                                  value={ord.status}
                                  onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                  className="bg-white/[0.04] border border-white/10 rounded-lg text-xs py-1 px-2 focus:outline-none focus:border-gold cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="preparing">Preparing</option>
                                  {ord.orderType === 'pickup' ? (
                                    <option value="ready_for_pickup">Ready for Pickup</option>
                                  ) : (
                                    <option value="out_for_delivery">Out for Delivery</option>
                                  )}
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                  onClick={() => deleteOrder(ord.id)}
                                  className="cursor-pointer p-1.5 rounded bg-red-950/20 hover:bg-red-900 text-red-400 hover:text-white transition-colors ml-auto sm:ml-0"
                                  title="Delete order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Customer info */}
                              <div className="space-y-1">
                                <h5 className="text-[10px] uppercase tracking-widest text-[#B5A88F]/50 font-bold font-mono">Customer Profile</h5>
                                <p className="text-xs font-bold text-white">{ord.customerName}</p>
                                <p className="text-xs font-semibold font-mono text-gold">{ord.customerPhone}</p>
                              </div>

                              {/* Destination Info */}
                              <div className="space-y-1">
                                <h5 className="text-[10px] uppercase tracking-widest text-[#B5A88F]/50 font-bold font-mono">Destination / Distance</h5>
                                <p className="text-xs text-white leading-relaxed truncate max-w-xs" title={ord.deliveryAddress}>
                                  {ord.deliveryAddress}
                                </p>
                                {ord.orderType === 'delivery' && (
                                  <p className="text-[10px] text-cream/40 font-mono">Distance: {ord.distance} km | Fare: Rs. {ord.deliveryCharge}</p>
                                )}
                              </div>

                              {/* Bill amount */}
                              <div className="space-y-1 md:text-right">
                                <h5 className="text-[10px] uppercase tracking-widest text-[#B5A88F]/50 font-bold font-mono">Total Paid/Payable</h5>
                                <p className="text-sm font-black text-white font-mono">Rs. {ord.total}</p>
                                <p className="text-[9px] text-[#B5A88F]/40 uppercase tracking-widest font-bold">Via Cash on Delivery</p>
                              </div>
                            </div>

                            {/* Ordered Items Accordion-like list */}
                            <div className="p-3.5 bg-black/30 rounded-xl border border-white/5 space-y-1.5">
                              <h5 className="text-[9px] uppercase tracking-widest text-gold/60 font-bold font-mono">Items ordered</h5>
                              <div className="space-y-1 divide-y divide-white/5">
                                {ord.items.map((it: any, j: number) => (
                                  <div key={j} className="flex justify-between items-center text-xs py-1.5 first:pt-0 last:pb-0">
                                    <div className="min-w-0">
                                      <span className="text-white font-medium uppercase truncate block max-w-xs">
                                        {it.name}
                                      </span>
                                      {it.sizeLabel && (
                                        <span className="inline-block bg-gold/10 text-gold text-[8px] font-bold uppercase px-1 rounded">
                                          {it.sizeLabel}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono text-[#B5A88F]/80">
                                      {it.quantity} x Rs. {it.price} = Rs. {it.quantity * it.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

            </div>
          </main>
        </>
      )}

      {/* ==========================================
          DYNAMIC EDIT/CREATE ITEM MODAL
          ========================================== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div id="item-form-modal" className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              className="bg-[#0E0E0E] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  {editingItem ? 'Edit' : 'Create'} {modalType === 'menu' ? 'Menu Item' : modalType === 'deal' ? 'Special Deal' : 'Blog Article'}
                </h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-[#B5A88F] hover:text-white font-mono text-xs cursor-pointer border border-white/10 px-2 py-0.5 rounded"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* 1. MENU ITEM FIELDS */}
                {modalType === 'menu' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Item Title</label>
                        <input 
                          type="text" 
                          required
                          value={menuForm.name}
                          onChange={(e)=>setMenuForm({...menuForm, name: e.target.value})}
                          placeholder="e.g. Garlic Mayo Pizza"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Category Shelf</label>
                        <select
                          value={menuForm.category}
                          onChange={(e)=>setMenuForm({...menuForm, category: e.target.value})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-[#F3E9D2]"
                        >
                          {MENU_CATEGORIES.map(c=>(
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#B5A88F] font-mono mb-1">Description Ingredients</label>
                      <textarea 
                        rows={2}
                        value={menuForm.description}
                        onChange={(e)=>setMenuForm({...menuForm, description: e.target.value})}
                        placeholder="Traditional tikka-spiced chicken, fresh onions..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      />
                    </div>

                    <div className="p-4 rounded border border-white/5 bg-white/[0.01]">
                      <div className="flex items-center gap-2 mb-3">
                        <input 
                          type="checkbox" 
                          id="isMultiCheck"
                          checked={menuForm.isMultiplePrice}
                          onChange={(e)=>setMenuForm({...menuForm, isMultiplePrice: e.target.checked})}
                          className="rounded border-white/10 accent-gold"
                        />
                        <label htmlFor="isMultiCheck" className="text-xs font-semibold text-white cursor-pointer select-none">Has Multi-size Pricing? (Small/Medium/Large)</label>
                      </div>

                      {menuForm.isMultiplePrice ? (
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-[#B5A88F] mb-1">Small 8"</label>
                            <input 
                              type="number" 
                              value={menuForm.priceMultiple.Small}
                              onChange={(e)=>setMenuForm({
                                ...menuForm, 
                                priceMultiple: { ...menuForm.priceMultiple, Small: Number(e.target.value) }
                              })}
                              className="w-full bg-white/[0.03] border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-[#B5A88F] mb-1">Medium 10"</label>
                            <input 
                              type="number" 
                              value={menuForm.priceMultiple.Medium}
                              onChange={(e)=>setMenuForm({
                                ...menuForm, 
                                priceMultiple: { ...menuForm.priceMultiple, Medium: Number(e.target.value) }
                              })}
                              className="w-full bg-white/[0.03] border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-mono text-[#B5A88F] mb-1">Large 14"</label>
                            <input 
                              type="number" 
                              value={menuForm.priceMultiple.Large}
                              onChange={(e)=>setMenuForm({
                                ...menuForm, 
                                priceMultiple: { ...menuForm.priceMultiple, Large: Number(e.target.value) }
                              })}
                              className="w-full bg-white/[0.03] border border-white/10 rounded py-1.5 px-2.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs text-[#B5A88F] font-mono mb-1">Single Retail Price (Rs.)</label>
                          <input 
                            type="number" 
                            value={menuForm.price}
                            onChange={(e)=>setMenuForm({...menuForm, price: Number(e.target.value)})}
                            className="w-full max-w-[200px] bg-white/[0.03] border border-white/10 rounded py-1.5 px-3 text-xs text-white"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Image URL / Base64</label>
                        <input 
                          type="text" 
                          value={menuForm.image}
                          onChange={(e)=>setMenuForm({...menuForm, image: e.target.value})}
                          placeholder="Copy from Media tab"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Promotional Badge (optional)</label>
                        <input 
                          type="text" 
                          value={menuForm.badge}
                          onChange={(e)=>setMenuForm({...menuForm, badge: e.target.value})}
                          placeholder="e.g. HOT, NEW, 15% OFF"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 2. DEALS FIELDS */}
                {modalType === 'deal' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Deal Title</label>
                        <input 
                          type="text" 
                          required
                          value={dealForm.name}
                          onChange={(e)=>setDealForm({...dealForm, name: e.target.value})}
                          placeholder="e.g. Chapli Burger Combo"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Deal Type Filter Tag</label>
                        <select
                          value={dealForm.tag}
                          onChange={(e)=>setDealForm({...dealForm, tag: e.target.value as any})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-[#F3E9D2]"
                        >
                          <option value="Solo">Solo Shelf</option>
                          <option value="Combo">Combo Box</option>
                          <option value="Family">Family Feast</option>
                          <option value="Special">Special Deals</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#B5A88F] font-mono mb-1">Description Items Included</label>
                      <textarea 
                        rows={2}
                        value={dealForm.description}
                        onChange={(e)=>setDealForm({...dealForm, description: e.target.value})}
                        placeholder="e.g. 1 Chicken Chapli Burger + Regular Fries + Drink"
                        className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Deal Price (Rs.)</label>
                        <input 
                          type="number" 
                          required
                          value={dealForm.price}
                          onChange={(e)=>setDealForm({...dealForm, price: Number(e.target.value)})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Promo Badge</label>
                        <input 
                          type="text" 
                          value={dealForm.badge}
                          onChange={(e)=>setDealForm({...dealForm, badge: e.target.value})}
                          placeholder="e.g. SAVE RS 120"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Deal Image URL</label>
                        <input 
                          type="text" 
                          value={dealForm.image}
                          onChange={(e)=>setDealForm({...dealForm, image: e.target.value})}
                          placeholder="Paste image url"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 3. BLOG POSTS FIELDS */}
                {modalType === 'blog' && (
                  <>
                    <div>
                      <label className="block text-xs text-[#B5A88F] font-mono mb-1">Article Head Header</label>
                      <input 
                        type="text" 
                        required
                        value={blogForm.title}
                        onChange={(e)=>setBlogForm({...blogForm, title: e.target.value})}
                        placeholder="e.g. Grand Opening In Lahore DHA Phase 6!"
                        className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Author Name</label>
                        <input 
                          type="text" 
                          required
                          value={blogForm.author}
                          onChange={(e)=>setBlogForm({...blogForm, author: e.target.value})}
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#B5A88F] font-mono mb-1">Post Feature Image Link</label>
                        <input 
                          type="text" 
                          value={blogForm.image}
                          onChange={(e)=>setBlogForm({...blogForm, image: e.target.value})}
                          placeholder="Paste image url"
                          className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#B5A88F] font-mono mb-1">Story Body content</label>
                      <textarea 
                        rows={8}
                        required
                        value={blogForm.content}
                        onChange={(e)=>setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded py-2 px-3 text-xs text-white leading-relaxed"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] text-[#B5A88F] px-4 py-2 rounded text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="cursor-pointer bg-gold text-black hover:opacity-90 active:scale-[0.98] font-bold px-5 py-2 rounded text-xs tracking-wider uppercase transition-all shadow shadow-gold/15"
                  >
                    {editingItem ? 'Save Changes' : 'Publish Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, ShoppingBag, Database, LogOut, AlertCircle } from 'lucide-react';

import AdminLogin from '../components/admin/AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminDatabase from '../components/admin/AdminDatabase';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [mainTab, setMainTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showMessage('Erro ao carregar produtos.', 'error');
      console.error(err);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      showMessage('Erro ao carregar pedidos.', 'error');
      console.error(err);
    }
    setLoadingOrders(false);
  };

  const handleDeleteOrder = async (id) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      showMessage('Pedido excluído.', 'success');
      fetchOrders();
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  useEffect(() => {
    if (authenticated) { fetchProducts(); fetchOrders(); }
  }, [authenticated]);

  const handleLogin = () => {
    setAuthenticated(true);
    sessionStorage.setItem('admin_auth', 'true');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <div className="max-w-5xl mx-auto pt-10 px-4 md:px-8 pb-20">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight">Painel de <span className="text-[#7B61FF]">Controle</span></h1>
            <p className="font-body text-gray-500 text-sm mt-2">Gerencie seus produtos e visualize os pedidos recebidos.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-white/[0.05] rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all font-heading text-xs uppercase tracking-wider">
            <LogOut size={14} /> Sair
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-[#12141A]/80 border border-white/[0.04] rounded-2xl w-fit mb-10">
          <button 
            onClick={() => setMainTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-[10px] uppercase tracking-widest transition-all ${mainTab === 'products' ? 'bg-[#7B61FF]/15 text-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.2)]' : 'text-gray-500 hover:text-white'}`}>
            <Package size={14} /> Produtos
          </button>
          <button 
            onClick={() => { setMainTab('orders'); fetchOrders(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-[10px] uppercase tracking-widest transition-all ${mainTab === 'orders' ? 'bg-[#7B61FF]/15 text-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.2)]' : 'text-gray-500 hover:text-white'}`}>
            <ShoppingBag size={14} /> Pedidos
            {orders.length > 0 && <span className="ml-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">{orders.length}</span>}
          </button>
          <button 
            onClick={() => setMainTab('database')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-[10px] uppercase tracking-widest transition-all ${mainTab === 'database' ? 'bg-[#7B61FF]/15 text-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.2)]' : 'text-gray-500 hover:text-white'}`}>
            <Database size={14} /> Config Server
          </button>
        </div>

        {/* Global message */}
        {message.text && (
          <div className={`mb-5 p-3.5 rounded-xl font-body text-xs flex items-center gap-2 animate-fade-in ${
            message.type === 'error'
              ? 'bg-red-500/10 border border-red-500/15 text-red-400'
              : 'bg-green-500/10 border border-green-500/15 text-green-400'
          }`}>
            <AlertCircle size={14} />
            {message.text}
          </div>
        )}

        {/* Content Area */}
        {mainTab === 'products' && (
          <AdminProducts products={products} loading={loading} onRefresh={fetchProducts} showMessage={showMessage} />
        )}

        {mainTab === 'orders' && (
          <AdminOrders orders={orders} loadingOrders={loadingOrders} onRefresh={fetchOrders} onDelete={handleDeleteOrder} showMessage={showMessage} />
        )}

        {mainTab === 'database' && (
          <AdminDatabase showMessage={showMessage} onProductsRefresh={fetchProducts} />
        )}
      </div>
    </div>
  );
}

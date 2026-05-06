import React from 'react';
import { Package, ShoppingBag, Tags, TrendingUp, Clock, User, DollarSign } from 'lucide-react';

export default function AdminDashboard({ products, orders, onNavigate }) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalOrders = orders.length;
  const categories = [...new Set(products.map(p => p.category))].length;
  
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
  const formatCurrency = (val) => `R$ ${Number(val).toFixed(2).replace('.', ',')}`;

  const recentOrders = orders.slice(0, 4);

  const metrics = [
    { label: 'Produtos Ativos', value: activeProducts, total: totalProducts, icon: Package, color: '#7B61FF', bgColor: '#7B61FF' },
    { label: 'Pedidos', value: totalOrders, icon: ShoppingBag, color: '#51e8ff', bgColor: '#51e8ff' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-white text-xl md:text-2xl tracking-tight">
          Painel de <span className="text-[#7B61FF]">Controle</span>
        </h1>
        <p className="font-body text-gray-500 text-xs mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-[#12141A]/80 backdrop-blur border border-white/[0.04] rounded-2xl p-4 hover:border-white/[0.08] transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${m.bgColor}12` }}>
                  <Icon size={17} style={{ color: m.color }} />
                </div>
              </div>
              <p className="font-heading font-bold text-white text-lg md:text-xl leading-none">{m.value}</p>
              {m.total && <p className="font-mono text-[9px] text-gray-600 mt-0.5">de {m.total} total</p>}
              <p className="font-body text-gray-500 text-[10px] mt-1.5 uppercase tracking-wider">{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#12141A]/80 backdrop-blur border border-white/[0.04] rounded-2xl p-5">
        <h3 className="font-heading font-bold text-white text-sm mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onNavigate('products')} className="flex items-center gap-2.5 bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-[#7B61FF] font-heading font-bold text-[10px] uppercase py-3 px-4 rounded-xl hover:bg-[#7B61FF]/20 transition-all cursor-pointer">
            <Package size={15} /> Novo Produto
          </button>
          <button onClick={() => onNavigate('orders')} className="flex items-center gap-2.5 bg-[#51e8ff]/10 border border-[#51e8ff]/20 text-[#51e8ff] font-heading font-bold text-[10px] uppercase py-3 px-4 rounded-xl hover:bg-[#51e8ff]/20 transition-all cursor-pointer">
            <ShoppingBag size={15} /> Ver Pedidos
          </button>
        </div>
      </div>
    </div>
  );
}

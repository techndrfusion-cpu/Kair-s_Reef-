import React from 'react';
import { ShoppingBag, User, Calendar, DollarSign, MapPin, Trash2, RefreshCcw } from 'lucide-react';

export default function AdminOrders({ orders, loadingOrders, onRefresh, onDelete, showMessage }) {
  const formatCurrency = (val) => {
    if (!val) return '—';
    return `R$ ${Number(val).toFixed(2).replace('.', ',')}`;
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir pedido de "${name}"?`)) return;
    onDelete(id);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-white text-xl tracking-tight">Pedidos</h2>
          <p className="font-body text-gray-500 text-xs mt-0.5">{orders.length} pedido(s) recebido(s)</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-2 bg-[#12141A] border border-white/[0.06] text-gray-400 font-heading font-bold py-2 px-4 text-[10px] rounded-xl hover:text-white hover:border-white/[0.1] transition-all cursor-pointer">
          <RefreshCcw size={13} /> Atualizar
        </button>
      </div>

      {/* Content */}
      {loadingOrders ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-gray-500 text-sm">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-[#12141A]/80 border border-white/[0.04] rounded-2xl">
          <ShoppingBag size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="font-heading text-white text-base mb-1">Nenhum pedido recebido</p>
          <p className="font-body text-gray-500 text-xs">Os pedidos aparecerão aqui automaticamente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#12141A]/80 border border-white/[0.04] rounded-2xl overflow-hidden hover:border-white/[0.08] transition-all">
              {/* Order header */}
              <div className="p-4 md:p-5 border-b border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7B61FF]/10 text-[#7B61FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-white text-xs">{order.customer_name}</h4>
                      <span className="font-mono text-[8px] text-gray-600 bg-white/[0.03] px-1.5 py-0.5 rounded">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar size={10} className="text-gray-600" />
                      <span className="font-mono text-gray-500 text-[10px]">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-[#51e8ff] font-bold text-base">{formatCurrency(order.total_price)}</p>
                    <p className="font-mono text-gray-600 text-[9px] uppercase">{order.total_items} Itens</p>
                  </div>
                  <button onClick={() => handleDelete(order.id, order.customer_name)}
                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer" title="Excluir pedido">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Order details */}
              <div className="p-4 md:p-5 bg-[#0D0D14]/40 flex flex-col md:flex-row gap-5 md:gap-10">
                {/* Contact */}
                <div className="flex-1 space-y-2 border-b md:border-b-0 md:border-r border-white/[0.04] pb-3 md:pb-0 md:pr-4">
                  <h5 className="font-heading font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-2">Contato & Entrega</h5>
                  <div className="flex items-start gap-2 text-gray-400 text-xs">
                    <User size={13} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <span>{order.customer_email || 'Não informado'} <span className="text-[#7B61FF]">{order.customer_phone}</span></span>
                  </div>
                  {order.address && (
                    <div className="flex items-start gap-2 text-gray-400 text-xs">
                      <MapPin size={13} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <span>{order.address}</span>
                    </div>
                  )}
                </div>
                {/* Items */}
                <div className="flex-1">
                  <h5 className="font-heading font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-2">Itens do Pedido</h5>
                  <ul className="space-y-1.5">
                    {order.items && order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-[#1A1C24]/80 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#51e8ff] text-[9px] bg-[#51e8ff]/10 px-1.5 py-0.5 rounded">{item.quantity}x</span>
                          <span className="font-body text-gray-300 text-[11px] truncate max-w-[150px] sm:max-w-xs">{item.name}</span>
                        </div>
                        <span className="font-mono text-gray-500 text-[10px]">{item.price_str || 'Sob consulta'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

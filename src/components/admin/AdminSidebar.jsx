import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Database, LogOut, X } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
  { id: 'database', label: 'Config', icon: Database },
];

export default function AdminSidebar({ activeTab, onTabChange, onLogout, orderCount, mobileOpen, onMobileClose }) {
  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] bg-[#0D0D12]/95 backdrop-blur-xl border-r border-white/[0.04] flex-col z-50">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B61FF] to-[#51e8ff] flex items-center justify-center shadow-lg shadow-[#7B61FF]/20">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm text-white tracking-tight block leading-none">KAIRÓS</span>
              <span className="font-heading font-bold text-[8px] tracking-[0.25em] text-[#ff4add]">ADMIN</span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer group
                  ${isActive
                    ? 'bg-[#7B61FF]/15 text-[#7B61FF] shadow-sm shadow-[#7B61FF]/5'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                  }`}
              >
                <Icon size={17} className={isActive ? 'text-[#7B61FF]' : 'text-gray-600 group-hover:text-gray-400'} />
                {tab.label}
                {tab.id === 'orders' && orderCount > 0 && (
                  <span className="ml-auto bg-[#7B61FF] text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono">{orderCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-white/[0.04] pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading font-bold text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut size={17} /> Sair
          </button>
          <p className="text-[9px] font-mono text-gray-700 mt-3 px-3 tracking-wider">v2.0 • SYSTEM OK</p>
        </div>
      </aside>

      {/* ─── MOBILE BOTTOM TABS ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D12]/95 backdrop-blur-xl border-t border-white/[0.06] z-50 px-2 py-1.5 flex justify-around">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[9px] font-heading font-bold transition-all cursor-pointer relative
                ${isActive ? 'text-[#7B61FF]' : 'text-gray-600'}`}
            >
              {isActive && <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#7B61FF]" />}
              <Icon size={18} />
              {tab.label}
              {tab.id === 'orders' && orderCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-[#7B61FF] text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{orderCount}</span>
              )}
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[9px] font-heading font-bold text-gray-600 hover:text-red-400 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          Sair
        </button>
      </nav>
    </>
  );
}

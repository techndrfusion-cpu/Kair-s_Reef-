import React, { useState } from 'react';
import { Database, RefreshCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ALL_PRODUCTS } from '../../data/products';

const SQL_SETUP = `
-- 1. CRIAR AS TABELAS
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  subcategory text,
  price_cash numeric,
  price_card numeric,
  image_url text,
  description text,
  tag text,
  installments text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  address text,
  total_price numeric,
  total_items integer,
  items jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  icon text default '📦',
  parent_id uuid references public.categories(id) on delete cascade,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. DESATIVAR RLS TEMPORARIAMENTE
alter table public.products disable row level security;
alter table public.orders disable row level security;
alter table public.categories disable row level security;

-- 3. BUCKET DE IMAGENS
-- Acesse 'Storage' no painel Supabase
-- Crie o bucket "products", edite a política p/ "Public"
`;

export default function AdminDatabase({ showMessage, onProductsRefresh }) {
  const [syncing, setSyncing] = useState(false);

  const handleSyncDatabase = async () => {
    if (!confirm(`Deseja injetar ${ALL_PRODUCTS.length} produtos predefinidos?`)) return;
    setSyncing(true);
    try {
      const payload = ALL_PRODUCTS.map(p => ({
        name: p.name,
        category: p.category,
        subcategory: p.subcategory || null,
        price_cash: p.price_cash,
        price_card: p.price_card,
        image_url: p.img,
        description: p.desc || '',
        tag: p.tag || '',
        installments: p.installments || '6x sem juros',
        is_active: true
      }));

      const { error } = await supabase.from('products').insert(payload);
      if (error) throw error;

      showMessage('Catálogo Injetado com sucesso!', 'success');
      onProductsRefresh();
    } catch (err) {
      console.error(err);
      showMessage(`Falha: ${err.message}`, 'error');
    }
    setSyncing(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="font-heading font-bold text-white text-xl tracking-tight">Configuração do Servidor</h2>
        <p className="font-body text-gray-500 text-xs mt-0.5">Setup do banco de dados Supabase</p>
      </div>

      <div className="bg-[#12141A]/80 border border-[#7B61FF]/20 rounded-2xl p-5 md:p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#7B61FF]/15 text-[#7B61FF] rounded-xl flex items-center justify-center">
            <Database size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">Diagnóstico do Banco</h3>
            <p className="font-body text-gray-500 text-[11px]">Se produtos não carregam ou não pode adicionar</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-[#0D0D14]/80 border border-white/[0.04] rounded-xl p-4">
            <h4 className="font-heading font-bold text-[#51e8ff] text-xs mb-2 flex items-center gap-2">
              <span className="bg-[#51e8ff]/15 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              Criar Tabelas no Supabase
            </h4>
            <p className="font-body text-gray-500 text-[11px] mb-3">
              Abra seu Supabase → <strong>SQL Editor</strong> → rode este código:
            </p>
            <pre className="font-mono text-[10px] text-gray-400 bg-[#1A1C24] p-3 rounded-lg overflow-x-auto border border-white/[0.04] select-all cursor-text whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {SQL_SETUP}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0D0D14]/80 border border-white/[0.04] rounded-xl p-4">
            <h4 className="font-heading font-bold text-[#51e8ff] text-xs mb-2 flex items-center gap-2">
              <span className="bg-[#51e8ff]/15 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              Injetar Catálogo
            </h4>
            <p className="font-body text-gray-500 text-[11px] mb-3">
              Com as tabelas criadas, injete os {ALL_PRODUCTS.length} produtos base:
            </p>
            <button
              onClick={handleSyncDatabase}
              disabled={syncing}
              className="flex items-center gap-2 bg-[#7B61FF] text-white font-heading font-bold py-3 px-5 text-[10px] uppercase rounded-xl tracking-wider cursor-pointer hover:bg-[#6B51EF] transition-all disabled:opacity-50"
            >
              {syncing ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RefreshCcw size={14} />}
              {syncing ? 'Sincronizando...' : `Injetar Catálogo (${ALL_PRODUCTS.length} itens)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

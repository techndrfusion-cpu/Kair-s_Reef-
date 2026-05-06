import React, { useState, useRef } from 'react';
import { Plus, X, Trash2, Edit3, Eye, EyeOff, Search, RefreshCcw, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CATEGORY_TREE } from '../../data/products';
import ProductForm from './ProductForm';
import AdminCatalogManager from './AdminCatalogManager';

const EMPTY_FORM = {
  name: '', category: 'peixes', subcategory: '', price_cash: '', price_card: '',
  image_url: '', description: '', tag: '', installments: '6x sem juros',
};

export default function AdminProducts({ products, loading, onRefresh, showMessage }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [removingDups, setRemovingDups] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const fileInputRef = useRef(null);

  const formatCurrency = (val) => val ? `R$ ${Number(val).toFixed(2).replace('.', ',')}` : '—';

  const clearImage = () => { setImageFile(null); setImagePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { showMessage('Apenas imagens', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showMessage('Máximo 5MB', 'error'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file) => {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('products').upload(`products/${name}`, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(`products/${name}`);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image_url;
    if (imageFile) {
      setUploading(true);
      try { imageUrl = await uploadImage(imageFile); } catch (err) {
        showMessage('Erro ao subir imagem. Verifique permissões do Storage.', 'error');
        setUploading(false); return;
      }
      setUploading(false);
    }
    if (!imageUrl) { showMessage('Adicione uma imagem.', 'error'); return; }

    const payload = {
      name: formData.name, 
      category: formData.category === '__new__' ? (formData.new_category || 'nova-categoria') : formData.category,
      subcategory: formData.subcategory === '__new__' ? (formData.new_subcategory || '') : (formData.subcategory || null),
      price_cash: formData.price_cash ? parseFloat(formData.price_cash) : null,
      price_card: formData.price_card ? parseFloat(formData.price_card) : null,
      image_url: imageUrl, description: formData.description,
      tag: formData.tag, installments: formData.installments, is_active: true,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        showMessage('Produto atualizado!', 'success');
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        showMessage('Produto cadastrado!', 'success');
      }
      setFormData(EMPTY_FORM); setEditingId(null); setShowForm(false); clearImage(); onRefresh();
    } catch (err) { showMessage(`Erro: ${err.message}`, 'error'); }
  };

  const handleEdit = (p) => {
    setFormData({ name: p.name || '', category: p.category || 'peixes', subcategory: p.subcategory || '', price_cash: p.price_cash || '', price_card: p.price_card || '', image_url: p.image_url || '', description: p.description || '', tag: p.tag || '', installments: p.installments || '6x sem juros' });
    setImagePreview(p.image_url || ''); setImageFile(null); setEditingId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Excluir "${name}"?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showMessage('Produto excluído.', 'success'); onRefresh();
    } catch (err) { showMessage(`Erro: ${err.message}`, 'error'); }
  };

  const handleToggleActive = async (id, current) => {
    try {
      const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (err) { showMessage(`Erro: ${err.message}`, 'error'); }
  };

  const handleRemoveDups = async () => {
    const seen = new Map();
    const dupIds = [];
    [...products].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach(p => {
      const key = `${p.name.trim().toLowerCase()}||${p.category}`;
      if (seen.has(key)) dupIds.push(p.id); else seen.set(key, p.id);
    });
    if (dupIds.length === 0) { showMessage('Nenhum duplicado! 🎉', 'success'); return; }
    if (!confirm(`Encontrados ${dupIds.length} duplicado(s). Remover?`)) return;
    setRemovingDups(true);
    try {
      for (let i = 0; i < dupIds.length; i += 50) {
        const { error } = await supabase.from('products').delete().in('id', dupIds.slice(i, i + 50));
        if (error) throw error;
      }
      showMessage(`${dupIds.length} duplicado(s) removido(s)!`, 'success'); onRefresh();
    } catch (err) { showMessage(`Erro: ${err.message}`, 'error'); }
    setRemovingDups(false);
  };

  const cancelEdit = () => { setFormData(EMPTY_FORM); setEditingId(null); setShowForm(false); clearImage(); };

  const cats = ['todos', ...new Set([...CATEGORY_TREE.map(c => c.id), ...new Set(products.map(p => p.category))])];
  const filtered = products
    .filter(p => filter === 'todos' || p.category === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const defaultCats = CATEGORY_TREE.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});
  const catLabels = { todos: 'Todos', peixes: '🐟 Peixes', 'peixes-doce': '🐟 Peixes Doce', invertebrados: '🦐 Invertebrados', corais: '🪸 Corais', equipamentos: '⚙️ Equipamentos', ...defaultCats };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="font-heading font-bold text-white text-xl tracking-tight">Produtos Cadastrados ({products.length})</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleRemoveDups} disabled={removingDups} className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 font-heading font-bold py-2 px-4 text-[10px] uppercase rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
            {removingDups ? <RefreshCcw size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Remover Duplicados
          </button>
          <button onClick={() => { if (showForm) cancelEdit(); else { setFormData(EMPTY_FORM); setEditingId(null); clearImage(); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            className="flex items-center gap-1.5 bg-[#7B61FF] text-white font-heading font-bold py-2 px-4 text-[10px] uppercase rounded-xl cursor-pointer hover:bg-[#6B51EF] transition-all shadow-[0_0_15px_rgba(123,97,255,0.4)]">
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Fechar' : 'Novo Produto'}
          </button>
        </div>
      </div>

      {showForm && (
        <ProductForm formData={formData} setFormData={setFormData} editingId={editingId}
          onSubmit={handleSubmit} onCancel={cancelEdit} imageFile={imageFile} imagePreview={imagePreview}
          onImageSelect={handleImageSelect} onClearImage={() => { clearImage(); setFormData(prev => ({ ...prev, image_url: '' })); }}
          uploading={uploading} fileInputRef={fileInputRef} products={products} onRefresh={onRefresh} showMessage={showMessage} />
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {cats.map(c => {
          const label = c === 'todos' ? 'Todos' : catLabels[c] || c;
          return (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2.5 text-[10px] font-heading font-bold uppercase tracking-widest whitespace-nowrap cursor-pointer rounded-xl transition-all
                ${filter === c ? 'bg-[#7B61FF]/15 text-[#7B61FF] border border-[#7B61FF]/20 shadow-[0_0_15px_rgba(123,97,255,0.4)]' : 'bg-[#1A1C24] text-gray-500 border border-white/[0.03] hover:text-white hover:border-white/[0.1]'}`}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-[#7B61FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-gray-500 text-xs">Carregando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#12141A]/80 border border-white/[0.04] rounded-2xl">
          <p className="font-heading text-white text-sm mb-1">Nenhum produto encontrado</p>
          <p className="font-body text-gray-500 text-[11px]">{products.length === 0 ? 'Configure o Supabase e cadastre produtos.' : 'Tente outro filtro.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(p => (
            <div key={p.id} className={`bg-[#1A1C24]/80 border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/[0.08] transition-all ${p.is_active ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-white text-[11px] lg:text-xs uppercase leading-tight">{p.name}</h4>
                    {!p.is_active && <span className="text-[7px] font-mono bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full">OFF</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[8px] font-mono bg-[#7B61FF]/10 text-[#7B61FF] px-2 py-0.5 rounded-full">{p.category}</span>
                    <p className="font-mono text-gray-500 text-[9px]">
                      À vista: {formatCurrency(p.price_cash)} <span className="mx-1">|</span> Cartão: {formatCurrency(p.price_card)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggleActive(p.id, p.is_active)} className={`p-1.5 transition-all cursor-pointer hover:scale-110 ${p.is_active ? 'text-green-400' : 'text-gray-600'}`} title={p.is_active ? 'Desativar' : 'Ativar'}>
                  {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => handleEdit(p)} className="p-1.5 text-[#51e8ff] transition-all cursor-pointer hover:scale-110" title="Editar">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-red-400 transition-all cursor-pointer hover:scale-110" title="Excluir">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Gerenciar Categorias */}
      <AdminCatalogManager
        show={showCatalog}
        onClose={() => setShowCatalog(false)}
        products={products}
        onRefresh={onRefresh}
        showMessage={showMessage}
      />
    </div>
  );
}

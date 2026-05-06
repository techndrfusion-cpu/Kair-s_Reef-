import React, { useState, useRef, useEffect } from 'react';
import { Save, X, Image, Plus, Edit3, Trash2, Settings } from 'lucide-react';
import { CATEGORY_TREE } from '../../data/products';
import { supabase } from '../../lib/supabase';

// ── Mini dropdown para ações de gerenciamento ──
function ManageDropdown({ children, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`p-1 rounded-lg cursor-pointer transition-all ${open ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
        title={`Gerenciar ${label}`}
      >
        <Settings size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#1A1C24] border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50 min-w-[160px] animate-fade-in">
          {React.Children.map(children, child =>
            child ? React.cloneElement(child, { onDone: () => setOpen(false) }) : null
          )}
        </div>
      )}
    </div>
  );
}

// ── Item do dropdown ──
function DropdownItem({ icon: Icon, label, color, onClick, onDone, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => { onClick(); if (onDone) onDone(); }}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left font-heading text-[10px] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed
        ${color === 'red' ? 'text-red-400 hover:bg-red-500/10' : color === 'blue' ? 'text-[#51e8ff] hover:bg-[#51e8ff]/10' : 'text-[#ff4add] hover:bg-[#ff4add]/10'}`}
    >
      <Icon size={12} />
      {label}
    </button>
  );
}

export default function ProductForm({ formData, setFormData, editingId, onSubmit, onCancel, imageFile, imagePreview, onImageSelect, onClearImage, uploading, fileInputRef, products, onRefresh, showMessage }) {
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDrop = (e) => { e.preventDefault(); onImageSelect(e.dataTransfer.files[0]); };

  // State para gerenciamento inline
  const [catMode, setCatMode] = useState('select'); // 'select' | 'add' | 'rename'
  const [subMode, setSubMode] = useState('select'); // 'select' | 'add' | 'rename'
  const [newCatInput, setNewCatInput] = useState('');
  const [newSubInput, setNewSubInput] = useState('');
  const [renameCatInput, setRenameCatInput] = useState('');
  const [renameSubInput, setRenameSubInput] = useState('');

  // Build dynamic categories from CATEGORY_TREE + existing products
  const getCategories = () => {
    const catMap = new Map();
    CATEGORY_TREE.forEach(c => catMap.set(c.id, { name: c.name, icon: c.icon || '' }));
    if (products) {
      products.forEach(p => {
        if (p.category && !catMap.has(p.category)) {
          catMap.set(p.category, { name: p.category, icon: '📦' });
        }
      });
    }
    return Array.from(catMap.entries()).map(([id, { name, icon }]) => ({ id, name, icon }));
  };

  // Build dynamic subcategories for selected category
  const getSubcategories = () => {
    const subMap = new Map();
    const cat = CATEGORY_TREE.find(c => c.id === formData.category);
    if (cat?.subcategories) {
      cat.subcategories.forEach(s => subMap.set(s.id, s.name));
    }
    if (products) {
      products.filter(p => p.category === formData.category && p.subcategory)
        .forEach(p => {
          if (!subMap.has(p.subcategory)) subMap.set(p.subcategory, p.subcategory);
        });
    }
    return Array.from(subMap.entries()).map(([id, name]) => ({ id, name }));
  };

  const allCats = getCategories();
  const allSubs = getSubcategories();

  // ── ADICIONAR ──
  const handleAddNewCategory = () => {
    const name = newCatInput.trim();
    if (!name) return;
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, category: slug, subcategory: '' }));
    setNewCatInput('');
    setCatMode('select');
    if (showMessage) showMessage(`Categoria "${name}" pronta para uso!`, 'success');
  };

  const handleAddNewSubcategory = () => {
    const name = newSubInput.trim();
    if (!name) return;
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, subcategory: slug }));
    setNewSubInput('');
    setSubMode('select');
    if (showMessage) showMessage(`Subcategoria "${name}" pronta para uso!`, 'success');
  };

  // ── RENOMEAR CATEGORIA ──
  const startRenameCat = () => {
    const currentCat = allCats.find(c => c.id === formData.category);
    setRenameCatInput(currentCat?.name || formData.category);
    setCatMode('rename');
  };

  const handleRenameCategory = async () => {
    const newName = renameCatInput.trim();
    if (!newName) return;
    const oldCat = formData.category;
    const newSlug = newName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const { error } = await supabase.from('products').update({ category: newSlug }).eq('category', oldCat);
      if (error) throw error;
      setFormData(prev => ({ ...prev, category: newSlug }));
      if (showMessage) showMessage(`Categoria renomeada para "${newName}"!`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showMessage) showMessage(`Erro: ${err.message}`, 'error');
    }
    setCatMode('select');
    setRenameCatInput('');
  };

  // ── EXCLUIR CATEGORIA ──
  const handleDeleteCategory = async () => {
    const catName = formData.category;
    const currentCat = allCats.find(c => c.id === catName);
    const displayName = currentCat?.name || catName;
    const count = products ? products.filter(p => p.category === catName).length : 0;
    if (!confirm(`Excluir categoria "${displayName}"?\n\n${count} produto(s) serão movidos para "sem-categoria".`)) return;
    try {
      const { error } = await supabase.from('products').update({ category: 'sem-categoria' }).eq('category', catName);
      if (error) throw error;
      setFormData(prev => ({ ...prev, category: allCats[0]?.id || 'peixes', subcategory: '' }));
      if (showMessage) showMessage(`Categoria "${displayName}" excluída!`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showMessage) showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  // ── RENOMEAR SUBCATEGORIA ──
  const startRenameSub = () => {
    const currentSub = allSubs.find(s => s.id === formData.subcategory);
    setRenameSubInput(currentSub?.name || formData.subcategory);
    setSubMode('rename');
  };

  const handleRenameSubcategory = async () => {
    const newName = renameSubInput.trim();
    if (!newName) return;
    const oldSub = formData.subcategory;
    const newSlug = newName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const { error } = await supabase.from('products').update({ subcategory: newSlug }).eq('category', formData.category).eq('subcategory', oldSub);
      if (error) throw error;
      setFormData(prev => ({ ...prev, subcategory: newSlug }));
      if (showMessage) showMessage(`Subcategoria renomeada para "${newName}"!`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showMessage) showMessage(`Erro: ${err.message}`, 'error');
    }
    setSubMode('select');
    setRenameSubInput('');
  };

  // ── EXCLUIR SUBCATEGORIA ──
  const handleDeleteSubcategory = async () => {
    const subName = formData.subcategory;
    if (!subName) return;
    const currentSub = allSubs.find(s => s.id === subName);
    const displayName = currentSub?.name || subName;
    const count = products ? products.filter(p => p.category === formData.category && p.subcategory === subName).length : 0;
    if (!confirm(`Excluir subcategoria "${displayName}"?\n\n${count} produto(s) ficarão sem subcategoria.`)) return;
    try {
      const { error } = await supabase.from('products').update({ subcategory: null }).eq('category', formData.category).eq('subcategory', subName);
      if (error) throw error;
      setFormData(prev => ({ ...prev, subcategory: '' }));
      if (showMessage) showMessage(`Subcategoria "${displayName}" excluída!`, 'success');
      if (onRefresh) onRefresh();
    } catch (err) {
      if (showMessage) showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const cancelMode = (type) => {
    if (type === 'cat') { setCatMode('select'); setNewCatInput(''); setRenameCatInput(''); }
    else { setSubMode('select'); setNewSubInput(''); setRenameSubInput(''); }
  };

  const inputClass = "w-full bg-[#0D0D14]/80 border border-white/[0.06] rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#7B61FF]/40 focus:shadow-[0_0_0_3px_rgba(123,97,255,0.08)] transition-all";
  const labelClass = "font-heading text-[10px] uppercase tracking-wider text-gray-500 ml-1";

  return (
    <div className="bg-[#12141A]/80 border border-white/[0.04] rounded-2xl p-5 md:p-6 mb-5">
      <h3 className="font-heading font-bold text-white text-sm mb-5">
        {editingId ? '✏️ Editar Produto' : '➕ Novo Produto'}
      </h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Nome do Produto *</label>
          <input required name="name" value={formData.name} onChange={handleChange} className={inputClass} />
        </div>

        {/* ═══ CATEGORIA ═══ */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Categoria *</label>
            <ManageDropdown label="categoria">
              <DropdownItem icon={Plus} label="Nova categoria" color="pink" onClick={() => setCatMode('add')} />
              <DropdownItem icon={Edit3} label="Renomear" color="blue" onClick={startRenameCat} disabled={!formData.category} />
              <DropdownItem icon={Trash2} label="Excluir" color="red" onClick={handleDeleteCategory} disabled={!formData.category} />
            </ManageDropdown>
          </div>

          {catMode === 'rename' ? (
            <div className="flex gap-2">
              <input value={renameCatInput} onChange={e => setRenameCatInput(e.target.value)} placeholder="Novo nome..."
                className={`${inputClass} flex-1 border-[#51e8ff]/30 focus:border-[#51e8ff]/60`} autoFocus
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleRenameCategory())} />
              <button type="button" onClick={handleRenameCategory} className="bg-[#51e8ff]/20 text-[#51e8ff] px-3 rounded-xl hover:bg-[#51e8ff]/30 cursor-pointer text-xs font-bold transition-all flex items-center gap-1">
                <Save size={12} /> Salvar
              </button>
              <button type="button" onClick={() => cancelMode('cat')} className="bg-white/5 text-gray-400 px-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center">
                <X size={14} />
              </button>
            </div>
          ) : catMode === 'add' ? (
            <div className="flex gap-2">
              <input value={newCatInput} onChange={e => setNewCatInput(e.target.value)} placeholder="Nome da nova categoria..."
                className={`${inputClass} flex-1 border-[#ff4add]/30 focus:border-[#ff4add]/60`} autoFocus
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())} />
              <button type="button" onClick={handleAddNewCategory} className="bg-[#ff4add]/20 text-[#ff4add] px-3 rounded-xl hover:bg-[#ff4add]/30 cursor-pointer text-xs font-bold transition-all flex items-center">
                <Plus size={14} />
              </button>
              <button type="button" onClick={() => cancelMode('cat')} className="bg-white/5 text-gray-400 px-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center">
                <X size={14} />
              </button>
            </div>
          ) : (
            <select name="category" value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subcategory: '' }))} className={`${inputClass} cursor-pointer`}>
              {allCats.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
            </select>
          )}
        </div>

        {/* ═══ SUBCATEGORIA ═══ */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Subcategoria</label>
            <ManageDropdown label="subcategoria">
              <DropdownItem icon={Plus} label="Nova subcategoria" color="pink" onClick={() => setSubMode('add')} />
              <DropdownItem icon={Edit3} label="Renomear" color="blue" onClick={startRenameSub} disabled={!formData.subcategory} />
              <DropdownItem icon={Trash2} label="Excluir" color="red" onClick={handleDeleteSubcategory} disabled={!formData.subcategory} />
            </ManageDropdown>
          </div>

          {subMode === 'rename' ? (
            <div className="flex gap-2">
              <input value={renameSubInput} onChange={e => setRenameSubInput(e.target.value)} placeholder="Novo nome..."
                className={`${inputClass} flex-1 border-[#51e8ff]/30 focus:border-[#51e8ff]/60`} autoFocus
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleRenameSubcategory())} />
              <button type="button" onClick={handleRenameSubcategory} className="bg-[#51e8ff]/20 text-[#51e8ff] px-3 rounded-xl hover:bg-[#51e8ff]/30 cursor-pointer text-xs font-bold transition-all flex items-center gap-1">
                <Save size={12} /> Salvar
              </button>
              <button type="button" onClick={() => cancelMode('sub')} className="bg-white/5 text-gray-400 px-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center">
                <X size={14} />
              </button>
            </div>
          ) : subMode === 'add' ? (
            <div className="flex gap-2">
              <input value={newSubInput} onChange={e => setNewSubInput(e.target.value)} placeholder="Nome da nova subcategoria..."
                className={`${inputClass} flex-1 border-[#51e8ff]/30 focus:border-[#51e8ff]/60`} autoFocus
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddNewSubcategory())} />
              <button type="button" onClick={handleAddNewSubcategory} className="bg-[#51e8ff]/20 text-[#51e8ff] px-3 rounded-xl hover:bg-[#51e8ff]/30 cursor-pointer text-xs font-bold transition-all flex items-center">
                <Plus size={14} />
              </button>
              <button type="button" onClick={() => cancelMode('sub')} className="bg-white/5 text-gray-400 px-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center">
                <X size={14} />
              </button>
            </div>
          ) : (
            <select name="subcategory" value={formData.subcategory || ''} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              <option value="">— Nenhuma —</option>
              {allSubs.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
          )}
        </div>

        {/* Tag */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Tag / Tipo</label>
          <input name="tag" value={formData.tag} onChange={handleChange} placeholder="Ex: Popular, Premium" className={`${inputClass} placeholder:text-gray-700`} />
        </div>

        {/* Preço à vista */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Preço à Vista (R$)</label>
          <input name="price_cash" type="number" step="0.01" value={formData.price_cash} onChange={handleChange} placeholder="Vazio = Consultar" className={`${inputClass} placeholder:text-gray-700`} />
        </div>

        {/* Preço cartão */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Preço Cartão (R$)</label>
          <input name="price_card" type="number" step="0.01" value={formData.price_card} onChange={handleChange} placeholder="Vazio = Consultar" className={`${inputClass} placeholder:text-gray-700`} />
        </div>

        {/* Parcelamento */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Parcelamento</label>
          <input name="installments" value={formData.installments} onChange={handleChange} className={inputClass} />
        </div>

        {/* Imagem */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Imagem *</label>
          <div className="flex gap-3 items-start">
            <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              className="flex-1 bg-[#0D0D14]/80 border-2 border-dashed border-white/[0.06] hover:border-[#7B61FF]/30 rounded-xl p-5 text-center cursor-pointer transition-all group">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImageSelect(e.target.files[0])} />
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-[#7B61FF]/10 flex items-center justify-center group-hover:bg-[#7B61FF]/15 transition-colors">
                  <Image size={18} className="text-[#7B61FF]" />
                </div>
                <p className="font-heading font-semibold text-white text-[10px]">Clique ou arraste</p>
                <p className="font-mono text-gray-600 text-[8px]">JPG, PNG, WebP • Máx. 5MB</p>
              </div>
            </div>
            <div className="w-24 h-24 bg-[#0D0D14] rounded-xl overflow-hidden border border-white/[0.06] flex-shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-1.5" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); onClearImage(); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-red-500">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-700"><Image size={20} /><span className="text-[7px] font-mono">SEM IMAGEM</span></div>
              )}
            </div>
          </div>
          {imageFile && <p className="font-mono text-[9px] text-[#51e8ff] mt-1 ml-1">📎 {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)</p>}
        </div>

        {/* Descrição */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className={labelClass}>Descrição</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} />
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex gap-2 mt-1">
          <button type="submit" disabled={uploading} className="flex items-center gap-2 bg-[#7B61FF] text-white font-heading font-bold py-2.5 px-5 text-[10px] uppercase rounded-xl tracking-wider cursor-pointer hover:bg-[#6B51EF] transition-all disabled:opacity-50">
            {uploading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={13} />}
            {uploading ? 'Enviando...' : editingId ? 'Salvar' : 'Cadastrar'}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="flex items-center gap-2 bg-[#1A1C24] border border-white/[0.06] text-gray-400 font-heading font-bold py-2.5 px-5 text-[10px] rounded-xl cursor-pointer hover:text-white transition-all">
              <X size={13} /> Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

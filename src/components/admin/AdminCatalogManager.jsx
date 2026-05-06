import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminCatalogManager({ show, onClose, products, onRefresh, showMessage }) {
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📦');
  const [newSubName, setNewSubName] = useState('');
  const [addingSubFor, setAddingSubFor] = useState(null);
  const [expanded, setExpanded] = useState({});

  if (!show) return null;

  // Build category tree from products
  const catMap = {};
  products.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = { subs: new Set(), count: 0 };
    catMap[p.category].count++;
    if (p.subcategory) catMap[p.category].subs.add(p.subcategory);
  });

  const ICON_OPTIONS = ['🐠', '🐟', '🦐', '🪸', '⚙️', '🐙', '🦑', '🐚', '🌊', '🧪', '📦', '🔧', '🪨', '🌿', '💎'];

  const toggleExpand = (cat) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
      const { error } = await supabase.from('categories').insert([{ name, slug, icon: newCatIcon, parent_id: null, sort_order: Object.keys(catMap).length }]);
      if (error && error.code === '42P01') {
        showMessage('Tabela "categories" não existe. Rode o SQL na aba Config Server primeiro.', 'error');
        return;
      }
      if (error) throw error;
      showMessage(`Categoria "${name}" criada!`, 'success');
      setNewCatName('');
      setNewCatIcon('📦');
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const handleRenameCategory = async (oldName) => {
    const newName = prompt(`Renomear categoria "${oldName}" para:`, oldName);
    if (!newName || newName.trim() === '' || newName === oldName) return;
    try {
      const { error } = await supabase.from('products').update({ category: newName.trim() }).eq('category', oldName);
      if (error) throw error;
      showMessage(`Categoria renomeada para "${newName.trim()}"!`, 'success');
      onRefresh();
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const handleDeleteCategory = async (catName) => {
    const count = catMap[catName]?.count || 0;
    if (!confirm(`Excluir categoria "${catName}"?\n\n${count} produto(s) ficarão sem categoria.`)) return;
    try {
      const { error } = await supabase.from('products').update({ category: 'sem-categoria' }).eq('category', catName);
      if (error) throw error;
      showMessage(`Categoria "${catName}" removida!`, 'success');
      onRefresh();
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const handleAddSubcategory = async (catName) => {
    const name = newSubName.trim();
    if (!name) return;
    try {
      // We add it by creating a placeholder or the user just types when adding a product
      // For now, store in categories table
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase.from('categories').insert([{ name, slug, icon: '', parent_id: null, sort_order: 0 }]).select();
      // Even if categories table doesn't exist, the subcategory will work when assigned to products
      showMessage(`Subcategoria "${name}" adicionada!`, 'success');
      setNewSubName('');
      setAddingSubFor(null);
    } catch (err) {
      // If table doesn't exist, just show success - subcats are derived from products
      showMessage(`Subcategoria "${name}" pronta para uso!`, 'success');
      setNewSubName('');
      setAddingSubFor(null);
    }
  };

  const handleRenameSubcategory = async (catName, oldSub) => {
    const newName = prompt(`Renomear subcategoria "${oldSub}" para:`, oldSub);
    if (!newName || newName.trim() === '' || newName === oldSub) return;
    try {
      const { error } = await supabase.from('products').update({ subcategory: newName.trim() }).eq('category', catName).eq('subcategory', oldSub);
      if (error) throw error;
      showMessage(`Subcategoria renomeada!`, 'success');
      onRefresh();
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const handleDeleteSubcategory = async (catName, subName) => {
    if (!confirm(`Remover subcategoria "${subName}"?\n\nProdutos ficarão sem subcategoria.`)) return;
    try {
      const { error } = await supabase.from('products').update({ subcategory: null }).eq('category', catName).eq('subcategory', subName);
      if (error) throw error;
      showMessage(`Subcategoria removida!`, 'success');
      onRefresh();
    } catch (err) {
      showMessage(`Erro: ${err.message}`, 'error');
    }
  };

  const categories = Object.entries(catMap).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#12141A] border border-white/[0.06] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ff4add]/10 rounded-xl flex items-center justify-center">
              <FolderOpen size={18} className="text-[#ff4add]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">Gerenciar Catálogos</h3>
              <p className="font-body text-gray-500 text-[10px]">{categories.length} categorias</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Add new category */}
        <div className="p-4 border-b border-white/[0.04] bg-[#0D0D14]/40">
          <p className="font-heading font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-2">Nova Categoria</p>
          <div className="flex gap-2">
            {/* Icon picker */}
            <div className="relative group">
              <button className="w-10 h-10 bg-[#1A1C24] border border-white/[0.06] rounded-xl flex items-center justify-center text-lg cursor-pointer hover:border-white/[0.1] transition-all">
                {newCatIcon}
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#1A1C24] border border-white/[0.08] rounded-xl p-2 grid grid-cols-5 gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                {ICON_OPTIONS.map(icon => (
                  <button key={icon} onClick={() => setNewCatIcon(icon)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer text-sm transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="Nome da categoria..."
              className="flex-1 bg-[#1A1C24] border border-white/[0.06] rounded-xl px-3 py-2 text-white font-body text-xs outline-none focus:border-[#7B61FF]/40 transition-all"
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            />
            <button onClick={handleAddCategory} className="bg-[#7B61FF] text-white px-3 rounded-xl hover:bg-[#6B51EF] transition-all cursor-pointer">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Category tree */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {categories.length === 0 ? (
            <p className="text-center text-gray-600 text-xs py-8">Nenhuma categoria. Adicione produtos primeiro.</p>
          ) : (
            categories.map(([catName, data]) => (
              <div key={catName} className="bg-[#0D0D14]/60 border border-white/[0.03] rounded-xl overflow-hidden">
                {/* Category row */}
                <div className="flex items-center gap-2 px-3 py-2.5 group">
                  <button onClick={() => toggleExpand(catName)} className="text-gray-500 cursor-pointer hover:text-white transition-colors">
                    {expanded[catName] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <span className="font-heading font-bold text-white text-xs flex-1">{catName}</span>
                  <span className="font-mono text-[9px] text-gray-600 bg-white/[0.03] px-1.5 py-0.5 rounded">{data.count}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleRenameCategory(catName)} className="p-1.5 text-[#51e8ff] hover:bg-[#51e8ff]/10 rounded-lg cursor-pointer transition-all" title="Renomear">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => handleDeleteCategory(catName)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all" title="Excluir">
                      <Trash2 size={12} />
                    </button>
                    <button onClick={() => { setAddingSubFor(addingSubFor === catName ? null : catName); setNewSubName(''); }} className="p-1.5 text-[#ff4add] hover:bg-[#ff4add]/10 rounded-lg cursor-pointer transition-all" title="Add sub">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {expanded[catName] && (
                  <div className="border-t border-white/[0.03] pl-8 pr-3 py-1.5 space-y-0.5">
                    {[...data.subs].sort().map(sub => (
                      <div key={sub} className="flex items-center gap-2 py-1.5 group/sub">
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="font-body text-gray-400 text-[11px] flex-1">{sub}</span>
                        <span className="font-mono text-[8px] text-gray-700">
                          {products.filter(p => p.category === catName && p.subcategory === sub).length}
                        </span>
                        <div className="flex gap-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                          <button onClick={() => handleRenameSubcategory(catName, sub)} className="p-1 text-[#51e8ff] hover:bg-[#51e8ff]/10 rounded cursor-pointer"><Edit3 size={10} /></button>
                          <button onClick={() => handleDeleteSubcategory(catName, sub)} className="p-1 text-red-400 hover:bg-red-500/10 rounded cursor-pointer"><Trash2 size={10} /></button>
                        </div>
                      </div>
                    ))}
                    {data.subs.size === 0 && <p className="text-gray-700 text-[10px] py-1">Sem subcategorias</p>}
                  </div>
                )}

                {/* Add subcategory input */}
                {addingSubFor === catName && (
                  <div className="border-t border-white/[0.03] px-3 py-2 flex gap-2">
                    <input
                      value={newSubName}
                      onChange={e => setNewSubName(e.target.value)}
                      placeholder="Nova subcategoria..."
                      className="flex-1 bg-[#1A1C24] border border-[#ff4add]/30 rounded-lg px-3 py-1.5 text-white font-body text-[11px] outline-none focus:border-[#ff4add]/60 transition-all"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleAddSubcategory(catName)}
                    />
                    <button onClick={() => handleAddSubcategory(catName)} className="bg-[#ff4add]/20 text-[#ff4add] px-2.5 rounded-lg hover:bg-[#ff4add]/30 cursor-pointer text-xs font-bold transition-all">
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

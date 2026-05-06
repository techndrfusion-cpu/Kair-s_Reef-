import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search, X, ShoppingBag } from 'lucide-react';
import { ALL_PRODUCTS, CATEGORY_TREE } from '../data/products';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || null;
  const initialSub = searchParams.get('sub') || null;

  const [activeCat, setActiveCat] = useState(initialCat);
  const [activeSub, setActiveSub] = useState(initialSub);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const gridRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Tenta carregar do Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const mapped = data.map(p => ({
            id: p.id,
            category: p.category,
            subcategory: p.subcategory || '',
            name: p.name,
            price_cash: p.price_cash,
            price_card: p.price_card,
            price: p.price_cash ? `R$ ${Number(p.price_cash).toFixed(2).replace('.', ',')}` : 'Consultar valor',
            img: p.image_url,
            desc: p.description || '',
            tag: p.tag || '',
            installments: p.installments || '6x sem juros',
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.log('Usando catálogo estático');
      }
    };
    fetchProducts();
  }, []);

  // Animação
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.catalog-card');
      gsap.fromTo(cards,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.03, ease: 'power3.out', clearProps: 'all' }
      );
    }
  }, [activeCat, activeSub, search, products]);

  // Handlers
  const selectCategory = (catId) => {
    setActiveCat(catId);
    setActiveSub(null);
    setSearchParams(catId ? { cat: catId } : {});
  };

  const selectSub = (subId) => {
    setActiveSub(subId);
    setSearchParams(activeCat ? { cat: activeCat, sub: subId } : {});
  };

  // Filtragem
  const filtered = products.filter((p) => {
    const matchCat = !activeCat || p.category === activeCat;
    const matchSub = !activeSub || p.subcategory === activeSub;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSub && matchSearch;
  });

  // Subcategorias da categoria ativa
  const activeSubcats = (() => {
    if (!activeCat) return [];
    
    // 1. Extrai apenas os nomes/IDs de subcategorias que ATUALMENTE têm produtos cadastrados nessa categoria
    const dbSubsNames = Array.from(
      new Set(
        products
          .filter(p => p.category === activeCat && p.subcategory)
          .map(p => p.subcategory)
      )
    ).sort();
    
    // 2. Busca na árvore de categoria se existe mapeamento estático para eles
    const cat = CATEGORY_TREE.find(c => c.id === activeCat);
    const defaultSubs = cat && cat.subcategories ? cat.subcategories : [];
    
    // 3. Monta a lista fina. 
    // Se encontrou no base, herda os nomes bonitos originais (ex: ID "filtros" ganha Name "Filtros").
    // Se não encontrou, é uma cat criada dinamicamente ou renomeada, usa o próprio texto como ID e Nome.
    return dbSubsNames.map(subName => {
      const foundMatch = defaultSubs.find(s => s.name === subName || s.id === subName);
      return {
        id: foundMatch ? foundMatch.id : subName,
        name: foundMatch ? foundMatch.name : subName
      };
    });
  })();

  const formatCurrency = (v) =>
    v ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v) : null;

  return (
    <div className="pt-24 pb-24 px-4 min-h-screen bg-[#0A0A14]">
      <div className="max-w-6xl mx-auto">

        {/* ── TÍTULO ── */}
        <h1 className="font-heading font-bold text-white text-2xl mb-1">
          Catálogo
        </h1>
        <p className="font-body text-gray-500 text-xs mb-5">
          {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        {/* ── BUSCA ── */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12141A] border border-white/8 text-white rounded-2xl py-3 pl-10 pr-10 text-sm font-body
              focus:outline-none focus:border-[#7B61FF]/50 transition-colors placeholder-gray-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 active:text-white cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── CATEGORIAS PRINCIPAIS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {[{ id: null, name: 'Todos', icon: '🌊' }, ...CATEGORY_TREE].map((cat) => {
            const isActive = activeCat === cat.id;
            const count = cat.id
              ? products.filter(p => p.category === cat.id).length
              : products.length;

            return (
              <button
                key={cat.id || 'todos'}
                onClick={() => selectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-heading font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0
                  ${isActive
                    ? 'bg-[#7B61FF] text-white shadow-lg shadow-purple-500/20'
                    : 'bg-[#12141A] text-gray-400 border border-white/5 active:bg-white/5'
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── SUBCATEGORIAS (aparece só quando categoria ativa tem subs) ── */}
        {activeSubcats.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            <button
              onClick={() => setActiveSub(null)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-heading font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0
                ${!activeSub
                  ? 'bg-[#51e8ff]/15 text-[#51e8ff] border border-[#51e8ff]/20'
                  : 'bg-[#12141A] text-gray-500 border border-white/5 active:bg-white/5'
                }`}
            >
              Todos
            </button>
            {activeSubcats.map((sub) => (
              <button
                key={sub.id}
                onClick={() => selectSub(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-heading font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0
                  ${activeSub === sub.id
                    ? 'bg-[#51e8ff]/15 text-[#51e8ff] border border-[#51e8ff]/20'
                    : 'bg-[#12141A] text-gray-500 border border-white/5 active:bg-white/5'
                  }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* ── GRID DE PRODUTOS ── */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <div key={product.id} className="catalog-card">
              <ProductCard product={product} addToCart={addToCart} formatCurrency={formatCurrency} />
            </div>
          ))}
        </div>

        {/* ── VAZIO ── */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-heading font-bold text-white text-base mb-1">Nenhum resultado</p>
            <p className="font-body text-gray-500 text-xs mb-5">Tente outro filtro ou termo de busca.</p>
            <button
              onClick={() => { setSearch(''); selectCategory(null); }}
              className="bg-[#7B61FF] text-white font-heading font-bold py-2.5 px-5 text-xs rounded-2xl cursor-pointer active:scale-95 transition-transform"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════
// PRODUCT CARD — Mobile-first
// ═══════════════════════════
function ProductCard({ product, addToCart, formatCurrency }) {
  const hasCashPrice = product.price_cash && product.price_cash > 0;

  return (
    <div className="bg-[#12141A] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full active:scale-[0.98] transition-transform duration-150">
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-[#0F1118]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-contain p-3"
          loading="lazy"
        />
        {product.tag && (
          <span className="absolute top-2 left-2 bg-[#7B61FF]/85 backdrop-blur-sm text-white text-[7px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-white text-[11px] leading-tight mb-2 line-clamp-2 min-h-[28px]">
          {product.name}
        </h3>

        {/* Preço */}
        <div className="mt-auto mb-2.5">
          {hasCashPrice ? (
            <>
              <span className="font-heading font-extrabold text-[#51e8ff] text-sm block">
                {formatCurrency(product.price_cash)}
              </span>
              <span className="font-body text-gray-500 text-[9px]">
                à vista
              </span>
            </>
          ) : (
            <span className="font-heading font-bold text-[#ff4add] text-[11px]">Consultar valor</span>
          )}
        </div>

        {/* Botão */}
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-[#7B61FF] text-white font-heading font-bold py-2.5 text-[10px] uppercase rounded-xl tracking-wider cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={12} />
          Adicionar
        </button>
      </div>
    </div>
  );
}

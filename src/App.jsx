// ═══════════════════════════════════════════════════════════════
// KAIRÓS REEF — Instrumento Digital Cinematográfico
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search, ShoppingBag, Phone, Mail, Camera,
  MessageSquare, Globe, ChevronLeft, ChevronRight,
  Menu, X, Video
} from 'lucide-react';
import { ALL_PRODUCTS } from './data/products';
import { supabase } from './lib/supabase';
import CatalogPage from './pages/Catalog';
import CartPage from './pages/CartPage';
import { CartProvider, useCart } from './context/CartContext';

import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import AdminPage from './pages/AdminPage';

gsap.registerPlugin(ScrollTrigger);

/* ─── DADOS ─── */
const NAV_LINKS = [
  { label: 'Catálogo', path: '/catalogo' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Contato', path: '/contato' },
];

const CATEGORIES = [
  { name: 'Peixes Marinhos', slug: 'peixes', icon: '🐠', img: 'https://ecoreef.com.br/storage/2025/07/palhacos_new-scaled.jpg' },
  { name: 'Invertebrados', slug: 'invertebrados', icon: '🦐', img: 'https://aqualandiaanimal.com.br/wp-content/uploads/2024/07/5.jpg' },
  { name: 'Corais', slug: 'corais', icon: '🪸', img: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Produtos e Equipamentos', slug: 'equipamentos', icon: '⚙️', img: '/equipamentos.png?v=2' },
];


// ═══════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl
        rounded-full px-6 py-3 flex items-center justify-between navbar-glass
        ${scrolled || !isHome
          ? 'bg-[#12141A]/70 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40'
          : 'bg-transparent border border-transparent'
        }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
        <img
          src="/logo-kairos.png"
          alt="Kairós Reef"
          className="h-9 w-9 object-contain rounded-full shadow-[0_0_12px_rgba(81,232,255,0.35)]"
        />
        <div className="flex flex-col">
          <span className="font-heading font-extrabold text-lg tracking-tight leading-none text-[#51e8ff] drop-shadow-[0_0_8px_rgba(81,232,255,0.7)]">
            KAIRÓS
          </span>
          <span className="font-heading font-bold text-[9px] tracking-[0.3em] text-[#ff4add] drop-shadow-[0_0_6px_rgba(255,74,221,0.7)]">
            REEF
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`link-lift font-body text-xs font-semibold transition-colors
              ${location.pathname === link.path
                ? 'text-[#51e8ff]'
                : (scrolled || !isHome) ? 'text-gray-300 hover:text-white' : 'text-white/80 hover:text-white'
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA + Cart */}
      <div className="flex items-center gap-4">
        <Link to="/carrinho" className="relative p-2 text-white/80 hover:text-[#51e8ff] transition-colors rounded-full hover:bg-white/5">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-[#51e8ff] text-[#0A0A14] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        <Link
          to="/contato"
          className="hidden md:block btn-magnetic bg-[#7B61FF] text-white font-heading font-bold text-xs px-5 py-2 rounded-full shadow-lg shadow-purple-500/25"
        >
          <span className="btn-bg bg-[#51e8ff]"></span>
          <span>Falar com Especialista</span>
        </Link>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/80 ml-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#12141A]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-body text-sm transition-colors ${location.pathname === link.path ? 'text-[#51e8ff]' : 'text-gray-200 hover:text-[#51e8ff]'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contato"
            className="btn-magnetic bg-[#7B61FF] text-white font-heading font-bold text-xs px-5 py-2.5 rounded-full mt-2 text-center"
          >
            <span className="btn-bg bg-[#51e8ff]"></span>
            <span>Falar com Especialista</span>
          </Link>
        </div>
      )}
    </nav>
  );
};


// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
const HERO_IMAGES = [
  '/hero-about.jpg',
  '/hero-1.jpg',
  '/hero-2.jpg',
  '/hero-3.jpg',
  '/hero-4.jpg',
];

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-line-1', { y: 50, opacity: 0, duration: 1, delay: 0.3 })
        .from('.hero-line-2', { y: 50, opacity: 0, duration: 1 }, '-=0.7')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.5');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[100dvh] overflow-hidden flex items-end bg-[#0A0A14]">
      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[60%_center] md:object-center"
            style={{
              opacity: currentImg === i ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}
        {/* Gradiente vertical — garante legibilidade do texto embaixo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/70 to-transparent" />
        {/* Gradiente lateral — só no desktop para empurrar foco pro texto à esquerda */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#0A0A14]/80 via-[#0A0A14]/30 to-transparent" />
        {/* Overlay sutil no mobile para contraste uniforme */}
        <div className="absolute inset-0 md:hidden bg-[#0A0A14]/40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(123,97,255,0.15) 0%, rgba(81,232,255,0.08) 40%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-16 pb-20 md:pb-32">
        <h1 className="mb-6 text-center md:text-left">
          <span className="hero-line-1 block font-heading font-bold text-white text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
            Transformando seu aquário em um
          </span>
          <span className="hero-line-2 block font-drama italic text-[#51e8ff] text-4xl md:text-8xl lg:text-[7rem] leading-[1] mt-2 drop-shadow-[0_0_40px_rgba(81,232,255,0.4)]">
            verdadeiro espetáculo.
          </span>
        </h1>
        <p className="hero-desc font-body text-gray-300 text-sm md:text-base max-w-lg leading-relaxed mb-8 text-center md:text-left mx-auto md:mx-0">
          Animais quarentenados, corais exóticos e consultoria especializada
          para ecossistemas marinhos de alto padrão. Cada detalhe sob controle clínico.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center md:items-start">
          <button
            onClick={() => navigate('/catalogo')}
            className="hero-cta btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-3.5 px-10 rounded-full text-sm shadow-xl shadow-purple-500/30 w-full sm:w-auto"
          >
            <span className="btn-bg bg-[#51e8ff]"></span>
            <span>Navegar Catálogo</span>
          </button>
          <button
            onClick={() => navigate('/sobre')}
            className="hero-cta btn-magnetic bg-white/10 backdrop-blur-md border border-[#51e8ff]/30 text-[#51e8ff] font-heading font-bold py-3.5 px-10 rounded-full text-sm w-full sm:w-auto"
          >
            <span className="btn-bg bg-[#51e8ff]/15"></span>
            <span>Saber Mais</span>
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A14] to-transparent pointer-events-none" />
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════
// CATEGORIAS INTERATIVAS
// ═══════════════════════════════════════════════════════════════
const InteractiveCategories = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cat-card', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-[#0A0A14] py-16 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-8">Linhas de Vida</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/catalogo?cat=${cat.slug}`)}
              className="cat-card relative h-[220px] md:h-[260px] rounded-[2rem] overflow-hidden group border border-white/5 cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="font-heading font-bold text-white text-lg">{cat.name}</h3>
                <span className="font-mono text-[10px] text-gray-400 group-hover:text-[#51e8ff] transition-colors mt-1 inline-block">
                  EXPLORAR →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════
// PARCERIAS
// ═══════════════════════════════════════════════════════════════
const ALL_PARTNERS = [
  {
    name: 'Eco-Reef',
    logo: 'https://ecoreef.com.br/storage/2025/05/cropped-logo-YX4aj8J8z7ipK5QJ.png',
    url: 'https://ecoreef.com.br/',
  },
  {
    name: 'AquaSmart',
    logo: 'https://www.aquasmart.net.br/wp-content/uploads/elementor/thumbs/Logo-AquaSmart-q3lykm22f6kcywm18a5fxku4qk04q2xbdebiz54ua6.png',
    url: 'https://www.aquasmart.net.br/',
  },
  {
    name: 'Biomarine',
    logo: 'https://www.biomarineaquicultura.com.br/wp-content/uploads/2023/10/BIOMARINE_LOGOSFINAIS2_TRANSPARENTE-e1697819484363.png',
    url: 'https://www.biomarineaquicultura.com.br/',
  },
  {
    name: 'Shark BR',
    logo: 'https://www.sharkbr.com.br/wp-content/uploads/2016/08/logosharkbe.png',
    url: 'https://www.sharkbr.com.br/',
  },
  {
    name: 'Ipiranga Peixes',
    logo: 'https://ipirangapeixes.com.br/img/favicon/favicon-196.png',
    url: 'https://www.ipirangapeixes.com.br/',
  },
  {
    name: 'Box Fish',
    logo: 'https://boxfish.com.br/wp-content/uploads/2023/06/LOGO-2.png',
    url: 'https://boxfish.com.br/',
  },
  {
    name: 'Fish Brasil',
    logo: 'https://fishbrazil.com.br/wp-content/uploads/2024/09/FISH-BRASIL-LOGO-1024x287.png',
    url: 'https://fishbrazil.com.br/',
  },
  {
    name: 'Acqua',
    logo: 'https://static.wixstatic.com/media/ccb185_baecd074c94145758c251987273b2ec4~mv2.jpg',
    url: 'https://www.acquadistribuidora.com.br/',
  },
  {
    name: 'Aquática Brazil',
    logo: null,
    url: 'https://www.instagram.com/aquaticabrazil/',
  },
];

const PartnerLogo = ({ partner }) => {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !partner.logo || imgError;

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center gap-3 p-3 rounded-2xl hover:bg-white/[0.05] transition-all duration-400 cursor-pointer"
      title={partner.name}
    >
      <div className="h-20 w-full max-w-[180px] flex items-center justify-center bg-[#F5F3EE] group-hover:bg-white rounded-xl p-4 transition-colors duration-300">
        {!showFallback ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-h-full max-w-full object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 style-mix-blend-multiply"
            style={{ mixBlendMode: 'multiply' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-heading font-bold text-[#111] text-lg tracking-tight">
            {partner.name}
          </span>
        )}
      </div>
      <span className="font-mono text-[9px] text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
        {partner.name}
      </span>
    </a>
  );
};

const PartnersSection = () => {
  const ref = useRef(null);

  return (
    <section ref={ref} className="relative bg-[#0A0A14] py-20 md:py-28 px-6 md:px-8 overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Left — Title & Description */}
          <div className="md:w-[320px] flex-shrink-0">
            <h2 className="font-heading font-bold text-white text-4xl md:text-5xl leading-[1.1] mb-5">
              Parcerias
            </h2>
            <p className="font-body text-gray-400 text-sm leading-relaxed">
              A Kairós Reef trabalha com empresas que compartilham nosso compromisso
              com a qualidade e a excelência no aquarismo marinho, promovendo
              criação responsável e distribuição de produtos de alto padrão.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7B61FF] shadow-[0_0_8px_rgba(123,97,255,0.5)]" />
              <span className="font-mono text-[10px] text-gray-500 tracking-wider uppercase">
                {ALL_PARTNERS.length} parceiros ativos
              </span>
            </div>
          </div>

          {/* Right — Logo Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_PARTNERS.map((partner) => (
                <PartnerLogo key={partner.name} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════
// PRODUCT GRID (HOME)
// ═══════════════════════════════════════════════════════════════
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasCashPrice = product.price_cash && product.price_cash > 0;
  const hasCardPrice = product.price_card && product.price_card > 0;
  const isConsult = !hasCashPrice;

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="bg-[#12141A] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col h-full group hover:-translate-y-1 hover:border-[#7B61FF]/20 transition-all duration-300">
      <div className="h-44 overflow-hidden relative bg-[#0F1118]">
        <img src={product.img} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-transparent opacity-40" />
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 bg-[#7B61FF]/85 backdrop-blur-sm text-white text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.tag}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-white text-[11px] mb-2 min-h-[28px] leading-snug line-clamp-2">{product.name}</h3>
        <div className="mt-auto mb-2.5">
          {hasCashPrice ? (
            <>
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="font-body text-[9px] text-gray-400">À vista</span>
                <span className="font-heading font-extrabold text-[#51e8ff] text-xs">{formatCurrency(product.price_cash)}</span>
              </div>
              {hasCardPrice && (
                <div className="flex items-baseline gap-1">
                  <span className="font-body text-[9px] text-gray-500">Cartão</span>
                  <span className="font-mono text-gray-400 text-[10px]">{formatCurrency(product.price_card)}</span>
                </div>
              )}
            </>
          ) : (
            <span className="font-heading font-bold text-[#ff4add] text-xs">Consultar valor</span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="w-full btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-2 text-[9px] uppercase rounded-xl tracking-wider text-center block cursor-pointer"
        >
          <span className="btn-bg bg-[#51e8ff]"></span>
          <span>{isConsult ? 'Consultar' : 'Adicionar'}</span>
        </button>
      </div>
    </div>
  );
};

const ProductGrid = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);

  // Responsive cards per view
  const getCardsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .neq('category', 'equipamentos')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          // Pega 1 produto de cada subcategoria para variedade
          const seen = new Set();
          const unique = [];
          for (const p of data) {
            const key = p.subcategory || p.category;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(p);
            }
          }

          const mapped = unique.map(p => ({
            id: p.id,
            category: p.category,
            subcategory: p.subcategory || '',
            name: p.name,
            price_cash: p.price_cash,
            price_card: p.price_card,
            price: p.price_cash ? `R$ ${Number(p.price_cash).toFixed(2).replace('.', ',')}` : 'Consultar',
            img: p.image_url,
            desc: p.description || '',
            tag: p.tag || '',
            installments: p.installments || '6x sem juros',
          }));
          setFeatured(mapped);
        }
      } catch (err) {
        // Fallback to static
      }
    };
    fetchFeatured();
  }, []);

  const totalSlides = Math.max(1, Math.ceil(featured.length / cardsPerView));

  // Auto-play
  useEffect(() => {
    if (isPaused || featured.length <= cardsPerView) return;
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, totalSlides, featured.length, cardsPerView]);

  const goToSlide = (idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(idx);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % totalSlides);
  const prevSlide = () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.carousel-section-title', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      });
      gsap.from('.carousel-container', {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });
      ScrollTrigger.refresh();
    }, ref);
    return () => ctx.revert();
  }, [featured]);

  const translateX = -(currentSlide * 100);

  return (
    <section ref={ref} className="bg-[#0A0A14] py-16 md:py-24 px-6 md:px-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="carousel-section-title flex justify-between items-center mb-10">
          <div>
            <h2 className="font-heading font-bold text-white text-2xl md:text-3xl uppercase tracking-wide">Destaque</h2>
            <p className="font-body text-gray-500 text-xs mt-1">Um de cada espécie — selecionados e prontos para entrega.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Nav arrows — desktop */}
            {featured.length > cardsPerView && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-[#12141A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#51e8ff] hover:border-[#51e8ff]/30 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-[#12141A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#51e8ff] hover:border-[#51e8ff]/30 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Próximo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            <button
              onClick={() => navigate('/catalogo')}
              className="hidden md:flex items-center gap-2 font-heading font-bold text-[#51e8ff] text-xs link-lift"
            >
              Ver Catálogo Completo <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="carousel-container relative overflow-hidden rounded-[2rem]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIdx) => (
              <div
                key={slideIdx}
                className="w-full flex-shrink-0"
              >
                <div className={`grid gap-5 ${
                  cardsPerView === 1 ? 'grid-cols-1' :
                  cardsPerView === 2 ? 'grid-cols-2' :
                  'grid-cols-4'
                }`}>
                  {featured.slice(slideIdx * cardsPerView, slideIdx * cardsPerView + cardsPerView).map((prod, idx) => (
                    <div
                      key={prod.id}
                      className="product-card"
                      style={{
                        opacity: currentSlide === slideIdx ? 1 : 0.3,
                        transform: currentSlide === slideIdx ? 'scale(1)' : 'scale(0.95)',
                        transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`,
                      }}
                    >
                      <ProductCard product={prod} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile nav arrows — overlaid */}
          {featured.length > cardsPerView && (
            <div className="md:hidden">
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0A0A14]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-[#51e8ff] transition-colors cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#0A0A14]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-[#51e8ff] transition-colors cursor-pointer"
                aria-label="Próximo"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Dot indicators + Progress bar */}
        {totalSlides > 1 && (
          <div className="flex flex-col items-center mt-8 gap-4">
            {/* Progress bar */}
            <div className="w-full max-w-xs h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7B61FF] to-[#51e8ff] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
              />
            </div>
            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? 'w-8 h-2 bg-gradient-to-r from-[#7B61FF] to-[#51e8ff] shadow-[0_0_12px_rgba(123,97,255,0.5)]'
                      : 'w-2 h-2 bg-white/15 hover:bg-white/30'
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
            {/* Slide counter */}
            <span className="font-mono text-[10px] text-gray-600 tracking-wider">
              {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => navigate('/catalogo')}
            className="btn-magnetic bg-[#12141A] border border-white/10 text-white font-heading font-bold py-3 px-8 rounded-full text-xs"
          >
            <span className="btn-bg bg-[#7B61FF]/20"></span>
            <span>Ver Catálogo Completo →</span>
          </button>
        </div>
      </div>
    </section>
  );
};


// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
const Footer = () => (
  <footer className="bg-[#0D0D12] rounded-t-[3rem] md:rounded-t-[4rem] py-16 md:py-20 px-6 md:px-8 mt-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-400 font-body text-xs mb-12">
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <img src="/logo-kairos.png" alt="Kairós Reef" className="h-8 w-8 rounded-full" />
            <div>
              <span className="font-heading font-extrabold text-sm text-[#51e8ff]">KAIRÓS</span>
              <span className="font-heading font-bold text-[8px] tracking-[0.2em] text-[#ff4add] ml-1.5">REEF</span>
            </div>
          </Link>
          <p className="text-gray-600 leading-relaxed pr-4">
            Especialistas em ecossistemas marinhos de alto padrão. Cada detalhe importa — do coral ao parâmetro.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-heading font-bold text-white mb-1 text-sm tracking-wide">Navegação</h4>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="link-lift hover:text-[#51e8ff] transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-heading font-bold text-white mb-1 text-sm tracking-wide">Contato</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2"><Phone size={13} className="text-gray-600" /> +55 11 97544-3835</li>

            <li>
              <a href="https://wa.me/5511975443835" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 link-lift hover:text-[#25D366] transition-colors">
                <svg viewBox="0 0 32 32" fill="currentColor" width="13" height="13" className="text-gray-600">
                  <path d="M16.004 3.2C9.04 3.2 3.38 8.856 3.376 15.824c-.002 2.224.58 4.396 1.684 6.312L3.2 28.8l6.828-1.792a12.56 12.56 0 0 0 5.968 1.52h.008c6.96 0 12.624-5.656 12.628-12.624.002-3.372-1.31-6.54-3.696-8.928A12.56 12.56 0 0 0 16.004 3.2zm0 23.08h-.004a10.44 10.44 0 0 1-5.328-1.46l-.384-.228-3.972 1.04 1.06-3.876-.248-.396A10.44 10.44 0 0 1 5.5 15.824C5.504 9.964 10.148 5.324 16.008 5.324c2.844 0 5.516 1.108 7.524 3.12a10.56 10.56 0 0 1 3.1 7.536c-.004 5.86-4.648 10.5-10.628 10.5zm5.824-7.88c-.32-.16-1.888-.932-2.18-1.04-.292-.104-.504-.16-.716.16s-.824 1.04-1.008 1.252c-.188.212-.372.24-.692.08-.32-.16-1.348-.496-2.568-1.584-.948-.848-1.588-1.892-1.776-2.212-.184-.32-.02-.492.14-.652.14-.144.32-.372.476-.56.16-.188.212-.32.32-.532.104-.212.052-.4-.028-.56-.08-.16-.716-1.724-.98-2.36-.26-.62-.52-.536-.716-.548l-.612-.012a1.172 1.172 0 0 0-.852.4c-.292.32-1.116 1.092-1.116 2.664 0 1.572 1.144 3.092 1.304 3.304.16.212 2.252 3.44 5.456 4.824.764.328 1.36.524 1.824.672.768.244 1.464.212 2.016.128.616-.092 1.888-.772 2.156-1.516.264-.748.264-1.388.184-1.52-.08-.132-.292-.212-.612-.372z" />
                </svg>
                (11) 97544-3835
              </a>
            </li>
            <li className="flex items-center gap-2"><Mail size={13} className="text-gray-600" /> kairosreef@gmail.com</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-heading font-bold text-white mb-1 text-sm tracking-wide">Social</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="https://www.instagram.com/kairosreef?igsh=YTVnejZnamJqMjhi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 link-lift hover:text-[#E1306C] transition-colors">
                <Camera size={13} /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@kairsreef?_r=1&_t=ZS-95aoO1bAJn6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 link-lift hover:text-[#51e8ff] transition-colors">
                <Video size={13} /> TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-gray-600 font-body">
          © {new Date().getFullYear()} Kairós Reef Especialistas Marinhos. Todos os direitos reservados.
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-status" />
          <span className="font-mono text-[10px] text-gray-500">System Operational</span>
        </div>
      </div>
    </div>
  </footer>
);


// ═══════════════════════════════════════════════════════════════
// WHATSAPP BUTTON
// ═══════════════════════════════════════════════════════════════
const WhatsAppButton = () => (
  <a
    href="https://wa.me/5511975443835?text=Olá! Gostaria de saber mais sobre a Kairós Reef!"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contato via WhatsApp"
    className="fixed bottom-6 right-6 z-[9999] group"
  >
    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
    <span className="absolute inset-[-4px] rounded-full bg-[#25D366]/15 animate-pulse pointer-events-none" />
    <div className="relative w-[56px] h-[56px] bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_32px_rgba(37,211,102,0.6)] hover:scale-[1.08] active:scale-[0.95] transition-all duration-300 cursor-pointer">
      <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
        <path d="M16.004 3.2C9.04 3.2 3.38 8.856 3.376 15.824c-.002 2.224.58 4.396 1.684 6.312L3.2 28.8l6.828-1.792a12.56 12.56 0 0 0 5.968 1.52h.008c6.96 0 12.624-5.656 12.628-12.624.002-3.372-1.31-6.54-3.696-8.928A12.56 12.56 0 0 0 16.004 3.2zm0 23.08h-.004a10.44 10.44 0 0 1-5.328-1.46l-.384-.228-3.972 1.04 1.06-3.876-.248-.396A10.44 10.44 0 0 1 5.5 15.824C5.504 9.964 10.148 5.324 16.008 5.324c2.844 0 5.516 1.108 7.524 3.12a10.56 10.56 0 0 1 3.1 7.536c-.004 5.86-4.648 10.5-10.628 10.5zm5.824-7.88c-.32-.16-1.888-.932-2.18-1.04-.292-.104-.504-.16-.716.16s-.824 1.04-1.008 1.252c-.188.212-.372.24-.692.08-.32-.16-1.348-.496-2.568-1.584-.948-.848-1.588-1.892-1.776-2.212-.184-.32-.02-.492.14-.652.14-.144.32-.372.476-.56.16-.188.212-.32.32-.532.104-.212.052-.4-.028-.56-.08-.16-.716-1.724-.98-2.36-.26-.62-.52-.536-.716-.548l-.612-.012a1.172 1.172 0 0 0-.852.4c-.292.32-1.116 1.092-1.116 2.664 0 1.572 1.144 3.092 1.304 3.304.16.212 2.252 3.44 5.456 4.824.764.328 1.36.524 1.824.672.768.244 1.464.212 2.016.128.616-.092 1.888-.772 2.156-1.516.264-.748.264-1.388.184-1.52-.08-.132-.292-.212-.612-.372z" />
      </svg>
    </div>
    <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-white text-gray-800 text-xs font-semibold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
      Fale conosco no WhatsApp!
      <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
    </div>
  </a>
);


// ═══════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════
const HomePage = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <HeroSection />
      <InteractiveCategories />
      <ProductGrid />
      <PartnersSection />
    </>
  );
};


// ═══════════════════════════════════════════════════════════════
// SCROLL TO TOP — on route change
// ═══════════════════════════════════════════════════════════════
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};


// ═══════════════════════════════════════════════════════════════
// APP — Composição Final com Router
// ═══════════════════════════════════════════════════════════════
function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="bg-[#0A0A14] min-h-screen text-gray-200 font-body">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/contato" element={<ContactPage />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppLayout />
      </BrowserRouter>
    </CartProvider>
  );
}


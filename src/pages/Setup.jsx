import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Droplets, Monitor, Wrench, Palette, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: Palette,
    title: 'Design & Planejamento',
    desc: 'Projetamos seu aquário desde o conceito até a execução — escolha de espécies, hardscape, layout e dimensionamento compatível com o ambiente.',
    img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Wrench,
    title: 'Montagem Profissional',
    desc: 'Instalação completa do sistema: tubulação, filtração, skimmer, bombas de circulação, iluminação e automação. Tudo calibrado para o ecossistema ideal.',
    img: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Droplets,
    title: 'Manutenção Periódica',
    desc: 'Planos semanais, quinzenais ou mensais. Troca parcial de água, testes de parâmetros, poda de corais, controle de algas e limpeza de equipamentos.',
    img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: Monitor,
    title: 'Automação & Monitoramento',
    desc: 'Instalação de controladores automáticos para dosagem, temperatura, pH e iluminação. Monitoramento remoto para total controle do seu reef.',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1535591273668-578e3111e865?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
];

export default function SetupPage() {
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.setup-card', {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.setup-grid', start: 'top 80%' },
      });
      gsap.from('.gallery-item', {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pt-28 pb-20 px-6 md:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="font-mono text-[#7B61FF] text-[10px] tracking-widest font-semibold mb-4 block">SERVIÇOS</span>
          <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
            Setup & <span className="font-drama italic text-[#51e8ff]">Projetos</span>
          </h1>
          <p className="font-body text-gray-400 text-sm leading-relaxed">
            Da concepção ao ecossistema maduro — cuidamos de cada etapa para transformar
            seu espaço em um aquário de alta performance visual e biológica.
          </p>
        </div>

        {/* Services */}
        <div className="setup-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="setup-card bg-[#12141A] border border-white/5 rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-[#12141A]/30 to-transparent" />
                  <div className="absolute top-5 left-5 w-10 h-10 rounded-xl bg-[#7B61FF]/20 backdrop-blur-sm border border-[#7B61FF]/30 flex items-center justify-center">
                    <Icon size={18} className="text-[#7B61FF]" />
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-heading font-bold text-white text-lg mb-3">{svc.title}</h3>
                  <p className="font-body text-gray-400 text-xs leading-relaxed mb-5">{svc.desc}</p>
                  <a
                    href={`https://wa.me/5511975443835?text=Olá! Tenho interesse no serviço: ${encodeURIComponent(svc.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-heading font-bold text-[#51e8ff] text-xs link-lift"
                  >
                    Solicitar Orçamento <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3">
            Projetos <span className="text-[#7B61FF]">Realizados</span>
          </h2>
          <p className="font-body text-gray-500 text-sm mb-8">Alguns dos ecossistemas que montamos para nossos clientes.</p>

          <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <div key={i} className="gallery-item aspect-square rounded-[1.5rem] overflow-hidden group cursor-pointer">
                <img src={img} alt={`Projeto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#12141A] border border-white/5 rounded-[2.5rem] p-10 md:p-14 text-center">
          <h3 className="font-heading font-bold text-white text-xl md:text-2xl mb-3">
            Tem um projeto em mente?
          </h3>
          <p className="font-body text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Entre em contato e receba um orçamento personalizado. Atendemos São Paulo e região.
          </p>
          <a
            href="https://wa.me/5511975443835?text=Olá! Gostaria de um orçamento para um projeto de aquário."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-3.5 px-10 rounded-full text-sm shadow-xl shadow-purple-500/30"
          >
            <span className="btn-bg bg-[#51e8ff]"></span>
            <span>Falar com Especialista</span>
          </a>
        </div>
      </div>
    </div>
  );
}

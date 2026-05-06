import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Eye, Leaf, Award, Globe, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  { icon: Shield, title: 'Saúde Animal', desc: 'Cada espécime passa por quarentena clínica rigorosa antes de ser disponibilizado.' },
  { icon: Eye, title: 'Transparência', desc: 'Informamos a origem, estado de saúde e compatibilidade de cada animal. Sem surpresas, sem riscos.' },
  { icon: Leaf, title: 'Sustentabilidade', desc: 'Priorizamos animais de aquacultura e práticas de coleta responsável. Preservar é parte do negócio.' },
  { icon: Award, title: 'Excelência', desc: 'Equipamentos testados, técnicas atualizadas e atendimento consultivo. Cada detalhe importa.' },
];

export default function AboutPage() {
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={ref} className="pt-28 pb-20 px-6 md:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Hero about */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
          <div>
            <span className="font-mono text-[#7B61FF] text-[10px] tracking-widest font-semibold mb-4 block">KAIRÓS REEF</span>
            <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-5 leading-tight">
              Especialistas em <br/><span className="font-drama italic text-[#51e8ff]">aquários marinhos</span>
            </h1>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-5">
              Somos focados em oferecer excelência desde a escolha do animal até o suporte final.
              Trabalhamos apenas com <strong className="text-white">espécies selecionadas + quarentena</strong>.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7B61FF]/20 flex items-center justify-center">
                  <Shield size={14} className="text-[#51e8ff]" />
                </div>
                <span className="font-body text-sm text-gray-300">Montagem • Manutenção • Consultoria</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7B61FF]/20 flex items-center justify-center">
                  <Globe size={14} className="text-[#51e8ff]" />
                </div>
                <span className="font-body text-sm text-gray-300">São Paulo | Atendimento nacional</span>
              </div>
            </div>
            
            <a href="https://wa.me/5511975443835?text=Olá! Gostaria de um orçamento." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-3 px-8 rounded-full text-xs shadow-xl shadow-purple-500/20">
              <span className="btn-bg bg-[#51e8ff]"></span>
              <MessageSquare size={14} />
              <span>Orçamentos no WhatsApp</span>
            </a>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden h-[350px] md:h-[450px] border border-white/5 relative">
            <img
              src="/hero-about.jpg"
              alt="Fundador da Kairós Reef"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14]/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { number: '+120', label: 'Aquários entregues' },
            { number: '8', label: 'Anos de experiência' },
            { number: '2024', label: 'Empresa fundada' },
            { number: '100%', label: 'Espécies c/ quarentena' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#12141A] border border-white/5 rounded-[1.5rem] p-6 text-center">
              <div className="font-heading font-bold text-[#7B61FF] text-2xl md:text-3xl mb-1">{stat.number}</div>
              <div className="font-body text-gray-500 text-[10px] tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3 text-center">
            Nossos <span className="text-[#51e8ff]">Valores</span>
          </h2>
          <p className="font-body text-gray-500 text-sm text-center mb-10 max-w-md mx-auto">
            Os pilares que sustentam cada decisão e cada animal que passa pelas nossas mãos.
          </p>
          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="about-value bg-[#12141A] border border-white/5 rounded-[2rem] p-6 text-center hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#7B61FF]/15 border border-[#7B61FF]/20 flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-[#7B61FF]" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-sm mb-2">{val.title}</h4>
                  <p className="font-body text-gray-500 text-[10px] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-14 text-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="absolute inset-0 bg-[#0D0D14]/80" />
          <div className="relative z-10">
            <h3 className="font-heading font-bold text-white text-xl md:text-2xl mb-3">Quer conhecer nosso trabalho?</h3>
            <p className="font-body text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Visite nosso laboratório em São Paulo ou converse com um especialista agora.
            </p>
            <a
              href="https://wa.me/5511975443835?text=Olá! Gostaria de conhecer mais sobre a Kairós Reef."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-3.5 px-10 rounded-full text-sm shadow-xl shadow-purple-500/30"
            >
              <span className="btn-bg bg-[#51e8ff]"></span>
              <span>Falar com a Equipe</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build WhatsApp message from form
    const msg = `Olá! Meu nome é ${form.nome}.%0A%0AEmail: ${form.email}%0ATelefone: ${form.telefone}%0A%0AMensagem: ${form.mensagem}`;
    window.open(`https://wa.me/5511975443835?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-[#7B61FF] text-[10px] tracking-widest font-semibold mb-4 block">CONTATO</span>
          <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
            Fale com a <span className="font-drama italic text-[#51e8ff]">Equipe</span>
          </h1>
          <p className="font-body text-gray-400 text-sm leading-relaxed">
            Tem dúvidas, quer um orçamento ou precisa de consultoria? Estamos prontos para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: Phone, label: 'Telefone', lines: ['+55 11 97544-3835'] },
              { icon: Mail, label: 'Email', lines: ['kairosreef@gmail.com'] },
              { icon: MapPin, label: 'Localização', lines: ['São Paulo — SP, Brasil'] },
              { icon: Clock, label: 'Horário', lines: ['Seg–Sex: 9h – 18h', 'Sáb: 9h – 13h'] },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-[#12141A] border border-white/5 rounded-[1.5rem] p-5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#7B61FF]/15 border border-[#7B61FF]/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#7B61FF]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-xs mb-1">{item.label}</h4>
                    {item.lines.map((line, j) => (
                      <p key={j} className="font-body text-gray-400 text-xs">{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* WhatsApp direct */}
            <a
              href="https://wa.me/5511975443835?text=Olá! Gostaria de falar com um especialista."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-[1.5rem] p-5 hover:bg-[#25D366]/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" fill="#25D366" width="18" height="18">
                  <path d="M16.004 3.2C9.04 3.2 3.38 8.856 3.376 15.824c-.002 2.224.58 4.396 1.684 6.312L3.2 28.8l6.828-1.792a12.56 12.56 0 0 0 5.968 1.52h.008c6.96 0 12.624-5.656 12.628-12.624.002-3.372-1.31-6.54-3.696-8.928A12.56 12.56 0 0 0 16.004 3.2zm0 23.08h-.004a10.44 10.44 0 0 1-5.328-1.46l-.384-.228-3.972 1.04 1.06-3.876-.248-.396A10.44 10.44 0 0 1 5.5 15.824C5.504 9.964 10.148 5.324 16.008 5.324c2.844 0 5.516 1.108 7.524 3.12a10.56 10.56 0 0 1 3.1 7.536c-.004 5.86-4.648 10.5-10.628 10.5zm5.824-7.88c-.32-.16-1.888-.932-2.18-1.04-.292-.104-.504-.16-.716.16s-.824 1.04-1.008 1.252c-.188.212-.372.24-.692.08-.32-.16-1.348-.496-2.568-1.584-.948-.848-1.588-1.892-1.776-2.212-.184-.32-.02-.492.14-.652.14-.144.32-.372.476-.56.16-.188.212-.32.32-.532.104-.212.052-.4-.028-.56-.08-.16-.716-1.724-.98-2.36-.26-.62-.52-.536-.716-.548l-.612-.012a1.172 1.172 0 0 0-.852.4c-.292.32-1.116 1.092-1.116 2.664 0 1.572 1.144 3.092 1.304 3.304.16.212 2.252 3.44 5.456 4.824.764.328 1.36.524 1.824.672.768.244 1.464.212 2.016.128.616-.092 1.888-.772 2.156-1.516.264-.748.264-1.388.184-1.52-.08-.132-.292-.212-.612-.372z" />
                </svg>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#25D366] text-xs">WhatsApp Direto</h4>
                <p className="font-body text-gray-400 text-[10px]">(11) 97544-3835 — Resposta rápida</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-[#12141A] border border-white/5 rounded-[2rem] p-8 md:p-10">
              <h3 className="font-heading font-bold text-white text-lg mb-6">Enviar Mensagem</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-body text-gray-500 text-[10px] mb-1.5 block">Nome completo</label>
                  <input
                    type="text" name="nome" required value={form.nome} onChange={handleChange}
                    className="w-full bg-[#0A0A14] border border-white/8 rounded-xl px-4 py-3 text-white text-xs font-body focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="font-body text-gray-500 text-[10px] mb-1.5 block">Email</label>
                  <input
                    type="email" name="email" required value={form.email} onChange={handleChange}
                    className="w-full bg-[#0A0A14] border border-white/8 rounded-xl px-4 py-3 text-white text-xs font-body focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="font-body text-gray-500 text-[10px] mb-1.5 block">Telefone / WhatsApp</label>
                <input
                  type="tel" name="telefone" value={form.telefone} onChange={handleChange}
                  className="w-full bg-[#0A0A14] border border-white/8 rounded-xl px-4 py-3 text-white text-xs font-body focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="mb-6">
                <label className="font-body text-gray-500 text-[10px] mb-1.5 block">Mensagem</label>
                <textarea
                  name="mensagem" required rows={5} value={form.mensagem} onChange={handleChange}
                  className="w-full bg-[#0A0A14] border border-white/8 rounded-xl px-4 py-3 text-white text-xs font-body focus:outline-none focus:border-[#7B61FF]/50 transition-colors resize-none"
                  placeholder="Descreva o que precisa — orçamento, consultoria, dúvidas..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-magnetic bg-[#7B61FF] text-white font-heading font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <span className="btn-bg bg-[#51e8ff]"></span>
                <span className="flex items-center gap-2">
                  {sent ? '✓ Enviado!' : <><Send size={14} /> Enviar via WhatsApp</>}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

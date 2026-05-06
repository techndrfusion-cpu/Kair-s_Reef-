import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, CreditCard, QrCode, ArrowRight, ShieldCheck, CheckCircle, Loader2, MapPin, Truck, Store } from 'lucide-react';
import { useCart, parsePrice } from '../context/CartContext';
import { supabase } from '../lib/supabase';

// Número fixo do vendedor (formato internacional sem +)
const WHATSAPP_SELLER = '5511975443835';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
    neighborhood: '', complement: '', delivery: 'retirada'
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Gera código de pedido único (ex: AQL-83729)
  const generateOrderCode = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `AQL-${num}`;
  };

  // Monta a mensagem formatada para o WhatsApp
  const buildWhatsAppMessage = (orderCode) => {
    let productsList = '';
    cartItems.forEach((item) => {
      const unitPrice = parsePrice(item.product.price);
      const priceDisplay = unitPrice > 0 ? formatCurrency(unitPrice) : 'Sob consulta';
      productsList += `*${item.quantity}x* ${item.product.name} - Valor à vista - ${priceDisplay}\n`;
    });

    const deliveryLabel = formData.delivery === 'retirada' ? 'Retirar na loja' : 'Entrega';

    let addressInfo = '';
    if (formData.delivery === 'entrega') {
      addressInfo = `*Endereço:* ${formData.address}
*Cep:* ${formData.zip}
*Cidade:* ${formData.city}
*Bairro:* ${formData.neighborhood}
*Complemento:* ${formData.complement || '—'}`;
    }

    const message = `*PEDIDO ENVIADO*
---------------------------------------------------
*RESUMO DO PEDIDO*

*PRODUTOS*

${productsList}
---------------------------------------------------
*DADOS DO CLIENTE*
*Nome:* ${formData.name}
*Telefone/Whatsapp:* ${formData.phone}
*Opção:* ${deliveryLabel}
${addressInfo ? addressInfo + '\n' : ''}---------------------------------------------------`;

    return message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const orderCode = generateOrderCode();

    try {
      // Salvar no Supabase (apenas como backup, não deve bloquear o WhatsApp)
      const orderData = {
        customer_name: formData.name, customer_email: formData.email, customer_phone: formData.phone,
        address: `${formData.address}, ${formData.neighborhood}, ${formData.city} - ${formData.zip}`,
        total_price: totalPrice, total_items: totalItems,
        items: cartItems.map(item => ({
          id: item.product.id, name: item.product.name, quantity: item.quantity,
          price_str: item.product.price, unit_price: parsePrice(item.product.price)
        }))
      };

      try {
        const { error } = await supabase.from('orders').insert([orderData]);
        if (error) {
          console.warn('Supabase DB error (ignored):', error);
        }
      } catch (dbErr) {
        console.warn('Supabase JS error (ignored):', dbErr);
      }

      // Gerar mensagem e abrir WhatsApp
      const message = buildWhatsAppMessage(orderCode);
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${WHATSAPP_SELLER}?text=${encodedMessage}`;

      // Abrir o WhatsApp em nova aba
      window.open(whatsappURL, '_blank');

      setStatus('success');
      clearCart();
    } catch (err) {
      console.error('Falha geral no checkout:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#0A0A14]">
        <div className="max-w-md w-full bg-[#12141A] border border-white/5 p-10 rounded-3xl text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h2 className="font-heading font-bold text-white text-3xl mb-3">Pedido Enviado!</h2>
          <p className="font-body text-gray-400 text-sm mb-8 leading-relaxed">
            Seu pedido foi redirecionado para o nosso WhatsApp. Basta clicar em <strong className="text-white">Enviar</strong> no WhatsApp para confirmar. Nossa equipe responderá em breve!
          </p>
          <Link to="/catalogo" className="btn-magnetic inline-block bg-[#7B61FF] text-white font-heading font-bold py-3.5 px-8 text-xs uppercase rounded-xl tracking-wider">
            <span className="btn-bg bg-[#51e8ff]"></span>
            <span>Voltar ao Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-6 md:px-8 min-h-screen bg-[#0A0A14] relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-2">Seu Carrinho</h1>
        <p className="font-body text-gray-400 text-sm mb-10">Revise seus itens e finalize os detalhes do seu ecossistema.</p>

        {cartItems.length === 0 ? (
          <div className="bg-[#12141A] border border-white/5 rounded-3xl p-16 text-center">
            <p className="font-heading text-white text-xl mb-4">Seu carrinho está vazio.</p>
            <Link to="/catalogo" className="btn-magnetic inline-block bg-[#7B61FF] text-white font-heading font-bold py-3 px-8 text-xs uppercase rounded-xl tracking-wider">
              <span className="btn-bg bg-[#51e8ff]"></span>
              <span>Explorar Catálogo</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT COLUMN: ITEMS & PAYMENT INFO */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-[#12141A] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-lg mb-6 flex items-center gap-2">
                  <span className="bg-[#7B61FF]/20 text-[#51e8ff] w-6 h-6 rounded-full flex items-center justify-center text-[10px]">{totalItems}</span>
                  Itens Selecionados
                </h2>
                
                <div className="flex flex-col gap-5">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="group relative flex gap-4 p-4 bg-[#0D0D14] rounded-2xl border border-white/5 hover:border-[#7B61FF]/30 transition-colors">
                      <div className="w-24 h-24 bg-[#1A1C24] rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img src={item.product.img} alt={item.product.name} className="w-full h-full object-contain p-2" />
                      </div>
                      
                      <div className="flex flex-col flex-1 justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-heading font-bold text-white text-[13px] leading-snug">{item.product.name}</h4>
                            <p className="font-body text-gray-500 text-[10px] mt-1 line-clamp-1">{item.product.desc}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-[#1A1C24] border border-white/10 rounded-lg px-1 py-1">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-md"><Minus size={12} /></button>
                            <span className="font-mono text-white text-xs w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-md"><Plus size={12} /></button>
                          </div>
                          <p className="font-mono text-[#51e8ff] font-bold text-sm tracking-wide">{item.product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT INFO */}
              <div className="bg-gradient-to-br from-[#12141A] to-[#0D0D14] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={120} />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-6 relative z-10">Formas de Pagamento no Fechamento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                    <QrCode className="text-[#51e8ff]" size={24} />
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm">Pix com Desconto</h4>
                      <p className="font-body text-gray-400 text-xs mt-1">Ganha 5% de desconto no valor total dos itens à pronta entrega.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                    <CreditCard className="text-[#ff4add]" size={24} />
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm">Cartão de Crédito</h4>
                      <p className="font-body text-gray-400 text-xs mt-1">Parcele em até 12x com acréscimo da maquininha.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CHECKOUT FORM */}
            <div className="lg:col-span-5">
              <div className="bg-[#12141A] border border-white/5 rounded-3xl p-6 md:p-8 sticky top-32">
                <h2 className="font-heading font-bold text-white text-lg mb-6">Finalização</h2>
                
                {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-body text-xs">
                    Erro ao processar pedido. Tente novamente mais tarde.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                    <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Nome Completo</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} 
                      className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">WhatsApp</label>
                      <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999"
                        className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors placeholder:text-gray-600" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">E-mail</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} 
                        className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors" />
                    </div>
                  </div>

                  {/* Opção de Entrega */}
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Opção de Entrega</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, delivery: 'retirada' })}
                        className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          formData.delivery === 'retirada'
                            ? 'bg-[#7B61FF]/15 border-[#7B61FF]/50 text-white'
                            : 'bg-[#0D0D14] border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <Store size={16} className={formData.delivery === 'retirada' ? 'text-[#51e8ff]' : ''} />
                        <span className="font-heading text-xs font-bold">Retirar na Loja</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, delivery: 'entrega' })}
                        className={`flex items-center gap-2.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          formData.delivery === 'entrega'
                            ? 'bg-[#7B61FF]/15 border-[#7B61FF]/50 text-white'
                            : 'bg-[#0D0D14] border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <Truck size={16} className={formData.delivery === 'entrega' ? 'text-[#51e8ff]' : ''} />
                        <span className="font-heading text-xs font-bold">Entrega</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos de Endereço — só aparecem se Entrega estiver selecionada */}
                  {formData.delivery === 'entrega' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Endereço</label>
                        <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Rua, número"
                          className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors placeholder:text-gray-600" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Bairro</label>
                          <input required type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} 
                            className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Cidade</label>
                          <input required type="text" name="city" value={formData.city} onChange={handleChange} 
                            className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">CEP</label>
                          <input required type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="00000-000"
                            className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors placeholder:text-gray-600" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-heading text-[10px] uppercase tracking-wider text-gray-400 ml-1">Complemento</label>
                          <input type="text" name="complement" value={formData.complement} onChange={handleChange} placeholder="Apto, bloco..."
                            className="w-full bg-[#0D0D14] border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm outline-none focus:border-[#51e8ff] transition-colors placeholder:text-gray-600" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Summary Totals */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-gray-400 text-sm">Subtotal</span>
                      <span className="font-mono text-white text-sm">
                        {totalPrice > 0 ? formatCurrency(totalPrice) : 'Consultar valor'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-[#7B61FF]">
                      <span className="font-body text-[10px]">Frete</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider">A Calcular</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-heading font-bold text-white text-sm">Total Estimado</span>
                      <span className="font-mono text-[#51e8ff] font-bold text-2xl drop-shadow-[0_0_12px_rgba(81,232,255,0.3)]">
                        {totalPrice > 0 ? formatCurrency(totalPrice) : 'Consultar valor'}
                      </span>
                    </div>
                    <p className="font-body text-[9px] text-gray-500 mt-2 text-right">
                      *Itens com preço sob consulta não constam no total.
                    </p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full btn-magnetic mt-2 bg-[#7B61FF] text-white font-heading font-bold py-4 text-xs uppercase cursor-pointer rounded-xl tracking-wider text-center flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span className="btn-bg bg-[#51e8ff]"></span>
                    {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span className="relative z-10 flex items-center gap-2">Finalizar Pedido <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

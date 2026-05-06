import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'PainelADM';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setAuthError('Senha incorreta');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A14] px-4">
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7B61FF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[#51e8ff]/5 rounded-full blur-[100px]" />
      </div>

      <div className={`relative max-w-sm w-full transition-transform ${shaking ? 'animate-shake' : ''}`}>
        {/* Card */}
        <div className="bg-[#12141A]/80 backdrop-blur-2xl border border-white/[0.06] p-8 rounded-[2rem] shadow-2xl shadow-black/40">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7B61FF]/20 to-[#51e8ff]/10 rounded-[1.2rem] flex items-center justify-center mx-auto mb-5 border border-white/[0.06] shadow-lg shadow-[#7B61FF]/10">
              <LogIn size={32} className="text-[#7B61FF]" />
            </div>
            <h2 className="font-heading font-bold text-white text-2xl mb-1 tracking-tight">Painel Admin</h2>
            <p className="font-body text-gray-500 text-xs">Acesso restrito ao gerenciamento</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
                placeholder="Senha de acesso"
                className="w-full bg-[#0D0D14]/80 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-body text-sm outline-none focus:border-[#7B61FF]/50 focus:shadow-[0_0_0_3px_rgba(123,97,255,0.1)] transition-all pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-body flex items-center gap-1.5 -mt-2">
                <AlertCircle size={12} /> {authError}
              </p>
            )}

            <button type="submit" className="w-full bg-gradient-to-r from-[#7B61FF] to-[#6B51EF] text-white font-heading font-bold py-3.5 text-xs uppercase rounded-xl tracking-wider cursor-pointer hover:shadow-lg hover:shadow-[#7B61FF]/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Entrar
            </button>
          </form>
        </div>

        {/* Bottom subtle text */}
        <p className="text-center text-gray-600 text-[10px] font-mono mt-4 tracking-wider">KAIRÓS REEF • ADMIN v2.0</p>
      </div>
    </div>
  );
}

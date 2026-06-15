import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, KeyRound, Globe, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import { getDatabase } from '../services/db';

interface AdminLoginProps {
  onLoginSuccess: (session: { role: 'owner' | 'singer'; userId: string }) => void;
  onGoBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onGoBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loginRole, setLoginRole] = useState<'singer' | 'owner'>('singer');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password;

    // 1. Check Platform Owner Account (Dono)
    if (loginRole === 'owner') {
      if (enteredUser === 'admin' || enteredUser === 'admin@vocalis.com.br' || enteredUser === 'dono@vocalis.com.br') {
        if (enteredPass === 'admin123' || enteredPass === '123') {
          onLoginSuccess({ role: 'owner', userId: 'owner' });
          return;
        }
      }
      setError('Credenciais administrativas do Proprietário incorretas.');
      return;
    }

    // 2. Check Singer Accounts (Cantores)
    const singers = getDatabase();
    const matchedSinger = singers.find(
      s => 
        s.username.toLowerCase() === enteredUser || 
        s.email.toLowerCase() === enteredUser
    );

    if (matchedSinger) {
      if (matchedSinger.password === enteredPass) {
        onLoginSuccess({ role: 'singer', userId: matchedSinger.username });
        return;
      } else {
        setError('Senha incorreta para a conta de cantor associada.');
        return;
      }
    }

    setError('Nenhuma conta de cantor correspondente com esse e-mail ou slug.');
  };

  return (
    <div className="bg-[#09090b] min-h-screen text-zinc-100 flex items-center justify-center p-4">
      {/* Cinematic Blur Graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full filter blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full filter blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Navigation back */}
        <button
          onClick={onGoBack}
          className="mb-8 flex items-center gap-2 group text-sm text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition duration-200" />
          Voltar a Navegar
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-500 shadow-xl shadow-amber-950/40">
            <ShieldCheck className="text-black" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white">Área de Acesso</h2>
          <p className="text-zinc-500 text-sm mt-1.5 font-light">
            Efetue o login para gerenciar sua vitrine ou configurar novos artistas.
          </p>
        </div>

        {/* Tab Toggle Switch */}
        <div className="grid grid-cols-2 gap-1 bg-zinc-900/60 border border-zinc-800 p-1 rounded-xl mb-6 text-sm font-medium font-mono text-zinc-400">
          <button
            onClick={() => { setLoginRole('singer'); setError(null); }}
            className={`py-2 rounded-lg transition cursor-pointer ${loginRole === 'singer' ? 'bg-amber-655 bg-amber-600 text-black font-semibold shadow-md' : 'hover:text-white'}`}
          >
            Acesso Cantor
          </button>
          <button
            onClick={() => { setLoginRole('owner'); setError(null); }}
            className={`py-2 rounded-lg transition cursor-pointer ${loginRole === 'owner' ? 'bg-amber-655 bg-amber-600 text-black font-semibold shadow-md' : 'hover:text-white'}`}
          >
            Acesso Dono
          </button>
        </div>

        {/* Card Form container */}
        <div className="glass rounded-3xl p-6 shadow-2xl relative border border-zinc-805">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-900/50 text-red-300 text-xs flex items-start gap-2.5 leading-snug"
            >
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            {/* Input Username / E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Mail size={12} />
                {loginRole === 'singer' ? 'E-mail ou Username do Cantor' : 'E-mail do Administrador'}
              </label>
              <input
                type="text"
                required
                placeholder={loginRole === 'singer' ? 'Ex: arthurvalente (ou seu email)' : 'admin@vocalis.com.br'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-white placeholder-zinc-600"
              />
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <KeyRound size={12} />
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-white placeholder-zinc-600"
              />
            </div>

            {/* Hint Box based on choice */}
            <div className="text-zinc-400 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs space-y-1 my-2 font-mono">
              <span className="font-bold text-zinc-300">ℹ️ Dados de login comuns:</span>
              {loginRole === 'singer' ? (
                <>
                  <p>• Usuário: <code className="text-amber-500">arthurvalente</code> | Senha: <code className="text-amber-500">123</code></p>
                  <p>• Usuário: <code className="text-amber-500">claramel</code> | Senha: <code className="text-amber-500">123</code></p>
                </>
              ) : (
                <p>• Usuário: <code className="text-amber-500">admin</code> | Senha: <code className="text-amber-500">123</code></p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-center text-sm bg-amber-600 hover:bg-amber-700 transition duration-200 text-black cursor-pointer hover:shadow-lg hover:shadow-amber-950/20 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <UserCheck size={16} />
              Acessar Painel Residencial
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

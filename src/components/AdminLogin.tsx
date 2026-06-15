import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, UserCheck, KeyRound, ArrowLeft, Mail, AlertTriangle, 
  Inbox, CheckCircle2, RotateCcw, Key, Check 
} from 'lucide-react';
import { getDatabase, getAdminCredentials, syncAdminCredentials, updateAdminCredentials, updateSinger } from '../services/db';

interface AdminLoginProps {
  onLoginSuccess: (session: { role: 'owner' | 'singer'; userId: string }) => void;
  onGoBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onGoBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginRole, setLoginRole] = useState<'singer' | 'owner'>('singer');

  // Admin Credentials fetched from Firestore (or LocalStorage cache)
  const [adminCreds, setAdminCreds] = useState(() => getAdminCredentials());

  // Password Recovery States
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'code' | 'password'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Load latest admin config on startup
  useEffect(() => {
    syncAdminCredentials().then(creds => {
      setAdminCreds(creds);
    });
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password;

    // 1. Check Platform Owner Account (Administrador)
    if (loginRole === 'owner') {
      const isUserMatch = enteredUser === adminCreds.username.toLowerCase() || enteredUser === adminCreds.email.toLowerCase();
      const isPassMatch = enteredPass === adminCreds.password;
      
      if (isUserMatch && isPassMatch) {
         onLoginSuccess({ role: 'owner', userId: 'owner' });
         return;
      }
      setError('Credenciais administrativas do Administrador incorretas.');
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

    setError('Nenhuma conta de cantor correspondente encontrada com esse e-mail ou slug.');
  };

  // Launch Recovery Email Dispatch State
  const handleSendRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);

    const cleanEmail = recoveryEmail.trim().toLowerCase();

    if (loginRole === 'owner') {
      if (cleanEmail !== adminCreds.email.toLowerCase()) {
        setRecoveryError('O e-mail digitado não coincide com o do Administrador cadastrado.');
        return;
      }
    } else {
      const singers = getDatabase();
      const hasSinger = singers.some(s => s.email.toLowerCase() === cleanEmail);
      if (!hasSinger) {
        setRecoveryError('Nenhuma conta de cantor cadastrada com esse e-mail.');
        return;
      }
    }

    // Generate random 6-digit confirmation PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(pin);
    setRecoveryStep('code');
  };

  // Verify PIN Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);

    if (enteredCode.trim() === generatedCode) {
      setRecoveryStep('password');
    } else {
      setRecoveryError('Código de segurança incorreto. Verifique o código simulado na caixa ao lado.');
    }
  };

  // Set the New Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);

    if (newPassword.length < 3) {
      setRecoveryError('A senha deve conter pelo menos 3 caracteres por questões de segurança.');
      return;
    }

    if (loginRole === 'owner') {
      const updated = { ...adminCreds, password: newPassword };
      const successDb = await updateAdminCredentials(updated);
      if (successDb) {
        setAdminCreds(updated);
        setSuccess('Senha do Administrador atualizada com sucesso! Entre abaixo.');
        resetRecoveryState();
      } else {
        setRecoveryError('Não foi possível sincronizar com o banco de dados. Tente novamente.');
      }
    } else {
      // Update singer password
      const singers = getDatabase();
      const singerToUpdate = singers.find(s => s.email.toLowerCase() === recoveryEmail.trim().toLowerCase());
      if (singerToUpdate) {
        const updatedSinger = { ...singerToUpdate, password: newPassword };
        const successDb = await updateSinger(updatedSinger);
        if (successDb) {
          setSuccess(`Senha do cantor ${singerToUpdate.name} redefinida com sucesso!`);
          resetRecoveryState();
        } else {
          setRecoveryError('Não foi possível salvar a nova senha no banco de dados.');
        }
      } else {
        setRecoveryError('Erro interno ao localizar o cadastro do cantor.');
      }
    }
  };

  const resetRecoveryState = () => {
    setIsRecovering(false);
    setRecoveryEmail('');
    setGeneratedCode('');
    setEnteredCode('');
    setRecoveryStep('email');
    setNewPassword('');
    setRecoveryError(null);
  };

  return (
    <div className="bg-[#09090b] min-h-screen text-zinc-100 flex items-center justify-center p-4">
      {/* Cinematic Blur Graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full filter blur-[120px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700/10 rounded-full filter blur-[120px] opacity-15 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Navigation back */}
        <button
          onClick={onGoBack}
          className="mb-8 flex items-center gap-2 group text-sm text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition duration-200" />
          Voltar à Home
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-650 flex items-center justify-center mx-auto mb-4 border border-amber-500 shadow-xl shadow-amber-950/40">
            <ShieldCheck className="text-black" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white">
            {isRecovering ? 'Recuperação de Acesso' : 'Área de Acesso'}
          </h2>
          <p className="text-zinc-500 text-sm mt-1.5 font-light">
            {isRecovering 
              ? 'Insira seus dados para obter uma credencial temporária' 
              : 'Efetue o login para gerenciar sua vitrine ou configurar novos artistas.'}
          </p>
        </div>

        {/* Tab Toggle Switch (only if not recovering) */}
        {!isRecovering && (
          <div className="grid grid-cols-2 gap-1 bg-zinc-900/60 border border-zinc-805 p-1 rounded-xl mb-6 text-sm font-medium font-mono text-zinc-400">
            <button
              onClick={() => { setLoginRole('singer'); setError(null); }}
              className={`py-2 rounded-lg transition cursor-pointer ${loginRole === 'singer' ? 'bg-amber-600 text-black font-semibold shadow-md' : 'hover:text-white'}`}
            >
              Acesso Cantor
            </button>
            <button
              onClick={() => { setLoginRole('owner'); setError(null); }}
              className={`py-2 rounded-lg transition cursor-pointer ${loginRole === 'owner' ? 'bg-amber-600 text-black font-semibold shadow-md' : 'hover:text-white'}`}
            >
              Administrador
            </button>
          </div>
        )}

        {/* Notification Boxes */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-900/50 text-red-300 text-xs flex items-start gap-2.5 leading-snug"
            >
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 text-emerald-300 text-xs flex items-start gap-2.5 leading-snug"
            >
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}

          {recoveryError && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-350 text-xs flex items-start gap-2.5 leading-snug"
            >
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{recoveryError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form area */}
        <div className="glass rounded-3xl p-6 shadow-2xl relative border border-zinc-805">
          
          <AnimatePresence mode="wait">
            {!isRecovering ? (
              // STANDARD LOGIN FORM VIEW
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleFormSubmit} 
                className="space-y-5"
              >
                {/* Input Username / E-mail */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail size={12} />
                    {loginRole === 'singer' ? 'E-mail ou Username do Cantor' : 'E-mail ou Usuário Administrativo'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={loginRole === 'singer' ? 'Ex: arthurvalente (ou seu email)' : 'Escreva seu e-mail de acesso...'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-820 bg-zinc-950 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-white placeholder-zinc-700 font-sans"
                  />
                </div>

                {/* Input Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <KeyRound size={12} />
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={() => { setIsRecovering(true); setError(null); setSuccess(null); }}
                      className="text-[11px] font-medium text-amber-500 hover:text-amber-400 transition cursor-pointer"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-820 bg-zinc-950 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-white placeholder-zinc-700 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-center text-sm bg-amber-600 hover:bg-amber-700 transition duration-200 text-black cursor-pointer hover:shadow-lg hover:shadow-amber-950/20 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <UserCheck size={16} />
                  Acessar Painel Comercial
                </button>
              </motion.form>
            ) : (
              // EMAIL RECOVERY FORM VIEW WITH MULTI-STEP FLOW
              <motion.div
                key="recovery-stages"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {recoveryStep === 'email' && (
                  <form onSubmit={handleSendRecoveryCode} className="space-y-4">
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Digite o e-mail de acesso cadastrado para o perfil selecionado (<span className="text-amber-500 font-semibold">{loginRole === 'owner' ? 'Administrador' : 'Cantor'}</span>). Enviaremos um código simulado e seguro de redefinição imediata.
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        E-mail de Cadastro
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: contato@perfil.com.br"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-820 bg-zinc-950 text-sm outline-none focus:border-amber-500 transition text-white placeholder-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-750 text-black hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Inbox size={15} />
                      Solicitar Código de Segurança
                    </button>
                  </form>
                )}

                {recoveryStep === 'code' && (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    {/* SIMULATED EMAIL INBOX NOTIFICATION EMBED */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-600/20 text-amber-450 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        <Inbox size={12} className="text-amber-450 animate-bounce" />
                        <span>Simulação de Caixa de Entrada (E-mail)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-zinc-400">
                        Como estamos rodando em ambiente de demonstração web, mostramos o e-mail que acabou de ser enviado para <span className="text-white font-medium">{recoveryEmail}</span>:
                      </p>
                      <div className="bg-black/40 rounded-xl p-3 border border-zinc-850 font-mono text-center text-white select-all">
                        <span className="text-zinc-500 text-[10px] block font-sans tracking-normal font-light">Código de Segurança:</span>
                        <span className="text-xl font-bold tracking-widest text-amber-500 block py-1 mt-0.5">{generatedCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Inserir Código de Segurança (6 Dígitos)
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Digite o PIN gerado..."
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-820 bg-zinc-950 text-center text-sm font-bold tracking-widest outline-none focus:border-amber-500 transition text-white font-mono placeholder-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-black hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Check size={16} />
                      Validar Código
                    </button>
                  </form>
                )}

                {recoveryStep === 'password' && (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <p className="text-zinc-400 text-xs">
                      Código validado! Escolha abaixo sua nova senha de acesso definitiva para prosseguir com o login.
                    </p>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Ex: novaSenha123"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-820 bg-zinc-950 text-sm outline-none focus:border-amber-500 transition text-white placeholder-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-sm bg-amber-600 hover:bg-amber-700 text-black hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Key size={15} />
                      Salvar Nova Senha
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={resetRecoveryState}
                  className="w-full py-3 rounded-xl font-semibold text-center text-xs border border-white/5 bg-transparent hover:bg-white/5 transition text-zinc-400 hover:text-white cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  Cancelar & Voltar ao Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

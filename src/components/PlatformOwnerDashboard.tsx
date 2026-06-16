import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, LogOut, Plus, Link as LinkIcon, Trash2, Edit3, 
  ExternalLink, Copy, Check, Sparkles, Sliders, ShieldCheck, Mail, Lock, Phone, Palette, HelpCircle 
} from 'lucide-react';
import { SingerProfile } from '../types';
import { getDatabase, addSinger, deleteSinger, getAdminCredentials, updateAdminCredentials } from '../services/db';
import { getShareUrl } from '../utils/mediaParser';

interface PlatformOwnerDashboardProps {
  onLogout: () => void;
  onImpersonateSinger: (username: string) => void;
}

export default function PlatformOwnerDashboard({ onLogout, onImpersonateSinger }: PlatformOwnerDashboardProps) {
  const [singers, setSingers] = useState<SingerProfile[]>(() => getDatabase());
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New singer form state fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('5511999998888');
  const [genre, setGenre] = useState('Sertanejo Universitário');
  const [themeColor, setThemeColor] = useState<SingerProfile['themeColor']>('amber');
  const [slogan, setSlogan] = useState('Show animado com repertório exclusivo');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // Admin Credentials Management States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRecoveryEmail, setAdminRecoveryEmail] = useState('');
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Sync / populate administrator values
  React.useEffect(() => {
    const creds = getAdminCredentials();
    setAdminUsername(creds.username);
    setAdminEmail(creds.email);
    setAdminPassword(creds.password);
    setAdminRecoveryEmail(creds.recoveryEmail || creds.email);
  }, []);

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    const cleanUser = adminUsername.trim().toLowerCase();
    const cleanMail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword;
    const cleanRecoveryMail = adminRecoveryEmail.trim().toLowerCase();

    if (cleanUser.length < 3) {
      setAdminError('O usuário do administrador deve ter pelo menos 3 caracteres.');
      return;
    }
    if (cleanMail.length < 5 || !cleanMail.includes('@')) {
      setAdminError('Por favor, insira um e-mail válido para o administrador.');
      return;
    }
    if (cleanPass.length < 3) {
      setAdminError('A senha do administrador deve ter pelo menos 3 caracteres.');
      return;
    }
    if (cleanRecoveryMail.length < 5 || !cleanRecoveryMail.includes('@')) {
      setAdminError('Por favor, insira um e-mail de recuperação válido.');
      return;
    }

    const updated = await updateAdminCredentials({
      username: cleanUser,
      email: cleanMail,
      password: cleanPass,
      recoveryEmail: cleanRecoveryMail
    });

    if (updated) {
      setAdminSuccess('Credenciais administrativas salvas e atualizadas com sucesso no Firestore!');
      setTimeout(() => setAdminSuccess(null), 4000);
    } else {
      setAdminError('Ocorreu um erro ao atualizar as credenciais no Firestore.');
    }
  };

  // Stats calculation
  const totalSingers = singers.length;
  const totalEvents = singers.reduce((acc, curr) => acc + (curr.events?.length || 0), 0);

  const handleCopyLink = (slug: string) => {
    // Generate exclusive share link
    const singerObj = singers.find(s => s.username === slug);
    const shareLink = singerObj ? getShareUrl(singerObj) : `${window.location.origin}${window.location.pathname}?singer=${slug}`;
    
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const handleAddSinger = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanSlug = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (cleanSlug.length < 3) {
      setErrorMessage('O username (slug) deve conter pelo menos 3 caracteres alfanuméricos.');
      return;
    }

    // Prepare profile structure
    const newProfile: SingerProfile = {
      username: cleanSlug,
      password: password || '123',
      name: name.trim(),
      slogan: slogan.trim(),
      bio: `Nascido para cantar, ${name.trim()} oferece uma apresentação impecável marcada por carisma e dedicação aos palcos do país.`,
      phone: phone.trim().replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
      genre: genre.trim(),
      themeColor: themeColor,
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300&h=300',
      offersInvoice: true,
      offersContract: true,
      travelEnabled: true,
      travelBaseRadius: 50,
      travelStepKm: 50,
      travelIncrementPercent: 10,
      travelOrigin: 'São Paulo - SP',
      gallery: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=530',
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800&h=530',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800&h=530',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800&h=530'
      ],
      plans: [
        {
          id: `plan-1-${cleanSlug}`,
          name: 'Voz e Violão Básica',
          price: 'R$ 2.000',
          description: 'Apresentação intimista ideal para eventos menores e coquetéis.',
          features: [
            'Cantor voz e violão solo',
            'Duração de 2 horas',
            'Equipamento acústico básico incluso'
          ]
        },
        {
          id: `plan-2-${cleanSlug}`,
          name: 'Show Pocket Banda',
          price: 'R$ 4.500',
          description: 'Recepções médias e casamentos animados.',
          recommended: true,
          features: [
            'Trio: Cantor + Sanfona + Percussão',
            'Duração de 3 horas',
            'Sonorização de qualidade de médio porte'
          ]
        },
        {
          id: `plan-3-${cleanSlug}`,
          name: 'Mega Show Premium',
          price: 'R$ 8.900',
          description: 'Eventos luxuosos e formaturas para impacto absoluto.',
          features: [
            'Banda completa de 4 instrumentistas',
            'Duração de 4 horas intensas',
            'Efeitos especiais, som e iluminação profissional de grande porte'
          ]
        }
      ],
      events: [],
      testimonials: [],
      faqs: []
    };

    const succeeded = addSinger(newProfile);
    if (!succeeded) {
      setErrorMessage(`O slug "@${cleanSlug}" já está em uso por outro cantor. Escolha outro.`);
      return;
    }

    // Success response
    setSuccessMessage(`Cantor ${name} adicionado com sucesso! Link livre para divulgação.`);
    setSingers(getDatabase());
    // Reset inputs
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setPhone('5511999998888');
    setGenre('Sertanejo Universitário');
  };

  const handleDelete = (slug: string) => {
    if (deletingSlug === slug) {
      deleteSinger(slug);
      setSingers(getDatabase());
      setDeletingSlug(null);
    } else {
      setDeletingSlug(slug);
      setTimeout(() => {
        setDeletingSlug((current) => current === slug ? null : current);
      }, 3500);
    }
  };

  const getThemeColorClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      case 'indigo': return 'bg-indigo-500 hover:bg-indigo-600';
      case 'rose': return 'bg-rose-500 hover:bg-rose-600';
      case 'crimson': return 'bg-red-500 hover:bg-red-600';
      case 'violet': return 'bg-violet-500 hover:bg-violet-600';
      case 'sky': return 'bg-sky-400 hover:bg-sky-500';
      case 'amber':
      default: return 'bg-amber-500 hover:bg-amber-600';
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation / Header bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-sans">Geral e Controle • Proprietário</h1>
              <p className="text-xs text-slate-400 mt-0.5">Vocalis Singer Host Platform Engine</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <LogOut size={14} />
            Encerrar Sessão
          </button>
        </div>

        {/* Dashboard quick stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono block">CANTORES ATIVOS</span>
              <span className="text-3xl font-bold mt-1 block">{totalSingers}</span>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Users size={22} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono block">SHOWS EM AGENDA</span>
              <span className="text-3xl font-bold mt-1 block">{totalEvents}</span>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Calendar size={22} />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-mono block">STATUS INFRAESTRUTURA</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-505 animate-pulse inline-block" />
                Vocalis Cloud Online
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Sparkles size={22} />
            </div>
          </div>
        </div>

        {/* Content body split: Add singer (left) y Catalog table (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Stack with Singer Creation & Admin Credentials */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            
            {/* Create new Artist form pillar */}
            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 font-sans text-white border-b border-white/5 pb-2">
                <Plus size={18} className="text-indigo-400" />
                Cadastrar Novo Cantor
              </h3>

              {errorMessage && (
                <div className="p-3.5 mb-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs leading-relaxed">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs leading-relaxed">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleAddSinger} className="space-y-4 text-xs font-medium">
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Nome Oficial do Cantor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Marcus Vinícius"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-505"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    Username Slug (Link Único) *
                    <HelpCircle size={11} className="text-slate-500 cursor-help" title="Ex: ?singer=NOME_AQUI" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono font-medium">?singer=</span>
                    <input
                      type="text"
                      required
                      placeholder="marcusv"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full pl-[68px] pr-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Login *</label>
                    <input
                      type="email"
                      required
                      placeholder="marcus@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Senha Login *</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-505 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Telefone Whatsapp *</label>
                    <input
                      type="text"
                      required
                      placeholder="5511999998888"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-505 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gênero Musical *</label>
                    <input
                      type="text"
                      required
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-505"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Cor Temática de Destaque</label>
                  <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[9px]">
                    {(['amber', 'emerald', 'blue', 'rose', 'crimson', 'violet', 'sky', 'indigo'] as SingerProfile['themeColor'][]).map(col => (
                      <button
                        type="button"
                        key={col}
                        onClick={() => setThemeColor(col)}
                        className={`py-1.5 rounded-lg border text-center transition flex flex-col items-center gap-1 capitalize ${
                          themeColor === col 
                            ? 'border-indigo-550 text-white bg-white/10 font-bold' 
                            : 'border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${getThemeColorClass(col).split(' ')[0]}`} />
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Slogan Comercial Resumido</label>
                  <input
                    type="text"
                    placeholder="Ex: O show sertanejo perfeito para noites elegantes"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-indigo-550"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold bg-indigo-650 hover:bg-indigo-705 text-white text-center transition active:scale-98 cursor-pointer shadow-md mt-4 flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  Confirmar Cadastro & Ativar
                </button>

              </form>
            </div>

            {/* Administrador Credentials Management card */}
            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 font-sans text-white border-b border-white/5 pb-2">
                <Lock size={18} className="text-amber-500" />
                Credenciais do Administrador
              </h3>

              {adminError && (
                <div className="p-3 mb-3 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs">
                  {adminError}
                </div>
              )}

              {adminSuccess && (
                <div className="p-3 mb-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-250 text-xs">
                  {adminSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateAdmin} className="space-y-4 text-xs font-medium">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Usuário Administrativo</label>
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value.replace(/[^a-zA-Z0-9_\-]/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">E-mail Administrativo</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@vocalis.com.br"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-amber-500 font-sans">E-mail de Recuperação (Reset de Senha)</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: recuperacao@seuemail.com"
                    value={adminRecoveryEmail}
                    onChange={(e) => setAdminRecoveryEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-amber-500/20 text-slate-100 outline-none focus:border-amber-500 text-sm hover:border-amber-550 transition"
                  />
                  <span className="text-[10px] text-slate-500 font-light leading-normal mt-0.5">
                    Utilize este e-mail para receber o código simulado se você esquecer as credenciais novamente.
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Senha de Acesso</label>
                  <input
                    type="text"
                    required
                    placeholder="Sua senha..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-100 outline-none focus:border-amber-500 font-mono text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-black text-center transition active:scale-98 cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  Salvar Credenciais
                </button>
              </form>
            </div>

          </div>

          {/* List of Registered Singers */}
          <div className="lg:col-span-8 bg-slate-950 border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-5 font-sans text-white border-b border-white/5 pb-2">
              Contas de Cantores Ativos ({singers.length})
            </h3>

            {singers.length > 0 ? (
              <div className="space-y-4">
                {singers.map((singer, idx) => {
                  const shareUrl = getShareUrl(singer);
                  const isCopied = copiedSlug === singer.username;
                  
                  return (
                    <div 
                      key={singer.username || idx}
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition hover:bg-white/10"
                    >
                      {/* Left: General data */}
                      <div className="flex items-center gap-4">
                        {/* Circle badge mapping theme */}
                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-black font-semibold text-center uppercase shadow ${getThemeColorClass(singer.themeColor)}`}>
                          <span className="text-xs">{singer.name.charAt(0)}</span>
                          <span className="text-[8px] leading-none opacity-80">{singer.username.slice(0, 3)}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-white">{singer.name}</h4>
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-305 border border-indigo-500/20 capitalize">
                              {singer.genre}
                            </span>
                          </div>
                          
                          {/* Links layout */}
                          <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1 text-slate-400 text-xs mt-1.5 font-light">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Mail size={12} />
                              {singer.email}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-450">
                              <Check size={12} />
                              Tel: +{singer.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side controls */}
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-white/5">
                        
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(singer.username)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-slate-300 font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer border border-white/5"
                          title="Copiar link exclusivo do cantor"
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Copiar Link
                            </>
                          )}
                        </button>

                        {/* Impersonate / Edit Button */}
                        <button
                          onClick={() => onImpersonateSinger(singer.username)}
                          className="px-3 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-slate-950 font-bold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
                          title="Fazer login simulado para gerenciar opções"
                        >
                          <Edit3 size={12} />
                          Editar Vitrine
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(singer.username)}
                          className={`p-1.5 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer ${
                            deletingSlug === singer.username
                              ? 'px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase font-mono'
                              : 'bg-red-950 hover:bg-red-900 border border-red-800 text-red-100'
                          }`}
                          title="Remover vitrine do ar"
                        >
                          {deletingSlug === singer.username ? (
                            <span>Confirmar Exclusão</span>
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>

                        {/* Open Public Page */}
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/5 text-white flex items-center justify-center transition active:scale-95"
                          title="Visualizar Vitrine Publicada"
                        >
                          <ExternalLink size={13} />
                        </a>

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-400">
                <Users size={32} className="mx-auto text-slate-500 mb-3" />
                <p className="text-sm">Nenhum cantor disponível na hospedagem. Adicione o seu primeiro artista!</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

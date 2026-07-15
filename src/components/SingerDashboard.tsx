import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Sliders, Image as ImageIcon, Calendar, Quote, Check, Save, 
  Plus, Trash2, LogOut, ExternalLink, RefreshCw, Star, ArrowRight, HelpCircle 
} from 'lucide-react';
import { SingerProfile, Plan, ShowEvent, Testimonial, FAQItem } from '../types';
import { updateSinger, getSinger } from '../services/db';
import { parseMediaUrl, getShareUrl } from '../utils/mediaParser';

interface SingerDashboardProps {
  username: string;
  onLogout: () => void;
  onPreviewShowcase?: (slug: string) => void;
}

export default function SingerDashboard({ username, onLogout, onPreviewShowcase }: SingerDashboardProps) {
  const [profile, setProfile] = useState<SingerProfile | null>(() => getSinger(username) || null);
  const [activeTab, setActiveTab] = useState<'geral' | 'plans' | 'gallery' | 'events' | 'testimonials'>('geral');
  const [isSaved, setIsSaved] = useState(false);

  // General fields local state
  const [name, setName] = useState(profile?.name || '');
  const [slogan, setSlogan] = useState(profile?.slogan || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [genre, setGenre] = useState(profile?.genre || '');
  const [themeColor, setThemeColor] = useState<SingerProfile['themeColor']>(profile?.themeColor || 'amber');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [coverUrl, setCoverUrl] = useState(profile?.coverUrl || '');
  const [bioPhotoUrl, setBioPhotoUrl] = useState(profile?.bioPhotoUrl || '');
  const [instagram, setInstagram] = useState(profile?.instagram || '');
  const [youtube, setYoutube] = useState(profile?.youtube || '');
  const [spotify, setSpotify] = useState(profile?.spotify || '');
  const [offersInvoice, setOffersInvoice] = useState(profile?.offersInvoice ?? false);
  const [offersContract, setOffersContract] = useState(profile?.offersContract ?? false);
  const [travelEnabled, setTravelEnabled] = useState(profile?.travelEnabled ?? false);
  const [travelBaseRadius, setTravelBaseRadius] = useState<number>(profile?.travelBaseRadius ?? 50);
  const [travelStepKm, setTravelStepKm] = useState<number>(profile?.travelStepKm ?? 50);
  const [travelIncrementPercent, setTravelIncrementPercent] = useState<number>(profile?.travelIncrementPercent ?? 10);
  const [travelOrigin, setTravelOrigin] = useState<string>(profile?.travelOrigin || 'São Paulo - SP');

  // Subsections fields state
  const [plans, setPlans] = useState<Plan[]>(profile?.plans || []);
  const [gallery, setGallery] = useState<string[]>(profile?.gallery || []);
  const [events, setEvents] = useState<ShowEvent[]>(() => {
    const list = profile?.events || [];
    return [...list].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(profile?.testimonials || []);
  const [faqs, setFaqs] = useState<FAQItem[]>(profile?.faqs || []);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simDistance, setSimDistance] = useState<number>(100);

  // Creation temps for maps
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newEvtTitle, setNewEvtTitle] = useState('');
  const [newEvtDate, setNewEvtDate] = useState('');
  const [newEvtTime, setNewEvtTime] = useState('');
  const [newEvtVenue, setNewEvtVenue] = useState('');
  const [newEvtCity, setNewEvtCity] = useState('');
  const [newEvtStatus, setNewEvtStatus] = useState<ShowEvent['status']>('confirmado');

  const [newTestName, setNewTestName] = useState('');
  const [newTestRole, setNewTestRole] = useState('');
  const [newTestContent, setNewTestContent] = useState('');
  const [newTestRating, setNewTestRating] = useState(5);

  const [newFaqQuest, setNewFaqQuest] = useState('');
  const [newFaqAns, setNewFaqAns] = useState('');

  if (!profile) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 font-bold">Erro: Perfil do cantor não localizado.</p>
          <button onClick={onLogout} className="mt-4 px-4 py-2 rounded bg-indigo-600">Sair</button>
        </div>
      </div>
    );
  }

  // Handle ultimate save to Database and trigger quick confirmation message
  const handleSaveChanges = () => {
    setIsSaved(false);
    const updatedProfile: SingerProfile = {
      username: profile.username,
      password: profile.password,
      name: name.trim(),
      slogan: slogan.trim(),
      bio: bio.trim(),
      phone: phone.trim().replace(/\D/g, ''),
      email: email.trim().toLowerCase(),
      genre: genre.trim(),
      themeColor: themeColor,
      avatarUrl: avatarUrl.trim(),
      coverUrl: coverUrl.trim(),
      bioPhotoUrl: bioPhotoUrl.trim(),
      instagram: instagram.trim(),
      youtube: youtube.trim(),
      spotify: spotify.trim(),
      offersInvoice,
      offersContract,
      travelEnabled,
      travelBaseRadius,
      travelStepKm,
      travelIncrementPercent,
      travelOrigin: travelOrigin.trim(),
      gallery,
      plans,
      events,
      testimonials,
      faqs
    };

    const success = updateSinger(updatedProfile);
    if (success) {
      setProfile(updatedProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // Plan attribute changes
  const handlePlanChange = (planId: string, field: keyof Plan, value: any) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const handlePlanFeatureChange = (planId: string, featureIndex: number, textValue: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const copyFeat = [...p.features];
        copyFeat[featureIndex] = textValue;
        return { ...p, features: copyFeat };
      }
      return p;
    }));
  };

  const addPlanFeature = (planId: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, features: [...p.features, 'Nova característica do pacote'] };
      }
      return p;
    }));
  };

  const removePlanFeature = (planId: string, featureIndex: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, features: p.features.filter((_, idx) => idx !== featureIndex) };
      }
      return p;
    }));
  };

  // Photo gallery manipulation
  const MAX_AVATAR_DIMENSION = 300;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_AVATAR_DIMENSION) {
            height = Math.round((height * MAX_AVATAR_DIMENSION) / width);
            width = MAX_AVATAR_DIMENSION;
          }
        } else {
          if (height > MAX_AVATAR_DIMENSION) {
            width = Math.round((width * MAX_AVATAR_DIMENSION) / height);
            height = MAX_AVATAR_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleBioPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_BIO_PHOTO_DIMENSION = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_BIO_PHOTO_DIMENSION) {
            height = Math.round((height * MAX_BIO_PHOTO_DIMENSION) / width);
            width = MAX_BIO_PHOTO_DIMENSION;
          }
        } else {
          if (height > MAX_BIO_PHOTO_DIMENSION) {
            width = Math.round((width * MAX_BIO_PHOTO_DIMENSION) / height);
            height = MAX_BIO_PHOTO_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setBioPhotoUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_COVER_PHOTO_DIMENSION = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_COVER_PHOTO_DIMENSION) {
            height = Math.round((height * MAX_COVER_PHOTO_DIMENSION) / width);
            width = MAX_COVER_PHOTO_DIMENSION;
          }
        } else {
          if (height > MAX_COVER_PHOTO_DIMENSION) {
            width = Math.round((width * MAX_COVER_PHOTO_DIMENSION) / height);
            height = MAX_COVER_PHOTO_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCoverUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    setGallery(prev => [...prev, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
  };

  const handleRemovePhoto = (photoIdx: number) => {
    setGallery(prev => prev.filter((_, idx) => idx !== photoIdx));
  };

  // Gig/Tour Agenda Schedule manipulation
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvtTitle || !newEvtDate || !newEvtVenue || !newEvtCity) return;
    const newEvt: ShowEvent = {
      id: `evt-${Date.now()}`,
      title: newEvtTitle.trim(),
      date: newEvtDate,
      time: newEvtTime || '22:00',
      venue: newEvtVenue.trim(),
      city: newEvtCity.trim(),
      status: newEvtStatus
    };
    setEvents(prev => {
      const sorted = [...prev, newEvt];
      return sorted.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
    });
    // Reset temp fields
    setNewEvtTitle('');
    setNewEvtDate('');
    setNewEvtTime('');
    setNewEvtVenue('');
    setNewEvtCity('');
    setNewEvtStatus('confirmado');
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Testimonials manipulation
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName || !newTestContent) return;
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      name: newTestName.trim(),
      role: newTestRole.trim() || 'Contratante',
      content: newTestContent.trim(),
      rating: newTestRating
    };
    setTestimonials(prev => [...prev, newTest]);
    setNewTestName('');
    setNewTestRole('');
    setNewTestContent('');
    setNewTestRating(5);
  };

  const handleRemoveTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // FAQ updates
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuest || !newFaqAns) return;
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuest.trim(),
      answer: newFaqAns.trim()
    };
    setFaqs(prev => [...prev, newFaq]);
    setNewFaqQuest('');
    setNewFaqAns('');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const shareUrl = getShareUrl(profile);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col">
      
      {/* Dynamic Sub-header detailing top general management and direct public portal view shortcut */}
      <header className="bg-slate-950 border-b border-white/5 py-4 px-4 md:px-8 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-500 font-bold text-black border border-amber-400 flex items-center justify-center text-sm">
              {profile.name.charAt(0)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold font-sans">Painel de Edição Comercial</h1>
                <span className="text-[10px] font-semibold text-slate-500 font-mono">@{profile.username}</span>
              </div>
              <p className="text-xs text-slate-400">Personalize seus preços, fotos e agenda em tempo real.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onPreviewShowcase && (
              <button 
                type="button"
                onClick={() => {
                  handleSaveChanges();
                  onPreviewShowcase(profile.username);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-650/30 text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Visualizar dados diretamente integrados na vitrine"
              >
                <ExternalLink size={13} className="text-amber-500" />
                Minha Vitrine Ativa
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedLink ? 'bg-[#10b981] text-black border-[#34d399]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5'
              }`}
              title="Copiar link comercial para enviar aos clientes"
            >
              {copiedLink ? '✓ Copiado!' : 'Copiar Link'}
            </button>

            <button
              onClick={handleSaveChanges}
              className="px-4 py-1.5 rounded-lg bg-emerald-650 hover:bg-emerald-700 text-slate-100 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition active:scale-95"
            >
              <Save size={13} />
              {isSaved ? 'Gravado ✓' : 'Salvar Alteraçoes'}
            </button>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content: Navigation tab list and editing layout viewports */}
      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPACT TAB NAVIGATION SIDEBAR */}
        <aside className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-4 lg:pb-0 font-mono text-xs border-b lg:border-b-0 lg:border-r border-white/5 pr-0 lg:pr-4">
          <button
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-4 rounded-xl flex items-center gap-2 transition leading-none shrink-0 ${
              activeTab === 'geral' 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={14} />
            Dados Gerais
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-4 rounded-xl flex items-center gap-2 transition leading-none shrink-0 ${
              activeTab === 'plans' 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={14} />
            Preços e Planos
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 rounded-xl flex items-center gap-2 transition leading-none shrink-0 ${
              activeTab === 'gallery' 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            Galeria Mídias
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-4 rounded-xl flex items-center gap-2 transition leading-none shrink-0 ${
              activeTab === 'events' 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            Calendário Agenda
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 px-4 rounded-xl flex items-center gap-2 transition leading-none shrink-0 ${
              activeTab === 'testimonials' 
                ? 'bg-white/10 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Quote size={14} />
            Depoimentos & FAQ
          </button>
        </aside>

        {/* RIGHT EDITING VIEWPORT */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Quick Confirmation Banner */}
          {isSaved && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs font-semibold"
            >
              Suas alterações foram gravadas localmente com sucesso! Visite a sua vitrine pública para conferir as atualizações comerciais instantaneamente.
            </motion.div>
          )}

          {/* TAB 1: GERAL SETTINGS */}
          {activeTab === 'geral' && (
            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                <User size={18} className="text-amber-500" />
                Configurações Gerais do Cantor
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nome Artístico ou de Banda *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Gênero Musical Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pop Rock Nacional ou Sertanejo Universitário"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Comercial *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nº de Destino Whatsapp (Sinal de Contratação) *</label>
                  <input
                    type="text"
                    required
                    placeholder="5511999998888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

              </div>

              {/* Condições de Fechamento de Show */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Condições de Contratação e Fechamento
                </h3>
                <p className="text-xs text-zinc-400 leading-snug">
                  Selecione quais garantias comerciais e fiscais oficiais você oferece aos contratantes para exibição automática na sua vitrine comparativa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Offers Invoice Option */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-905/65 cursor-pointer border border-white/5 transition select-none">
                    <input
                      type="checkbox"
                      checked={offersInvoice}
                      onChange={(e) => setOffersInvoice(e.target.checked)}
                      className="mt-1 accent-amber-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">Oferece Emissão de Nota Fiscal (NF-e)</span>
                      <span className="block text-[11px] text-zinc-500 mt-0.5 leading-snug">
                        Marque se você pode emitir nota fiscal de prestação de serviços (essencial para eventos corporativos).
                      </span>
                    </div>
                  </label>

                  {/* Offers Contract Option */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 hover:bg-slate-905/65 cursor-pointer border border-white/5 transition select-none">
                    <input
                      type="checkbox"
                      checked={offersContract}
                      onChange={(e) => setOffersContract(e.target.checked)}
                      className="mt-1 accent-amber-500 w-4 h-4 rounded"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">Oferece Contrato Formal Digital</span>
                      <span className="block text-[11px] text-zinc-500 mt-0.5 leading-snug">
                        Marque se você formaliza as datas via contrato legal assinado digitalmente pelas partes.
                      </span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Configuração de Viagem e Deslocamento (Logística) */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Adicional para Logs. de Viagem / Deslocamento
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={travelEnabled}
                      onChange={(e) => setTravelEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-450 after:border-zinc-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white border border-white/5" />
                    <span className="ml-2 text-xs font-bold text-white uppercase tracking-wider">{travelEnabled ? "ATIVO" : "INATIVO"}</span>
                  </label>
                </div>
                <p className="text-xs text-zinc-405 leading-snug">
                  Defina como cobrar o deslocamento para shows fora de sua base de forma transparente. O sistema simulará o orçamento considerando o acréscimo de deslocamento para o contratante.
                </p>

                {travelEnabled && (
                  <div className="space-y-4 pt-2">
                    {/* Cidade de Origem / Base */}
                    <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/5">
                      <label className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Sua Cidade de Origem / Base *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: São Paulo - SP"
                        value={travelOrigin}
                        onChange={(e) => setTravelOrigin(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <span className="text-[9px] text-zinc-500">Ponto zero (sua cidade-base atual) utilizado para simular e traçar o trajeto rodoviário oficial até o evento do contratante.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Base Radius Limit */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-white/5">
                        <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Raio Base Incluso (Km)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={travelBaseRadius}
                            onChange={(e) => setTravelBaseRadius(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                          />
                          <span className="text-xs text-zinc-500 font-mono font-medium">km</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 mt-1">Até essa distância, show é feito sob preço padrão.</span>
                      </div>

                      {/* Step size */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-white/5">
                        <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Incrementar a cada (Km)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={travelStepKm}
                            onChange={(e) => setTravelStepKm(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                          />
                          <span className="text-xs text-zinc-500 font-mono font-medium">km</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 mt-1">Lote/passo de distância para aplicação de taxas.</span>
                      </div>

                      {/* Percentage Surcharge */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950 border border-white/5">
                        <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Taxa por Etapa (%)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={travelIncrementPercent}
                            onChange={(e) => setTravelIncrementPercent(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs text-white font-mono"
                          />
                          <span className="text-xs text-zinc-400 font-mono font-medium">%</span>
                        </div>
                        <span className="text-[9px] text-zinc-550 mt-1">Acréscimo percentual calculado a cada etapa de distância.</span>
                      </div>

                    </div>

                    {/* Calculation Simulator */}
                    <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                          ⚡ Simulador de Logística
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono font-medium">Veja como a conta ficará para o contratante</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-1/2 flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                            <span>Simular Distância:</span>
                            <span className="text-white font-bold">{simDistance} km</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={simDistance}
                            onChange={(e) => setSimDistance(parseInt(e.target.value) || 0)}
                            className="w-full accent-indigo-505 bg-slate-950 rounded-lg appearance-none h-1.5 cursor-pointer mt-1"
                          />
                        </div>

                        <div className="w-full sm:w-1/2 p-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs text-slate-300 leading-normal space-y-1">
                          <div>
                            Base Livre: <span className="text-white font-mono font-semibold">{travelBaseRadius} km</span>
                          </div>
                          <div>
                            Surgimento de Taxa: 
                            {simDistance <= travelBaseRadius ? (
                              <span className="text-emerald-400 font-semibold ml-1">Simulado com custo ZERO (Dentro da base!)</span>
                            ) : (
                              <span className="text-white ml-1">
                                {simDistance - travelBaseRadius} km excedentes ({Math.ceil((simDistance - travelBaseRadius) / travelStepKm)} lotes de {travelStepKm} km)
                              </span>
                            )}
                          </div>
                          {simDistance > travelBaseRadius && (
                            <div className="border-t border-white/5 pt-1 mt-1 text-[11px]">
                              Aumento Total: <span className="text-amber-400 font-mono font-bold">+{Math.ceil((simDistance - travelBaseRadius) / travelStepKm) * travelIncrementPercent}%</span> no valor do plano!
                            </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Slogan Comercial de Impacto *</label>
                <input
                  type="text"
                  required
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Apresentação / Biografia Comercial *</label>
                <textarea
                  required
                  rows={6}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* URL Avatar & Bio links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Foto de Avatar (Pequena - Perfil)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505 font-mono"
                    />
                    <label className="flex items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 transition border border-white/10 rounded-xl cursor-pointer text-sm whitespace-nowrap">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-500 leading-snug">
                    Otimizado e cortado para miniatura circular no cabeçalho e listagem do catálogo. Os pixels podem ficar aparentes se esticado.
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <label className="text-xs font-bold text-amber-550 uppercase tracking-wide flex justify-between items-center">
                    <span>Foto da Biografia (Site • Alta Resolução)</span>
                    <span className="text-[10px] text-amber-505/80 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Recomendado</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={bioPhotoUrl}
                      onChange={(e) => setBioPhotoUrl(e.target.value)}
                      placeholder="Carregue ou insira link de imagem HD..."
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505 font-mono"
                    />
                    <label className="flex items-center justify-center px-3.5 py-3 bg-amber-500 hover:bg-amber-600 transition text-black font-bold rounded-xl cursor-pointer text-sm whitespace-nowrap">
                      <span>Upload HD</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBioPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-snug">
                     💡 Exibida com destaque em plano vertical ao lado de sua Biografia. Envie um retrato nítido em alta qualidade para impressionar os contratantes!
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-wide flex justify-between items-center">
                    <span>Foto de Capa do Site (Hero e Cartão de Listagem)</span>
                    <span className="text-[10px] text-indigo-305/80 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Fundo / Vitrine</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Carregue ou insira link de imagem para a capa principal..."
                      className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505 font-mono"
                    />
                    <label className="flex items-center justify-center px-4 py-3 bg-indigo-500 hover:bg-indigo-600 transition text-black font-bold rounded-xl cursor-pointer text-sm whitespace-nowrap">
                      <span>Upload Capa</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-snug">
                     💡 Esta foto será exibida como imagem de fundo de alta qualidade (Hero) em sua Vitrine Comercial e como a imagem de capa do seu cartão na Vitrine de Cantores Credenciados da página inicial.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Username Instagram (ex: @meuinsta)</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505"
                  />
                </div>
              </div>

              {/* Spotify and Youtube links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">ID Artista Spotify (opcional)</label>
                  <input
                    type="text"
                    placeholder="E.g., 4gzgO98mre8X0E8gE9b95s"
                    value={spotify}
                    onChange={(e) => setSpotify(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nome YouTube (opcional)</label>
                  <input
                    type="text"
                    placeholder="E.g., arthurvalenteoficial"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-indigo-505"
                  />
                </div>
              </div>

              {/* Theme color override options */}
              <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cor Temática no Site do Contratante</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono text-[10px]">
                  {['amber', 'emerald', 'blue', 'rose', 'crimson', 'violet', 'sky', 'indigo'].map(col => (
                    <button
                      type="button"
                      key={col}
                      onClick={() => setThemeColor(col as SingerProfile['themeColor'])}
                      className={`py-2 rounded-lg border text-center transition capitalize cursor-pointer ${
                        themeColor === col 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' 
                          : 'border-white/5 text-slate-405 hover:text-white bg-white/5'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PACKAGES & PLAN PRICING SECTORS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-white/5 rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                  <Sliders size={18} className="text-emerald-500" />
                  Grade de Pacotes Comerciais de Shows
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
                  Defina 3 pacotes claros (Básico, Destaque Recomendado e Premium Completo) para evitar perda de tempo com negociações individuais.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {plans.map((p, idx) => (
                  <div key={p.id || idx} className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 text-sans">
                      <h3 className="text-base font-bold text-indigo-455">
                        Opção {idx + 1}: {p.name || 'Pacote Sem Nome'}
                      </h3>
                      <label className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <input
                          type="checkbox"
                          checked={p.recommended || false}
                          onChange={(e) => handlePlanChange(p.id, 'recommended', e.target.checked)}
                          className="rounded border-white/10 bg-slate-900"
                        />
                        Highlight (Mais Vendido)
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nome Comercial do Plano</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handlePlanChange(p.id, 'name', e.target.value)}
                          className="px-3 py-2.5 rounded-lg border border-white/10 bg-slate-900 text-sm font-sans"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Preço de Partida Sugerido</label>
                        <input
                          type="text"
                          value={p.price}
                          onChange={(e) => handlePlanChange(p.id, 'price', e.target.value)}
                          className="px-3 py-2.5 rounded-lg border border-white/10 bg-slate-900 text-sm font-sans font-semibold text-emerald-400"
                        />
                      </div>

                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Descrição Comercial Breve</label>
                      <input
                        type="text"
                        value={p.description}
                        onChange={(e) => handlePlanChange(p.id, 'description', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-slate-900 text-sm font-sans"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Itens e Entregas Inclusos:</span>
                        <button
                          type="button"
                          onClick={() => addPlanFeature(p.id)}
                          className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-mono hover:text-white cursor-pointer"
                        >
                          + Adicionar Linha
                        </button>
                      </div>

                      <div className="space-y-2">
                        {p.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => handlePlanFeatureChange(p.id, fIdx, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-white/5 bg-slate-900/60 text-xs text-slate-300 font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => removePlanFeature(p.id, fIdx)}
                              className="p-2 border border-white/10 rounded-lg text-red-400 hover:bg-white/5 bg-slate-950 transition cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA GALLERY FILE LIST */}
          {activeTab === 'gallery' && (
            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                <ImageIcon size={18} className="text-orange-500" />
                Sua Galeria Fotográfica
              </h2>

              {/* Add photolink form */}
              <form onSubmit={handleAddPhoto} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  required
                  placeholder="Cole aqui a URL de uma Imagem, YouTube ou Instagram Reels..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-slate-950 font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  Adicionar Foto Link
                </button>
              </form>

              {/* Display existing library */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {gallery.map((pImg, idx) => {
                  const media = parseMediaUrl(pImg);
                  return (
                    <div key={idx} className="relative aspect-[3/2] rounded-xl overflow-hidden group border border-white/5 bg-slate-900 flex items-center justify-center">
                      {media.type === 'youtube' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <img src={`https://img.youtube.com/vi/${media.embedUrl.split('embed/')[1]}/hqdefault.jpg`} className="w-full h-full object-cover filter brightness-75" />
                          <div className="absolute w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white" style={{ clipPath: 'polygon(35% 25%, 35% 75%, 75% 50%)' }}></div>
                        </div>
                      )}
                      {media.type === 'instagram' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 font-bold text-white tracking-widest uppercase">
                          Instagram
                        </div>
                      )}
                      {media.type === 'image' && (
                        <img 
                          src={media.url} 
                          alt={`Galeria Miniatura ${idx}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-650 hover:bg-red-700 border border-white/10 text-white transition active:scale-95 cursor-pointer z-10"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: TOUR DATES AGENDAMENTO */}
          {activeTab === 'events' && (
            <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                Gerenciar Agenda de Shows
              </h2>

              {/* Add custom gig booking */}
              <form onSubmit={handleAddEvent} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs">
                <span className="text-[10px] font-bold text-slate-450 uppercase font-mono tracking-wider block">Agendar Próxima Data Pública</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Nome Oficial do Evento/Festival</label>
                    <input
                      type="text"
                      placeholder="Ex: Rodeio de Jaguariúna"
                      value={newEvtTitle}
                      onChange={(e) => setNewEvtTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Casa de Show / Local do Recinto</label>
                    <input
                      type="text"
                      placeholder="Ex: Rancho Amigo Clube"
                      value={newEvtVenue}
                      onChange={(e) => setNewEvtVenue(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Data Oficial</label>
                    <input
                      type="date"
                      value={newEvtDate}
                      onChange={(e) => setNewEvtDate(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Horário Previsto</label>
                    <input
                      type="time"
                      value={newEvtTime}
                      onChange={(e) => setNewEvtTime(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Cidade - UF</label>
                    <input
                      type="text"
                      placeholder="Campinas - SP"
                      value={newEvtCity}
                      onChange={(e) => setNewEvtCity(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase">Status dos Ingressos</label>
                    <select
                      value={newEvtStatus}
                      onChange={(e) => setNewEvtStatus(e.target.value as ShowEvent['status'])}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 text-sm cursor-pointer"
                    >
                      <option value="confirmado">Confirmado</option>
                      <option value="esgotado">Esgotado</option>
                      <option value="convite">Privado / Convite</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  Inserir Data no Calendário
                </button>

              </form>

              {/* Show events list table for deleting or reading */}
              <div className="space-y-3 font-mono text-xs pt-4">
                <span className="font-bold text-[10px] text-slate-400 uppercase">Lista de Shows Registrados ({events.length}):</span>
                {events.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {events.map((evt, idx) => (
                      <div key={evt.id || idx} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-200">{evt.title} ({evt.city})</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Data: {evt.date.split('-').reverse().join('/')} | Horário: {evt.time}h | Local: {evt.venue}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(evt.id)}
                          className="p-1 px-2 border border-white/10 text-red-405 rounded-lg hover:bg-white/5 cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">Nenhum evento registrado. Preencha o formulário acima para agendar.</p>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: CLIENT TESTIMONIALS & FAQ SETTINGS */}
          {activeTab === 'testimonials' && (
            <div className="grid grid-cols-1 gap-8">
              
              {/* Testimonials module */}
              <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                  <Quote size={18} className="text-rose-500" />
                  Depoimentos de Clientes Anteriores
                </h2>

                <form onSubmit={handleAddTestimonial} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs font-medium">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Inserir Novo Depoimento Real</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label>Nome do Cliente / Casal</label>
                      <input
                        type="text"
                        placeholder="Ex: Isabella & Renato"
                        value={newTestName}
                        onChange={(e) => setNewTestName(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label>Formato de Casamento ou Evento</label>
                      <input
                        type="text"
                        placeholder="Ex: Noivos (Casamento em Fazenda)"
                        value={newTestRole}
                        onChange={(e) => setNewTestRole(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>Comentário da Avaliação</label>
                    <textarea
                      placeholder="Transcrição do feedback recebido..."
                      rows={3}
                      value={newTestContent}
                      onChange={(e) => setNewTestContent(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 resize-none text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <Plus size={13} />
                    Adicionar Depoimento
                  </button>

                </form>

                <div className="space-y-4 pt-2">
                  <span className="font-bold text-[10px] text-slate-400 uppercase font-mono">Depoimentos Publicados ({testimonials.length}):</span>
                  {testimonials.length > 0 ? (
                    <div className="space-y-3">
                      {testimonials.map((test, idx) => (
                        <div key={test.id || idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-1 mb-1.5">
                              {Array.from({ length: 5 }).map((_, st) => (
                                <Star key={st} size={11} className={st < test.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-705'} />
                              ))}
                            </div>
                            <p className="text-white text-xs italic">"{test.content}"</p>
                            <p className="text-[10px] text-slate-550 mt-1">{test.name} • <span className="font-normal">{test.role}</span></p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTestimonial(test.id)}
                            className="p-1 px-2 border border-white/10 text-red-400 rounded-lg lg:hover:bg-white/5 cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-505 text-xs">Nenhum depoimento personalizado configurado.</p>
                  )}
                </div>

              </div>

              {/* FAQ module */}
              <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-white/5 pb-2 font-sans flex items-center gap-2">
                  <HelpCircle size={18} className="text-sky-505" />
                  Suas Perguntas Frequentes (FAQ)
                </h2>

                <form onSubmit={handleAddFaq} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-xs font-medium">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Inserir Nova Pergunta</span>
                  
                  <div className="flex flex-col gap-1">
                    <label>Título da Pergunta de Dúvida</label>
                    <input
                      type="text"
                      placeholder="Ex: O cantor viaja para outros estados além do meu?"
                      value={newFaqQuest}
                      onChange={(e) => setNewFaqQuest(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label>Resposta Detalhada</label>
                    <textarea
                      placeholder="Informe de forma elegante sua resposta padrão aos contratantes..."
                      rows={3}
                      value={newFaqAns}
                      onChange={(e) => setNewFaqAns(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/5 resize-none text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-705 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition active:scale-95"
                  >
                    <Plus size={13} />
                    Adicionar Dúvida
                  </button>

                </form>

                <div className="space-y-4 pt-2">
                  <span className="font-bold text-[10px] text-slate-400 uppercase font-mono">Perguntas Registradas ({faqs.length}):</span>
                  {faqs.length > 0 ? (
                    <div className="space-y-3">
                      {faqs.map((f, idx) => (
                        <div key={f.id || idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-white text-xs font-bold">Q: {f.question}</p>
                            <p className="text-slate-400 text-xs mt-1">A: {f.answer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(f.id)}
                            className="p-1 px-2 border border-white/10 text-red-400 rounded-lg lg:hover:bg-white/5 cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs text-center p-3 border border-slate-800 border-dashed rounded-lg">Você está utilizando as perguntas frequentes (FAQ) originais de modelo. Adicione novas se quiser personalizá-as.</p>
                  )}
                </div>

              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}

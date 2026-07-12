import { motion } from 'motion/react';
import { ChevronDown, Calendar, Instagram, Star } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';
import { getFirstImage } from '../../utils/mediaParser';

interface HeroProps {
  singer: SingerProfile;
}

export default function Hero({ singer }: HeroProps) {
  const theme = getThemeClasses(singer.themeColor);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#09090b] text-white pt-16">
      {/* Dynamic Cinematic Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 filter blur-xs animate-pulse-slow"
        style={{ 
          backgroundImage: `url(${singer.coverUrl || getFirstImage(singer.gallery, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200&h=600')})` 
        }}
      />
      
      {/* Gradient Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-radial-gradient-to-r from-transparent to-[#09090b]/60 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center flex flex-col items-center">
        
        {/* Genre Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-sm font-medium tracking-wide mb-6"
        >
          <span className={`w-2 h-2 rounded-full ${theme.primaryBg} animate-ping`} />
          <span className="text-white/90 uppercase">{singer.genre}</span>
        </motion.div>

        {/* Singer Avatar Photo */}
        {singer.avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-4 ${singer.themeColor === 'amber' ? 'border-amber-500' : singer.themeColor === 'rose' ? 'border-rose-500' : singer.themeColor === 'crimson' ? 'border-red-500' : 'border-indigo-500'} shadow-2xl overflow-hidden mb-6`}
          >
            <img 
              src={singer.avatarUrl} 
              alt={singer.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Title & Slogan */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4"
        >
          {singer.name}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-zinc-350 max-w-2xl font-light mb-8 leading-relaxed"
        >
          {singer.slogan}
        </motion.p>

        {/* Action CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center mb-10"
        >
          <a
            href="#plans"
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold shadow-lg shadow-black/40 text-black ${theme.primaryBg} ${theme.primaryHoverBg} transition duration-300 transform hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2`}
          >
            <Star size={18} fill="currentColor" />
            Ver Planos & Pacotes
          </a>
          <a
            href="#budget"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-zinc-800 transition duration-300 hover:scale-[1.02] active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Solicitar Orçamento
          </a>
        </motion.div>

        {/* Quick Social / Stats Row */}
        {singer.instagram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center gap-6 text-zinc-400 text-sm"
          >
            <a 
              href={`https://instagram.com/${singer.instagram}`} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <Instagram size={16} />
              @{singer.instagram}
            </a>
          </motion.div>
        )}
      </div>

      {/* Floating Indicators */}
      <div className="absolute bottom-6 left-12 right-12 hidden md:flex items-center justify-between z-10 text-xs text-zinc-500 font-mono">
        <div>CONTATO: {singer.email}</div>
        <div className="flex flex-col items-center animate-bounce">
          <span className="mb-1">Rolar para explorar</span>
          <ChevronDown size={14} />
        </div>
        <div>VITRINE COMERCIAL PREMIUM</div>
      </div>
    </section>
  );
}

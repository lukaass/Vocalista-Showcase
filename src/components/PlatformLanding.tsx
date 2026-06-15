import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Shield, Compass, Sliders, Calendar, ArrowRight, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { SingerProfile } from '../types';
import { getDatabase } from '../services/db';
import { getFirstImage } from '../utils/mediaParser';

interface PlatformLandingProps {
  onSelectSinger: (username: string) => void;
  onGoToAdmin: () => void;
}

export default function PlatformLanding({ onSelectSinger, onGoToAdmin }: PlatformLandingProps) {
  const [singers] = useState<SingerProfile[]>(() => getDatabase());

  return (
    <div className="bg-[#09090b] min-h-screen text-zinc-100 selection:bg-zinc-800">
      
      {/* Header element */}
      <nav className="border-b border-zinc-850 py-4 px-4 md:px-8 bg-[#09090b]/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-650/40">
              V
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight text-white font-sans">
              Vocalis <span className="text-xs text-amber-500 font-normal">Showcase</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button 
              onClick={onGoToAdmin}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-305 font-semibold transition active:scale-95 cursor-pointer border border-zinc-800"
            >
              Área Administrativa ⚙
            </button>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="relative py-20 md:py-32 overflow-hidden flex items-center justify-center text-center">
        {/* Cinematic Backdrop blurs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-900/5 rounded-full filter blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-zinc-800/10 rounded-full filter blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-805 bg-zinc-900/50 text-xs font-mono text-amber-500 mb-6">
            <Sparkles size={12} className="animate-pulse" />
            CONTRATAÇÃO DE SHOWS SEM INTERMEDIÁRIOS
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
            A Vitrine Comercial <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-550">
              Dos Melhores Cantores
            </span>
          </h1>

          <p className="text-zinc-400 text-base md:text-xl font-light max-w-2xl mx-auto mt-6 leading-relaxed">
            Esquça as negociações confusas por agenciadores ou taxas extras de 35% nas contratações. Navegue pelas vitrines dos nossos artistas credenciados, confira os pacotes predefinidos e reserve sua data diretamente via WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#catalogo"
              className="px-8 py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-950/40 transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Conhecer Nossos Cantores
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Featured singers catalogs */}
      <section id="catalogo" className="py-20 border-t border-zinc-850 bg-[#09090b]/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500 font-mono">Portfólio de Talentos</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1 font-sans">Cantores Credenciados</h2>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm font-light">
              Escolha seu estilo favorito para abrir a vitrine comercial do artista, ver depoimentos reais e solicitar agenda.
            </p>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {singers.map((singer, index) => {
              // Custom map details
              return (
                <motion.div
                  key={singer.username || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-3xl glass shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image placeholder background */}
                    <div className="relative aspect-[16/10] bg-[#09090b] overflow-hidden">
                      <img 
                        src={getFirstImage(singer.gallery, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600&h=400')} 
                        alt={singer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-95"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Avatar float */}
                      <div className="absolute -bottom-6 left-6 rounded-full overflow-hidden border-2 border-zinc-900 w-16 h-16 bg-zinc-950">
                        <img 
                          src={singer.avatarUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300&h=300'} 
                          alt={`Avatar ${singer.name}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Genre Tag Badge on top-right */}
                      <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest font-bold uppercase py-1 px-2.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-amber-500 border border-zinc-800">
                        {singer.genre}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-10">
                      <h3 className="font-bold text-xl text-white font-sans">{singer.name}</h3>
                      <p className="text-zinc-400 text-xs min-h-[36px] line-clamp-2 mt-2 leading-relaxed font-light">
                        {singer.slogan}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono border-t border-zinc-850 pt-4 mt-4">
                        <span>PLANOS A PARTIR:</span>
                        <span className="font-bold text-emerald-500">{singer.plans[0]?.price || 'R$ 2.000'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onSelectSinger(singer.username)}
                      className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-amber-600 text-zinc-300 hover:text-white font-semibold text-xs transition duration-250 cursor-pointer flex items-center justify-center gap-1 border border-zinc-800/80 hover:border-transparent"
                    >
                      Ver Vitrine Comercial
                      <ArrowRight size={13} />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Selling Advantage points */}
      <section className="py-24 bg-[#09090b] text-zinc-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">Eficiência Total</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1 font-sans">Como a Vocalis Revoluciona a Contratação</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Compass size={22} />
              </div>
              <h3 className="font-bold text-lg text-white">Transparência Extrema</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Cada cantor mantém planos comerciais fechados e previsíveis com o que está incluso no show. Você não precisa enviar emails pedindo orçamentos intermináveis.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sliders size={22} />
              </div>
              <h3 className="font-bold text-lg text-white">Fale Direto Pelo WhatsApp</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Para evitar burocracias, ao escolher um plano, o formulário de orçamento é pré-preenchido e encaminhado instantaneamente para o WhatsApp da produção do cantor com todos os dados logísticos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-lg text-white">Vitrines Personalizadas</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Cada cantor conta com uma página exclusiva e customizada, onde gerencia suas fotos, repertório, agenda de shows e pacotes de contratação com total independência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Landing footer */}
      <footer className="border-t border-zinc-850 bg-[#09090b] py-12 text-center text-xs text-zinc-500 leading-relaxed font-mono">
        <p>Vocalis Platform Hub © {new Date().getFullYear()} • Soluções de Vitrine de Shows para Músicos de Sucesso.</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <button onClick={onGoToAdmin} className="hover:text-white underline">Ativar / Gerenciar Artistas ⚙</button>
        </div>
      </footer>

    </div>
  );
}

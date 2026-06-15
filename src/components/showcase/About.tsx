import { motion } from 'motion/react';
import { Award, Music, CheckCircle, ShieldCheck } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';
import { getNthImage } from '../../utils/mediaParser';

interface AboutProps {
  singer: SingerProfile;
}

export default function About({ singer }: AboutProps) {
  const theme = getThemeClasses(singer.themeColor);

  return (
    <section id="about" className="py-24 bg-[#09090b] text-zinc-100 overflow-hidden relative border-t border-zinc-850">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-900/5 rounded-full filter blur-3xl opacity-30 -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Image & Spotlight column */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] bg-zinc-950 border border-zinc-800"
            >
              <img 
                src={singer.bioPhotoUrl || getNthImage(singer.gallery, 1, singer.avatarUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600&h=800')} 
                alt={`Apresentação ao vivo de ${singer.name}`}
                className="w-full h-full object-cover filter brightness-95 contrast-105 hover:scale-105 transition duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Overlay styling */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Experiência Badge */}
              <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-zinc-900/60 border border-zinc-800 text-white`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme.primaryBg} text-black`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Garantia Comercial</h4>
                    <p className="text-xs text-white/85">Contrato digital e nota fiscal oficial inclusos.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text and Bio details column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
                Sua Biografia & Proposta
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 font-sans">
                A Alma Musical do Seu Evento
              </h2>
              
              <div className={`h-1.5 w-20 ${theme.primaryBg} mb-8 rounded-full`} />
              
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8 whitespace-pre-line">
                {singer.bio}
              </p>
            </motion.div>

            {/* Quick Selling Points Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-3.5">
                <div className={`mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${theme.primaryText}`}>
                  <Music size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Repertório Inteligente</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Músicas selecionadas a dedo e adaptadas de acordo com as preferências dos noivos, convidados ou marca patrocinadora.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className={`mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${theme.primaryText}`}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Ruptura com Intermediários</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Ao contratar diretamente pela vitrine comercial, evitam-se taxas abusivas de agências, reduzindo custos em até 35%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className={`mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${theme.primaryText}`}>
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Sonorização Inclusa</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Equipamentos próprios de última geração fornecendo qualidade acústica e discrição estética para o visual da festa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className={`mt-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${theme.primaryText}`}>
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Rider Rigoroso</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Sincronização impecável, cronograma cumprido à risca e suporte comercial do início ao último acorde.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

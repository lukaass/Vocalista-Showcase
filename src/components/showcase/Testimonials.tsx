import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface TestimonialsProps {
  singer: SingerProfile;
}

export default function Testimonials({ singer }: TestimonialsProps) {
  const theme = getThemeClasses(singer.themeColor);

  return (
    <section id="testimonials" className="py-24 bg-[#09090b] text-white relative overflow-hidden border-t border-zinc-850">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-zinc-900/30 rounded-full filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-zinc-900/20 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
            Reconhecimento
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Quem Já Contratou Aprova
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base font-light">
            Depoimentos reais de casais de noivos, promotores de eventos corporativos e diretores de marcas sobre o impacto do show.
          </p>
        </div>

        {/* Testimonials Grid Layout */}
        {singer.testimonials && singer.testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {singer.testimonials.map((test, idx) => (
              <motion.div
                key={test.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative glass p-8 rounded-3xl flex flex-col justify-between hover:bg-zinc-900/40 transition duration-300"
              >
                {/* Quote Icon Overlay */}
                <div className="absolute top-6 right-8 text-white/5 pointer-events-none">
                  <Quote size={56} strokeWidth={1} />
                </div>

                {/* Content text */}
                <div className="relative">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star 
                        key={sIdx} 
                        size={14} 
                        className={sIdx < test.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'} 
                      />
                    ))}
                  </div>

                  <p className="text-zinc-250 text-sm md:text-base leading-relaxed italic font-light mb-6">
                    "{test.content}"
                  </p>
                </div>

                {/* Client Info */}
                <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black uppercase ${theme.primaryBg}`}>
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{test.name}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{test.role}</p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 glass rounded-3xl text-zinc-400">
            <Quote size={32} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-sm">Os depoimentos de eventos anteriores serão exibidos em breve.</p>
          </div>
        )}

      </div>
    </section>
  );
}

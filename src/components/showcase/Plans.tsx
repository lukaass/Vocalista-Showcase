import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';
import { SingerProfile, Plan } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface PlansProps {
  singer: SingerProfile;
  onSelectPlan: (planName: string) => void;
}

export default function Plans({ singer, onSelectPlan }: PlansProps) {
  const theme = getThemeClasses(singer.themeColor);

  return (
    <section id="plans" className="py-24 bg-[#09090b] text-zinc-100 border-y border-zinc-850">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
            Formatos & Tabela Comercial
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
            Planos Comerciais de Shows
          </h2>
          <div className={`h-1 w-16 ${theme.primaryBg} mx-auto rounded-full mb-4`} />
          <p className="text-zinc-405 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed">
            Selecione o plano mais alinhado ao porte e perfil do seu evento. Oferecemos orçamentos previsíveis sem taxas ocultas.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {singer.plans.map((plan, index) => {
            const isRec = plan.recommended;
            return (
              <motion.div
                key={plan.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`plan-card glass relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 hover:scale-[1.01] overflow-hidden ${
                  isRec 
                    ? `border-2 border-amber-600/40 bg-amber-600/5 md:-translate-y-4 shadow-xl shadow-amber-950/10` 
                    : 'border-zinc-800'
                }`}
              >
                {/* Popular recommended badge ribbon */}
                {isRec && (
                  <div className={`absolute top-0 right-0 ${theme.primaryBg} text-black font-semibold uppercase text-[10px] tracking-wider px-4 py-1.5 rounded-bl-xl flex items-center gap-1`}>
                    <Star size={10} fill="currentColor" />
                    Mais Vendido
                  </div>
                )}

                {/* Card Top Information */}
                <div>
                  <h3 className="text-xl font-bold text-white font-sans mb-1">{plan.name}</h3>
                  <p className="text-zinc-400 text-xs min-h-[36px] line-clamp-2 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 border-b border-zinc-850 pb-6">
                    <span className="text-3.5xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-xs font-mono font-medium ml-1">/ show base</span>
                  </div>

                  {/* Feature checklist */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm">
                        <div className={`mt-0.5 rounded-full p-0.5 text-black ${theme.primaryBg}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-zinc-300 leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button Actions */}
                <a
                  href="#budget"
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-center transition duration-200 block text-sm cursor-pointer ${
                    isRec
                      ? `${theme.primaryBg} hover:opacity-90 text-black shadow-md`
                      : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {isRec ? 'Contratar Este Plano ★' : 'Selecionar Pacote'}
                </a>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface FAQProps {
  singer: SingerProfile;
}

export default function FAQ({ singer }: FAQProps) {
  const theme = getThemeClasses(singer.themeColor);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const localFaqs = singer.faqs && singer.faqs.length > 0 ? singer.faqs : [
    {
      id: 'df-1',
      question: 'O que acontece em caso de cancelamento do show por parte do contratante?',
      answer: 'O sinal pago no ato do agendamento (30%) serve para bloquear as datas exclusivas e cobrir perdas e danos de oportunidade. No entanto, se o cancelamento for solicitado com mais de 30 dias de antecedência, facilitamos o reagendamento gratuito da data para outro dia em até 6 meses mediante disponibilidade.'
    },
    {
      id: 'df-2',
      question: 'A equipe fornece toda a aparelhagem técnica necessária?',
      answer: 'Sim, a sonorização básica está inclusa para nossos formatos menores. Para palcos abertos maiores ou plateias acima de 300 pessoas, nós disponibilizamos o nosso Rider Técnico no momento do contrato para que a equipe de sonorização do seu evento monte adequadamente.'
    },
    {
      id: 'df-3',
      question: 'Com quanta antecedência devo fechar meu contrato?',
      answer: 'Recomendamos garantir a reserva de datas com pelo menos de 3 a 6 meses de antecedência, especialmente se o evento estiver programado para finais de semana de alta temporada (meses de Maio, Setembro, Outubro e Dezembro).'
    }
  ];

  return (
    <section className="py-24 bg-[#09090b] border-b border-zinc-900">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 font-sans">
            Perguntas & Respostas
          </h2>
          <div className={`h-1 w-12 ${theme.primaryBg} mx-auto rounded-full mb-4`} />
          <p className="text-zinc-400 max-w-sm mx-auto text-sm font-light">
            Respondemos de forma direta e transparente as principais perguntas enviadas por nossos contratantes.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {localFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.id || idx}
                className="overflow-hidden bg-zinc-900/30 border border-zinc-800 rounded-2xl shadow-sm transition"
              >
                {/* Accordion Toggle Header Button */}
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-zinc-100 hover:text-white transition gap-4 select-none cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-sm md:text-base leading-snug">
                    <HelpCircle size={18} className={`shrink-0 ${theme.primaryText}`} />
                    {faq.question}
                  </span>
                  <div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-zinc-500 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-zinc-500 shrink-0" />
                    )}
                  </div>
                </button>

                {/* Collapsible Answer Pane */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-5 pt-0 border-t border-zinc-850/60 text-zinc-400 text-sm leading-relaxed font-light mt-2 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

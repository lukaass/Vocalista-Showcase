import { motion } from 'motion/react';
import { Check, Minus, HelpCircle } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface PlanComparisonProps {
  singer: SingerProfile;
}

export default function PlanComparison({ singer }: PlanComparisonProps) {
  const theme = getThemeClasses(singer.themeColor);

  // Common criteria compared across all setups
  const comparisonItems = [
    {
      title: 'Voz Principal e Microfones',
      desc: 'Presença garantida do cantor com microfonia de estúdio sem fio.',
      p1: 'Incluso',
      p2: 'Incluso',
      p3: 'Incluso',
    },
    {
      title: 'Estrutura de Sonorização',
      desc: 'Adequação do sistema de áudio ao volume e quantidade de convidados.',
      p1: 'Compacto (Até 100 pes.)',
      p2: 'Médio Porte (Até 250 pes.)',
      p3: 'Grande Porte (Até 500+ pes.)',
    },
    {
      title: 'Rapport e Interação',
      desc: 'Contato carismático direto com o público e brincadeiras.',
      p1: 'Moderado',
      p2: 'Alto',
      p3: 'Show Completo Interativo',
    },
    {
      title: 'Duração Máxima',
      desc: 'Tempo total contratado em minutos em cima do palco.',
      p1: '2 Horas (120 min)',
      p2: '3 Horas (180 min)',
      p3: '4 Horas (240 min)',
    },
    {
      title: 'Repertório Adicional Exclusivo',
      desc: 'Músicas ensaiadas sob encomenda especial de fora do repertório padrão.',
      p1: 'Até 3 Músicas',
      p2: 'Até 5 Músicas',
      p3: 'Até 8 Músicas',
    },
    {
      title: 'Iluminação de Pista / Cênica',
      desc: 'Monitores de luz de LED e refletores inteligentes voltados para a pista.',
      p1: <Minus size={16} className="text-zinc-600 mx-auto" />,
      p2: 'Básica (Refletores LED)',
      p3: 'Roborizada Completa + Efeitos',
    },
    {
      title: 'Contrato Digital & NF-e',
      desc: 'Garantia jurídica e contabilidade assegurada para corporativos.',
      p1: <Check size={16} className={`mx-auto ${theme.primaryText}`} />,
      p2: <Check size={16} className={`mx-auto ${theme.primaryText}`} />,
      p3: <Check size={16} className={`mx-auto ${theme.primaryText}`} />,
    }
  ];

  const planNames = singer.plans.map(p => p.name);

  return (
    <section className="py-20 bg-[#09090b] border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Title */}
        <div className="text-center mb-14">
          <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-3">
            Comparativo Técnico e Detalhado
          </h3>
          <p className="text-zinc-400 text-sm md:text-base font-light max-w-lg mx-auto">
            Analise lado a lado os detalhes técnicos de cada opção comercial para fazer sua escolha ideal.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 shadow-xl bg-zinc-950/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 text-sm font-semibold font-sans">
                <th className="p-5 w-1/3">Critérios de Comparação</th>
                <th className="p-5 text-center">{planNames[0] || 'Plano 1'}</th>
                <th className="p-5 text-center relative border-x border-zinc-800 bg-zinc-900/50">
                  <span className={`absolute -top-3 left-1/2 transform -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.primaryBg} text-black font-sans shadow-md`}>
                    Destaque
                  </span>
                  {planNames[1] || 'Plano 2'}
                </th>
                <th className="p-5 text-center">{planNames[2] || 'Plano 3'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-sm text-zinc-300">
              {comparisonItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30 transition">
                  <td className="p-5">
                    <div className="font-semibold text-white flex items-center gap-1.5 group cursor-help">
                      {item.title}
                      <HelpCircle size={13} className="text-zinc-500 opacity-60 group-hover:opacity-100 transition" />
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 leading-normal font-light">
                      {item.desc}
                    </div>
                  </td>
                  <td className="p-5 text-center font-medium text-zinc-300">
                    {item.p1}
                  </td>
                  <td className="p-5 text-center bg-zinc-900/10 border-x border-zinc-900 font-semibold text-white">
                    {item.p2}
                  </td>
                  <td className="p-5 text-center font-medium text-zinc-300">
                    {item.p3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Small Note */}
        <div className="mt-6 flex items-start gap-2 text-zinc-500 text-xs font-light px-2">
          <span>*</span>
          <p>
            Alinhamentos técnicos adicionais fora da grade acima podem ser solicitados no campo observações do formulário abaixo. Nosso produtor executivo avaliará e retornará a viabilidade.
          </p>
        </div>

      </div>
    </section>
  );
}

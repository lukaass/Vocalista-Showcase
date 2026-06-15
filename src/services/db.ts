import { SingerProfile, AdminCredentials } from '../types';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth, initializeFirebaseConnection } from './firebase';

const STORAGE_KEY = 'vocalis_showcase_db_v3';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DEFAULT_SINGERS: SingerProfile[] = [
  {
    username: 'arthurvalente',
    password: '123',
    name: 'Arthur Valente',
    slogan: 'O melhor do Sertanejo Universitário & Pop Acústico para o seu evento',
    bio: 'Nascido no interior de São Paulo, Arthur Valente traz na bagagem mais de 10 anos de estrada, unindo o melhor da música sertaneja com toques contemporâneos de pop acústico. Com apresentações marcadas por carisma irresistível e excelente presença de palco, ele se tornou uma escolha disputada para casamentos premium, formaturas de destaque e eventos corporativos de alto padrão.',
    phone: '5511999998888',
    email: 'contato@arthurvalente.com.br',
    genre: 'Sertanejo & Pop Acústico',
    themeColor: 'amber',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300&h=300',
    instagram: 'arthurvalente.music',
    youtube: 'arthurvalenteoficial',
    spotify: 'arthurvalente',
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
        id: 'plan-1',
        name: 'Voz e Violão Intimista',
        price: 'R$ 2.500',
        description: 'Ideal para cerimônias de casamento emocionantes, coquetéis de recepção de requinte ou jantares de aniversário discretos.',
        features: [
          'Apresentação solo (Arthur no violão e voz)',
          'Duração: 2 horas de show (2 blocos de 1h)',
          'Repertório personalizado com até 3 pedidos especiais',
          'Rider Técnico e Sonorização própria inclusos para até 100 pessoas',
          'Disponível para qualquer cidade no estado'
        ]
      },
      {
        id: 'plan-2',
        name: 'Banda Pocket (Sucesso de Eventos)',
        price: 'R$ 5.900',
        description: 'Perfeito para mini-weddings, festas corporativas de médio porte e aniversários animados que querem pista de dança.',
        recommended: true,
        features: [
          'Trio dinâmico: Arthur (Vocal/Violão) + Sanfona (or Teclado) + Percussão',
          'Duração: 3 horas de performance intensa',
          'Até 5 músicas fora do repertório básico para escolher',
          'Sonorização e Iluminação cenográfica básica inclusas para até 250 convidados',
          'Atendimento pré-evento personalizado via videochamada'
        ]
      },
      {
        id: 'plan-3',
        name: 'Banda Completa Premium',
        price: 'R$ 10.500',
        description: 'Show de impacto máximo. Ideal para casamentos luxuosos, formaturas acadêmicas e feiras agropecuárias.',
        features: [
          'Full band: Arthur + Guitarra + Baixo + Bateria + Acordeon/Teclado',
          'Duração: 4 horas de show contagiante com alta energia',
          'Escolha do cronograma musical e até 8 pedidos exclusivos',
          'Sonorização profissional de grande porte e Iluminação de LED robotizada',
          'Painel de fotos decorativo iluminado e efeitos especiais de faíscas frias'
        ]
      }
    ],
    events: [
      {
        id: 'e-1',
        title: 'Baile de Inverno',
        date: '2026-07-15',
        time: '21:00',
        venue: 'Clube Hipica',
        city: 'Campinas - SP',
        status: 'confirmado'
      },
      {
        id: 'e-2',
        title: 'Show Sertanejo Premium',
        date: '2026-07-28',
        time: '23:30',
        venue: 'Cachaçaria do Ranho',
        city: 'São Paulo - SP',
        status: 'esgotado'
      },
      {
        id: 'e-3',
        title: 'Festa do Peão Gigante',
        date: '2026-08-10',
        time: '22:00',
        venue: 'Parque de Exposições',
        city: 'Barretos - SP',
        status: 'convite'
      }
    ],
    testimonials: [
      {
        id: 't-1',
        name: 'Juliana & Thiago',
        role: 'Noivos (Casamento em Fazenda)',
        content: 'O Arthur deitou no nosso casamento! Ele gravou uma versão especial para a nossa entrada e colocou todo mundo para dançar na recepção. Todos os convidados comentaram o quão profissional e talentoso ele é!',
        rating: 5
      },
      {
        id: 't-2',
        name: 'Roberto Camargo',
        role: 'Diretor de Gente & Gestão - Grupo Arcos',
        content: 'Mais do que uma contratação do show, foi uma verdadeira experiência comercial. Fechamos o plano Banda Pocket e atendeu perfeitamente. A flexibilidade do repertório animou nossa equipe inteira. Altamente recomendado.',
        rating: 5
      }
    ],
    faqs: [
      {
        id: 'f-1',
        question: 'Está inclusa a estrutura de som e luz na contratação?',
        answer: 'Sim! Nos planos "Voz e Violão" e "Banda Pocket" incluímos sonorização completa de excelente nível para até 100 e 250 pessoas, respectivamente. No plano "Banda Completa Premium" levamos som de alto impacto e iluminação de LED sofisticada.'
      },
      {
        id: 'f-2',
        question: 'O artista realiza viagens para outros estados além de São Paulo?',
        answer: 'Com certeza. Atendemos todo o território nacional. No entanto, custos adicionais como hospedagem compatível e passagens/combustível fora do raio de 100 km do escritório serão negociados de forma transparente no fechamento do contrato.'
      },
      {
        id: 'f-3',
        question: 'Como funciona a forma de pagamento do show?',
        answer: 'Para bloquear de vez a data em nossa agenda de shows, solicitamos um sinal de 30% em Pix/Transferência na assinatura digital do contrato de prestação de serviços. O saldo restante de 70% deve ser quitado até 48 horas antes da subida ao palco.'
      }
    ]
  },
  {
    username: 'claramel',
    password: '123',
    name: 'Clara Mel',
    slogan: 'Voz suave e arranjos requintados de Bossa Nova, Jazz e Pop internacional',
    bio: 'Clara Mel é cantora e pianista graduada em Música Popular. Com um timbre doce que remete às divas do jazz tradicional e às maiores vozes da Bossa Nova brasileira, Clara oferece um toque intimista e luxuoso à trilha sonora de casamentos exclusivos, lançamentos imobiliários, desfiles de marcas famosas e festas sociais refinadas.',
    phone: '5521988887777',
    email: 'clara@claramelmusic.com',
    genre: 'Bossa, Jazz & Elegant Pop',
    themeColor: 'rose',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    instagram: 'claramel_oficial',
    youtube: 'claramelmusic',
    spotify: 'clara_mel_chill',
    offersInvoice: true,
    offersContract: true,
    travelEnabled: true,
    travelBaseRadius: 30,
    travelStepKm: 30,
    travelIncrementPercent: 8,
    travelOrigin: 'Rio de Janeiro - RJ',
    gallery: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800&h=530',
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800&h=530',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800&h=530',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=800&h=530'
    ],
    plans: [
      {
        id: 'plan-1',
        name: 'Vocal & Piano Solo',
        price: 'R$ 3.000',
        description: 'Sofisticação pura para coquetéis, galerias de arte, jantares românticos de alta gastronomia e casamentos civis.',
        features: [
          'Clara Mel ao piano (teclado profissional) e voz',
          'Duração: 2 horas de som ambiente de alta classe',
          'Repertório focado em Jazz Standards, Bossa Nova clássica e MPB sofisticada',
          'Equipamento de som de estúdio incluso para ambientes fechados (até 80 pessoas)',
          'Possibilidade de alinhar terno/vestido para se harmonizar com a paleta do evento'
        ]
      },
      {
        id: 'plan-2',
        name: 'Acústico Bossa & Jazz Trio',
        price: 'R$ 6.500',
        description: 'O equilíbrio perfeito entre sofisticação e swing. Excelente para recepções de casamentos, lounge bar e festas corporativas.',
        recommended: true,
        features: [
          'Trio elegante: Clara Mel (Vocal/Teclado) + Contrabaixo Acústico + Bateria com escovinhas',
          'Duração: 3 horas divididas em blocos adaptáveis',
          'Adaptação de clássicos do Cold Rain, Coldplay, Adele em formato Lounge Jazz',
          'Sonorização refinada e caixas de som verticais discretas inclusas (até 200 convidados)',
          'Cronograma de músicas sob demanda'
        ]
      },
      {
        id: 'plan-3',
        name: 'Grande Orquestra Clara Mel',
        price: 'R$ 13.000',
        description: 'Experiência única para festas luxuosas e casamentos icônicos onde a música é atração principal.',
        features: [
          'Show completo de gala: Clara + 4 instrumentistas (Guitarra, Baixo, Bateria, Saxofone/Flauta) + 2 Vocais de apoio',
          'Duração: 4 horas de performance memorável',
          'Repertório do Pop Vintage de tirar o fôlego a clássicos da MPB dançante',
          'Sistema completo de distribuição de som de altíssima fidelidade acústica',
          'Acompanhamento e assessoria artística exclusiva por e-mail desde a contratação'
        ]
      }
    ],
    events: [
      {
        id: 'e-1',
        title: 'Festival Bossa In Rio',
        date: '2026-06-25',
        time: '19:00',
        venue: 'Teatro da Praia',
        city: 'Rio de Janeiro - RJ',
        status: 'confirmado'
      },
      {
        id: 'e-2',
        title: 'Tarde Premium de Jazz',
        date: '2026-07-12',
        time: '16:00',
        venue: 'Copacabana Palace Roof',
        city: 'Rio de Janeiro - RJ',
        status: 'esgotado'
      }
    ],
    testimonials: [
      {
        id: 't-1',
        name: 'Beatriz Vasconcellos',
        role: 'Noiva (Casamento Cerimonial Copacabana)',
        content: 'Ter a Clara Mel tocando e cantando em meu mini wedding foi excelente. As pessoas choraram com a voz dela. A entrega é absurdamente superior a uma banda comum, super sofisticada.',
        rating: 5
      },
      {
        id: 't-2',
        name: 'Eduardo M.',
        role: 'Gerente Geral do Hotel Windsor',
        content: 'Contratamos o pacote Trio Bossa & Jazz para uma série de jantares executivos estratégicos. Atendimento excelente, pontuais ao extremo e performance digna de aplausos de pé.',
        rating: 5
      }
    ],
    faqs: [
      {
        id: 'f-1',
        question: 'E se o local do show já tiver piano ou sonorização própria?',
        answer: 'Ficamos muito felizes em analisar a ficha técnica da estrutura do local do evento. Se os aparelhos forem compatíveis com o nosso Rider de Alta Fidelidade (especialmente para o piano acústico de cauda), podemos deduzir até 10% do valor do plano contratado devido ao envio simplificado.'
      },
      {
        id: 'f-2',
        question: 'Quais estilos musicais de repertório estão garantidos?',
        answer: 'Trabalhamos com MPB refinada, Samba, Bossa Nova nostálgica, Jazz Tradicional (Ella Fitzgerald, Frank Sinatra), Pop Acoustic e releituras sofisticadas de músicas de rádio, as quais transformamos em versões acolhedoras e elegantes.'
      }
    ]
  }
];

export async function syncFromFirestore(): Promise<SingerProfile[]> {
  await initializeFirebaseConnection();
  try {
    const listPath = 'singers';
    const querySnapshot = await getDocs(collection(db, listPath));
    const list: SingerProfile[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as SingerProfile);
    });

    if (list.length === 0) {
      console.log("Firestore collection is empty. Pre-seeding default singers into Firestore...");
      for (const singer of DEFAULT_SINGERS) {
        const docPath = `singers/${singer.username.toLowerCase()}`;
        try {
          await setDoc(doc(db, 'singers', singer.username.toLowerCase()), singer);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, docPath);
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SINGERS));
      return DEFAULT_SINGERS;
    } else {
      console.log(`Synced ${list.length} singers from Firestore.`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return list;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'singers');
    return getDatabase();
  }
}

export function getDatabase(): SingerProfile[] {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as SingerProfile[];
    } catch (e) {
      console.error('Error parsing local storage DB, resetting to defaults.', e);
    }
  }
  // Fallback to static defaults
  return DEFAULT_SINGERS;
}

export function saveDatabase(data: SingerProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSinger(username: string): SingerProfile | undefined {
  const dbList = getDatabase();
  return dbList.find(s => s.username.toLowerCase() === username.toLowerCase());
}

export async function updateSinger(profile: SingerProfile): Promise<boolean> {
  const dbList = getDatabase();
  const index = dbList.findIndex(s => s.username.toLowerCase() === profile.username.toLowerCase());
  if (index !== -1) {
    dbList[index] = profile;
    saveDatabase(dbList);

    // Sync to Firestore
    const docPath = `singers/${profile.username.toLowerCase()}`;
    try {
      await setDoc(doc(db, 'singers', profile.username.toLowerCase()), profile);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, docPath);
    }
  }
  return false;
}

export async function addSinger(profile: SingerProfile): Promise<boolean> {
  const dbList = getDatabase();
  // Check duplicate
  if (dbList.some(s => s.username.toLowerCase() === profile.username.toLowerCase())) {
    return false;
  }
  dbList.push(profile);
  saveDatabase(dbList);

  // Sync to Firestore
  const docPath = `singers/${profile.username.toLowerCase()}`;
  try {
    await setDoc(doc(db, 'singers', profile.username.toLowerCase()), profile);
    return true;
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, docPath);
  }
  return false;
}

export async function importSinger(profile: SingerProfile): Promise<void> {
  const dbList = getDatabase();
  const index = dbList.findIndex(s => s.username.toLowerCase() === profile.username.toLowerCase());
  if (index !== -1) {
    dbList[index] = profile;
  } else {
    dbList.push(profile);
  }
  saveDatabase(dbList);

  // Sync to Firestore
  const docPath = `singers/${profile.username.toLowerCase()}`;
  try {
    await setDoc(doc(db, 'singers', profile.username.toLowerCase()), profile);
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, docPath);
  }
}

export async function deleteSinger(username: string): Promise<void> {
  const dbList = getDatabase();
  const filtered = dbList.filter(s => s.username.toLowerCase() !== username.toLowerCase());
  saveDatabase(filtered);

  // Sync to Firestore
  const docPath = `singers/${username.toLowerCase()}`;
  try {
    await deleteDoc(doc(db, 'singers', username.toLowerCase()));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, docPath);
  }
}

const ADMIN_STORAGE_KEY = 'vocalis_admin_credentials_v3';

const DEFAULT_ADMIN: AdminCredentials = {
  username: 'admin',
  email: 'admin@vocalis.com.br',
  password: '123'
};

export function getAdminCredentials(): AdminCredentials {
  const cached = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as AdminCredentials;
    } catch (e) {
      console.error('Error parsing admin credentials from localStorage', e);
    }
  }
  return DEFAULT_ADMIN;
}

export function saveAdminCredentialsLocally(creds: AdminCredentials) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(creds));
}

export async function syncAdminCredentials(): Promise<AdminCredentials> {
  await initializeFirebaseConnection();
  try {
    const docRef = doc(db, 'admin_config', 'credentials');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as AdminCredentials;
      saveAdminCredentialsLocally(data);
      return data;
    } else {
      // Seed default in Firestore
      const defaultCreds = getAdminCredentials();
      await setDoc(docRef, defaultCreds);
      return defaultCreds;
    }
  } catch (error) {
    console.warn("Failed to sync admin credentials from Firestore, falling back to local storage.", error);
    return getAdminCredentials();
  }
}

export async function updateAdminCredentials(creds: AdminCredentials): Promise<boolean> {
  saveAdminCredentialsLocally(creds);
  try {
    const docRef = doc(db, 'admin_config', 'credentials');
    await setDoc(docRef, creds);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'admin_config/credentials');
    return false;
  }
}


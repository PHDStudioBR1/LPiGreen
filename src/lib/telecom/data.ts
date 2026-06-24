export type TelecomPlan = {
  id: string;
  name: string;
  data: string;
  dataDetail: string;
  price: number;
  priceWithoutPortability: number;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
  badge?: string;
};

export type TelecomBenefit = {
  id: string;
  number: string;
  title: string;
  description: string;
  icon:
    | "layers"
    | "unlock"
    | "message-circle"
    | "gift"
    | "wifi"
    | "wallet"
    | "users"
    | "smartphone"
    | "globe"
    | "plane"
    | "headphones"
    | "smartphone-charging";
};

export type TelecomComparisonRow = {
  characteristic: string;
  igreen: string;
  traditional: string;
};

export type TelecomStep = {
  id: string;
  step: number;
  title: string;
  description: string;
};

export type TelecomTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type TelecomFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const TELECOM_BENEFITS: TelecomBenefit[] = [
  {
    id: "accumulative",
    number: "01",
    title: "Internet Acumulativa",
    description:
      "O que você não utilizar neste mês continua disponível para o próximo, podendo acumular até o dobro da franquia do seu plano.",
    icon: "layers",
  },
  {
    id: "no-contract",
    number: "02",
    title: "Sem Fidelidade",
    description:
      "Liberdade total para cancelar ou trocar de plano quando desejar, sem multas ou burocracias.",
    icon: "unlock",
  },
  {
    id: "whatsapp-waze",
    number: "03",
    title: "WhatsApp e Waze Ilimitados",
    description:
      "WhatsApp livre em todos os planos. Waze gratuito nos planos Giga, Ultra e Infinity.",
    icon: "message-circle",
  },
  {
    id: "club",
    number: "04",
    title: "iGreen Club",
    description:
      "Descontos exclusivos em mais de 30 mil lojas, serviços e grandes marcas sem custo adicional.",
    icon: "gift",
  },
  {
    id: "no-cutoff",
    number: "05",
    title: "Internet Sem Cortes",
    description:
      "Ao consumir toda a franquia, você continua conectado com velocidade reduzida até a renovação do plano.",
    icon: "wifi",
  },
  {
    id: "cashback",
    number: "06",
    title: "Cashback por Indicação",
    description:
      "Indique amigos e receba cashback recorrente enquanto as linhas permanecerem ativas e adimplentes.",
    icon: "wallet",
  },
  {
    id: "family",
    number: "07",
    title: "Plano Família",
    description:
      "Cadastre múltiplas linhas no mesmo CPF ou CNPJ e receba desconto mensal a partir da segunda linha.",
    icon: "users",
  },
  {
    id: "portability",
    number: "08",
    title: "Bônus de Portabilidade",
    description:
      "Traga seu número para a iGreen Telecom e ganhe 5GB extras todos os meses.",
    icon: "smartphone",
  },
  {
    id: "coverage",
    number: "09",
    title: "Cobertura Nacional",
    description:
      "Conectividade através da infraestrutura das principais operadoras do país, com cobertura em todo o Brasil.",
    icon: "globe",
  },
  {
    id: "roaming",
    number: "10",
    title: "Roaming Internacional",
    description:
      "Conectividade nos Estados Unidos e acesso internacional em mais de 152 países.",
    icon: "plane",
  },
  {
    id: "support",
    number: "11",
    title: "Suporte 24 Horas",
    description:
      "Atendimento digital via WhatsApp disponível 24 horas por dia, 7 dias por semana.",
    icon: "headphones",
  },
  {
    id: "app",
    number: "12",
    title: "App Completo",
    description:
      "Gerencie consumo, faturas, benefícios e serviços diretamente pelo aplicativo iGreen Club.",
    icon: "smartphone-charging",
  },
];

const TELECOM_PLAN_FEATURES = [
  "Ligações ilimitadas",
  "WhatsApp ilimitado",
  "Internet acumulada",
  "iGreen Club incluso",
] as const;

export const TELECOM_PLANS: TelecomPlan[] = [
  {
    id: "start",
    name: "Start",
    data: "11GB",
    dataDetail: "6GB + 5GB com portabilidade",
    price: 54.9,
    priceWithoutPortability: 59.9,
    features: [...TELECOM_PLAN_FEATURES],
    ctaLabel: "Ativar Start",
  },
  {
    id: "mega",
    name: "Mega",
    data: "15GB",
    dataDetail: "10GB + 5GB com portabilidade",
    price: 59.9,
    priceWithoutPortability: 64.9,
    features: [...TELECOM_PLAN_FEATURES],
    ctaLabel: "Ativar Mega",
  },
  {
    id: "giga",
    name: "Giga",
    data: "20GB",
    dataDetail: "15GB + 5GB com portabilidade",
    price: 69.9,
    priceWithoutPortability: 74.9,
    features: [...TELECOM_PLAN_FEATURES],
    ctaLabel: "Ativar Giga",
  },
  {
    id: "ultra",
    name: "Ultra",
    data: "28GB",
    dataDetail: "23GB + 5GB com portabilidade",
    price: 79.9,
    priceWithoutPortability: 84.9,
    features: [...TELECOM_PLAN_FEATURES],
    ctaLabel: "Ativar Ultra",
  },
  {
    id: "infinity",
    name: "Infinity",
    data: "50GB",
    dataDetail: "Máxima performance, sem preocupações",
    price: 99.9,
    priceWithoutPortability: 104.9,
    features: [...TELECOM_PLAN_FEATURES],
    ctaLabel: "Ativar Infinity",
    badge: "POWER",
  },
];

export const TELECOM_COMPARISON: TelecomComparisonRow[] = [
  { characteristic: "Contratação 100% online", igreen: "Sim, em minutos", traditional: "Loja física ou call center" },
  { characteristic: "Fidelidade", igreen: "Sem fidelidade", traditional: "12 a 24 meses" },
  { characteristic: "eSIM instantâneo", igreen: "Ativação imediata", traditional: "Apenas chip físico" },
  { characteristic: "Cashback", igreen: "Até 10% mensal", traditional: "Não oferece" },
  { characteristic: "Portabilidade", igreen: "Grátis e assistida", traditional: "Taxa ou burocracia" },
  { characteristic: "App de gestão", igreen: "Completo e intuitivo", traditional: "Limitado ou inexistente" },
  { characteristic: "Suporte", igreen: "Digital 24h", traditional: "Horário comercial" },
  { characteristic: "Clube de benefícios", igreen: "Incluso nos planos", traditional: "Não disponível" },
];

export const TELECOM_STEPS: TelecomStep[] = [
  {
    id: "choose",
    step: 1,
    title: "Escolha seu plano",
    description: "Simule e compare planos com transparência total. Sem letras miúdas.",
  },
  {
    id: "register",
    step: 2,
    title: "Cadastre-se online",
    description: "Preencha seus dados em 2 minutos. Validação instantânea e segura.",
  },
  {
    id: "activate",
    step: 3,
    title: "Ative com eSIM",
    description: "Receba o QR Code no app e ative imediatamente. Chip físico opcional.",
  },
  {
    id: "enjoy",
    step: 4,
    title: "Aproveite os benefícios",
    description: "Cashback, clube de vantagens e suporte 24h desde o primeiro dia.",
  },
];

export const TELECOM_TESTIMONIALS: TelecomTestimonial[] = [
  {
    id: "1",
    name: "Camila R.",
    role: "Empreendedora — São Paulo",
    quote: "Migrei em 10 minutos com eSIM. A fatura caiu 40% e o app é muito mais claro que da operadora anterior.",
    rating: 5,
  },
  {
    id: "2",
    name: "Rafael M.",
    role: "Desenvolvedor — Curitiba",
    quote: "Portabilidade sem dor de cabeça. Mantive meu número e o cashback já pagou metade da primeira fatura.",
    rating: 5,
  },
  {
    id: "3",
    name: "Juliana S.",
    role: "Professora — Belo Horizonte",
    quote: "Atendimento pelo WhatsApp resolveu tudo em minutos. Finalmente uma operadora que respeita o cliente.",
    rating: 5,
  },
  {
    id: "4",
    name: "Diego A.",
    role: "Motorista de app — Rio de Janeiro",
    quote: "Internet estável o dia inteiro e plano sem fidelidade. Posso cancelar quando quiser, mas não vou.",
    rating: 5,
  },
  {
    id: "5",
    name: "Patrícia L.",
    role: "Designer — Florianópolis",
    quote: "O clube de benefícios vale a pena demais. Descontos em streaming e delivery todo mês.",
    rating: 5,
  },
];

export const TELECOM_FAQ: TelecomFaqItem[] = [
  {
    id: "faq-1",
    question: "O que é a Telecom iGreen?",
    answer: "Somos uma operadora digital (MVNO) que oferece planos de telefonia móvel com internet 4G/5G, contratação 100% online, eSIM instantâneo e benefícios exclusivos como cashback e clube de vantagens.",
  },
  {
    id: "faq-2",
    question: "Preciso trocar meu número para contratar?",
    answer: "Não. Você pode manter seu número atual com portabilidade gratuita e assistida. Também é possível contratar uma nova linha com número novo.",
  },
  {
    id: "faq-3",
    question: "Como funciona o eSIM?",
    answer: "Após a contratação, você recebe um QR Code no app. Escaneie nas configurações do celular e seu plano é ativado em minutos, sem precisar de chip físico.",
  },
  {
    id: "faq-4",
    question: "Meu celular é compatível com eSIM?",
    answer: "A maioria dos smartphones lançados a partir de 2019 suporta eSIM, incluindo iPhones (XR em diante), Samsung Galaxy S20+, Google Pixel e outros. Consulte as especificações do seu aparelho.",
  },
  {
    id: "faq-5",
    question: "Existe fidelidade nos planos?",
    answer: "Não. Todos os planos são sem fidelidade. Você pode cancelar a qualquer momento sem multa ou taxa de rescisão.",
  },
  {
    id: "faq-6",
    question: "Como funciona a portabilidade?",
    answer: "Informe seu número atual no cadastro. Nossa equipe inicia o processo automaticamente e você recebe atualizações por SMS e app. O prazo médio é de 1 a 3 dias úteis.",
  },
  {
    id: "faq-7",
    question: "Quanto tempo demora para ativar?",
    answer: "Com eSIM, a ativação é instantânea após confirmação do pagamento. Para chip físico, a entrega ocorre em até 48 horas úteis nas principais capitais.",
  },
  {
    id: "faq-8",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartão de crédito, débito automático, PIX recorrente e boleto bancário. O débito automático garante desconto adicional de 5%.",
  },
  {
    id: "faq-9",
    question: "O que é o cashback?",
    answer: "Todo mês você recebe de volta uma porcentagem do valor pago, creditada na sua carteira digital no app. Pode usar em descontos na fatura ou resgatar em parceiros.",
  },
  {
    id: "faq-10",
    question: "Como funciona o clube de benefícios?",
    answer: "Assinantes têm acesso a descontos exclusivos em streaming, delivery, farmácias, academias e centenas de parceiros. Os benefícios variam conforme o plano contratado.",
  },
  {
    id: "faq-11",
    question: "A cobertura funciona em todo o Brasil?",
    answer: "Sim. Utilizamos a infraestrutura das principais redes nacionais, garantindo cobertura 4G/5G em todo o território brasileiro. Consulte o mapa de cobertura no app.",
  },
  {
    id: "faq-12",
    question: "Posso usar internet no exterior?",
    answer: "Planos Plus e superiores incluem roaming na América Latina. Para outros destinos, pacotes de roaming internacional podem ser contratados pelo app.",
  },
  {
    id: "faq-13",
    question: "O que acontece se eu esgotar meus dados?",
    answer: "Você recebe alertas ao atingir 80% e 100% do pacote. Pode contratar pacotes adicionais pelo app ou aguardar a renovação no ciclo seguinte.",
  },
  {
    id: "faq-14",
    question: "Posso compartilhar internet (hotspot)?",
    answer: "Sim. Todos os planos permitem compartilhamento de internet via hotspot/Wi-Fi sem custo adicional, respeitando o limite de dados do plano.",
  },
  {
    id: "faq-15",
    question: "Como entro em contato com o suporte?",
    answer: "Pelo app, WhatsApp ou chat no site — 24 horas por dia, 7 dias por semana. Tempo médio de resposta: menos de 5 minutos.",
  },
  {
    id: "faq-16",
    question: "Posso ter mais de uma linha na mesma conta?",
    answer: "Sim. Gerencie até 5 linhas familiares na mesma conta com desconto progressivo a partir da segunda linha.",
  },
  {
    id: "faq-17",
    question: "A operadora é regulamentada?",
    answer: "Sim. Operamos como MVNO devidamente autorizada pela ANATEL, em conformidade com todas as regulamentações do setor de telecomunicações.",
  },
  {
    id: "faq-18",
    question: "Meus dados pessoais estão seguros?",
    answer: "Sim. Seguimos rigorosamente a LGPD, com criptografia de ponta a ponta e políticas transparentes de privacidade. Seus dados nunca são vendidos a terceiros.",
  },
  {
    id: "faq-19",
    question: "Posso mudar de plano depois?",
    answer: "Sim. Upgrade ou downgrade a qualquer momento pelo app, com efeito imediato ou no próximo ciclo de faturamento, conforme sua preferência.",
  },
  {
    id: "faq-20",
    question: "Como cancelo meu plano?",
    answer: "Pelo app ou WhatsApp, sem burocracia e sem multa. O cancelamento é processado em até 24 horas e você mantém o serviço até o fim do ciclo pago.",
  },
];

export const TELECOM_SIMULATOR_OPTIONS = [
  { gb: 15, label: "15 GB", description: "Uso básico" },
  { gb: 30, label: "30 GB", description: "Uso moderado" },
  { gb: 60, label: "60 GB", description: "Uso intenso" },
  { gb: 100, label: "100 GB", description: "Uso premium" },
] as const;

export const TELECOM_CLUB_BENEFITS = [
  "Streaming com desconto",
  "Delivery e restaurantes",
  "Farmácias e saúde",
  "Academias e bem-estar",
  "Educação online",
  "Viagens e hotéis",
] as const;

export type TelecomClubBenefit = {
  id: string;
  title: string;
  description: string;
  icon: "gift" | "wallet" | "signal" | "credit-card" | "smartphone" | "users";
};

export type TelecomClubFloatingBadge = {
  id: string;
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export const TELECOM_CLUB_GRID_BENEFITS: TelecomClubBenefit[] = [
  {
    id: "partners",
    title: "+30 Mil Lojas Parceiras",
    description:
      "Descontos exclusivos em produtos, serviços, viagens, restaurantes e muito mais.",
    icon: "gift",
  },
  {
    id: "cashback",
    title: "Cashback por Indicação",
    description:
      "Ganhe recompensas ao indicar novos clientes para a iGreen Telecom.",
    icon: "wallet",
  },
  {
    id: "portability",
    title: "+5GB na Portabilidade",
    description:
      "Receba internet adicional ao trazer seu número para a iGreen Telecom.",
    icon: "signal",
  },
  {
    id: "financial",
    title: "Controle Financeiro",
    description:
      "Visualize, gerencie e pague suas faturas diretamente pelo aplicativo.",
    icon: "credit-card",
  },
  {
    id: "line-management",
    title: "Gestão Completa da Linha",
    description:
      "Acompanhe consumo, saldo acumulado e contrate pacotes adicionais quando precisar.",
    icon: "smartphone",
  },
  {
    id: "family",
    title: "Plano Família",
    description:
      "Gerencie múltiplas linhas e acompanhe todos os benefícios em um único lugar.",
    icon: "users",
  },
];

export const TELECOM_CLUB_FLOATING_BADGES: TelecomClubFloatingBadge[] = [
  { id: "stores", label: "+30 mil lojas parceiras", position: "top-left" },
  { id: "cashback", label: "R$ 3,50 cashback por indicação", position: "top-right" },
  { id: "portability", label: "+5GB na portabilidade", position: "bottom-left" },
  { id: "control", label: "100% controle pelo app", position: "bottom-right" },
];

export const TELECOM_CLUB_HIGHLIGHT_ITEMS = [
  "Acompanhe seu consumo em tempo real",
  "Consulte seu saldo acumulado",
  "Pague suas faturas online",
  "Solicite seu chip",
  "Ative sua linha digitalmente",
  "Acompanhe sua portabilidade",
  "Contrate internet adicional",
  "Gerencie múltiplas linhas",
  "Receba suporte digital integrado",
] as const;

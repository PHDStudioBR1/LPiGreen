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
    title: "Ative sua linha",
    description: "Ativação imediata por eSIM ou receba seu chip e ative o plano em poucos minutos. Processo 100% online.",
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
    quote: "Migrei em 10 minutos. A fatura caiu 40% e o app é muito mais claro que da operadora anterior.",
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
    question: "O que é a iGreen Telecom?",
    answer:
      "A iGreen Telecom é a operadora móvel do grupo iGreen Energy, atuando no modelo MVNO (Operadora Móvel Virtual). Ela utiliza a infraestrutura das principais operadoras do país para oferecer cobertura nacional com planos acessíveis e benefícios exclusivos.",
  },
  {
    id: "faq-2",
    question: "Quais são os planos disponíveis?",
    answer:
      "A iGreen Telecom oferece cinco opções de planos: Start, Mega, Giga, Ultra e Infinity, com franquias de internet que variam de 6GB a 50GB, considerando os bônus para clientes que realizam portabilidade.",
  },
  {
    id: "faq-3",
    question: "Os planos possuem fidelidade ou multa por cancelamento?",
    answer:
      "Não. Todos os planos são 100% sem fidelidade. Você pode cancelar, alterar ou migrar de plano quando desejar, sem burocracia e sem cobrança de multa.",
  },
  {
    id: "faq-4",
    question: "Qual a diferença entre contratar um número novo ou fazer portabilidade?",
    answer:
      "Ao realizar a portabilidade do seu número atual para a iGreen Telecom, você recebe 5GB extras todos os meses e ainda paga uma mensalidade reduzida em comparação à contratação de uma linha nova.",
  },
  {
    id: "faq-5",
    question: "Como funciona o acúmulo de internet?",
    answer:
      "A internet não utilizada durante o mês é acumulada para o ciclo seguinte, desde que o pagamento esteja em dia. O acúmulo pode chegar a até duas vezes a franquia principal do plano contratado.",
  },
  {
    id: "faq-6",
    question: "O que é o iGreen Club?",
    answer:
      "O iGreen Club é um clube de vantagens incluso nos planos da operadora, oferecendo descontos exclusivos em mais de 30 mil lojas, serviços, restaurantes, farmácias, viagens e grandes marcas parceiras.",
  },
  {
    id: "faq-7",
    question: "O WhatsApp é realmente ilimitado?",
    answer:
      "Sim. O envio e recebimento de mensagens de texto, fotos e áudios pelo WhatsApp não consomem a franquia de internet do seu plano.",
  },
  {
    id: "faq-8",
    question: "Ligações e chamadas de vídeo pelo WhatsApp consomem internet?",
    answer:
      "Sim. Chamadas de voz e vídeo realizadas pelo WhatsApp utilizam a franquia de dados normalmente e são descontadas do pacote contratado.",
  },
  {
    id: "faq-9",
    question: "O aplicativo Waze é gratuito?",
    answer:
      "Sim. O uso do Waze sem desconto da franquia está disponível para os clientes dos planos Giga, Ultra e Infinity.",
  },
  {
    id: "faq-10",
    question: "Como funciona o cashback por indicação?",
    answer:
      "Ao indicar um novo cliente que ative uma linha na iGreen Telecom, você recebe R$ 3,50 de cashback todos os meses, enquanto a linha indicada permanecer ativa e com os pagamentos em dia.",
  },
  {
    id: "faq-11",
    question: "O que acontece quando minha franquia de internet acaba?",
    answer:
      "Sua internet não é interrompida. Você continua navegando com velocidade reduzida de 32 Kbps até a renovação do plano ou início do próximo ciclo.",
  },
  {
    id: "faq-12",
    question: "A iGreen Telecom oferece eSIM?",
    answer:
      "Sim. Clientes com aparelhos compatíveis podem ativar a linha por eSIM (chip virtual), dispensando o uso do chip físico e permitindo uma ativação mais rápida.",
  },
  {
    id: "faq-13",
    question: "Como recebo o chip físico caso meu aparelho não seja compatível com eSIM?",
    answer:
      "Se o seu dispositivo não aceitar eSIM, a iGreen Telecom envia o chip físico diretamente para o endereço informado durante o cadastro.",
  },
  {
    id: "faq-14",
    question: "Quais são as formas de pagamento disponíveis?",
    answer:
      "As mensalidades podem ser pagas via Cartão de Crédito, com cobrança recorrente, ou por PIX.",
  },
  {
    id: "faq-15",
    question: "O que é o Plano Família?",
    answer:
      "O Plano Família permite cadastrar várias linhas vinculadas ao mesmo CPF ou CNPJ. A partir da segunda linha, cada número adicional recebe R$ 10,00 de desconto mensal.",
  },
  {
    id: "faq-16",
    question: "Como acompanhar meu consumo de internet e minhas faturas?",
    answer:
      "Toda a gestão da sua linha pode ser feita pelo aplicativo iGreen Club, onde você acompanha consumo de dados, saldo acumulado, pagamentos e demais informações da conta.",
  },
  {
    id: "faq-17",
    question: "Quanto tempo leva para a linha ser ativada?",
    answer:
      "Após a confirmação do pagamento inicial, a ativação da linha acontece em poucos minutos.",
  },
  {
    id: "faq-18",
    question: "Quanto tempo demora a portabilidade?",
    answer:
      "O processo de portabilidade é concluído em até 3 dias úteis após a solicitação e validação dos dados.",
  },
  {
    id: "faq-19",
    question: "A iGreen Telecom possui suporte 24 horas?",
    answer:
      "Sim. O atendimento é 100% digital e funciona 24 horas por dia, 7 dias por semana, através do WhatsApp no número 0800 183 0080 (Opção 4).",
  },
  {
    id: "faq-20",
    question: "O que acontece se eu atrasar o pagamento da mensalidade?",
    answer:
      "Em caso de atraso, os dados acumulados podem ser perdidos e o benefício de acúmulo de internet poderá ficar suspenso até a regularização do pagamento.",
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

import {
  Car,
  CarFront,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Fuel,
  KeyRound,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Smartphone,
  Truck,
  UserCheck,
  Wrench,
} from "lucide-react";
import type {
  SegurosAssistanceItem,
  SegurosBenefit,
  SegurosComparisonRow,
  SegurosFaqItem,
  SegurosPlan,
  SegurosStep,
  SegurosTestimonial,
} from "@/types/seguros";

export const SEGUROS_BENEFITS: SegurosBenefit[] = [
  {
    id: "cobertura",
    title: "Cobertura Completa",
    description: "Proteção contra roubo, furto, colisão, incêndio e fenômenos naturais.",
    icon: ShieldCheck,
  },
  {
    id: "fidelidade",
    title: "Sem Fidelidade",
    description: "Cancele quando quiser, sem multa e sem burocracia.",
    icon: CheckCircle2,
  },
  {
    id: "pagamento",
    title: "Pagamento Mensal",
    description: "Boleto ou PIX mensal, sem comprometer o limite do cartão.",
    icon: CreditCard,
  },
  {
    id: "perfil",
    title: "Qualquer Perfil",
    description: "Aceitamos todos os perfis de motorista e histórico de crédito.",
    icon: UserCheck,
  },
  {
    id: "app",
    title: "Motorista de App",
    description: "Uber, 99, iFood e entregadores são bem-vindos.",
    icon: Smartphone,
  },
  {
    id: "leilao",
    title: "Carro de Leilão",
    description: "Veículos de leilão e financiados também são aceitos.",
    icon: CarFront,
  },
  {
    id: "assistencia",
    title: "Assistência 24h",
    description: "Guincho, pane seca, chaveiro e troca de pneu a qualquer hora.",
    icon: Phone,
  },
  {
    id: "digital",
    title: "Contratação Digital",
    description: "Tudo pelo celular: cotação, contratação e emissão da apólice.",
    icon: FileCheck,
  },
];

export const SEGUROS_COMPARISON: SegurosComparisonRow[] = [
  {
    characteristic: "Cotação online",
    igreen: "100% Online em 3 min",
    traditional: "Burocrático",
  },
  {
    characteristic: "Análise de perfil do motorista",
    igreen: "Sem análise de perfil",
    traditional: "Análise obrigatória",
  },
  {
    characteristic: "Fidelidade",
    igreen: "Sem fidelidade",
    traditional: "12 meses de fidelidade",
  },
  {
    characteristic: "Aceita motorista de App (Uber/99)",
    igreen: "Sim",
    traditional: "Geralmente negado",
  },
  {
    characteristic: "Aceita carro de leilão",
    igreen: "Sim",
    traditional: "Raramente",
  },
  {
    characteristic: "Forma de pagamento",
    igreen: "Mensal no boleto",
    traditional: "Anual ou parcelado",
  },
  {
    characteristic: "Multa por cancelamento",
    igreen: "Sem multa",
    traditional: "Multa proporcional",
  },
  {
    characteristic: "Consulta SPC/Serasa",
    igreen: "Sem consulta",
    traditional: "Consulta obrigatória",
  },
  {
    characteristic: "Tempo para ativar o seguro",
    igreen: "Até 24 horas",
    traditional: "Dias ou até semanas",
  },
];

export const SEGUROS_STEPS: SegurosStep[] = [
  {
    id: 1,
    title: "Preencha seus dados",
    description: "Modelo do veículo, CEP e seus dados de contato",
    icon: FileCheck,
  },
  {
    id: 2,
    title: "Escolha seu plano",
    description: "Basic, Premium ou Infinite — veja coberturas e preço",
    icon: Shield,
  },
  {
    id: 3,
    title: "Pague o 1º boleto",
    description: "Pague a primeira mensalidade para ativar o processo",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Envie as fotos",
    description: "Fotografe o veículo pelo app para a vistoria online",
    icon: Car,
  },
  {
    id: 5,
    title: "Seguro ativo!",
    description: "Vistoria aprovada? Seguro ativado em até 24 horas",
    icon: CheckCircle2,
  },
];

export const SEGUROS_PLANS: SegurosPlan[] = [
  {
    id: "basic",
    name: "BASIC",
    price: "R$ 89",
    priceNote: "/mês",
    description: "Proteção essencial com o melhor custo-benefício.",
    features: [
      {
        icon: ShieldCheck,
        label: "Cobertura",
        description: "Roubo, Furto e Indenização de 100% da Tabela FIPE",
      },
      {
        icon: Phone,
        label: "Assistência 24h",
        description:
          "Guincho de até 250 km (total ida/volta), socorro mecânico, troca de pneus e chaveiro",
      },
      {
        icon: UserCheck,
        label: "Aprovação Facilitada",
        description: "Sem consulta ao SPC/Serasa e sem burocracia",
      },
      {
        icon: CreditCard,
        label: "Modelo por Assinatura",
        description: "Pagamento mensal recorrente, sem comprometer o limite do cartão",
      },
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "R$ 149",
    priceNote: "/mês",
    description: "A proteção completa para o seu dia a dia.",
    features: [
      {
        icon: Shield,
        label: "Cobertura Abrangente",
        description:
          "Roubo, Furto, Colisão, Perda Total e Fenômenos da Natureza (enchente, granizo etc.)",
      },
      {
        icon: Truck,
        label: "Assistência 24h Expandida",
        description:
          "Guincho de até 500 km (total ida/volta) e auxílio para passageiros (hospedagem e transporte)",
      },
      {
        icon: Car,
        label: "Carro Reserva",
        description: "7 dias inclusos em caso de sinistro",
      },
      {
        icon: Smartphone,
        label: "Aceitação Especial",
        description: "Aceitamos motoristas de aplicativo, táxis e carros de locadora",
      },
      {
        icon: CheckCircle2,
        label: "Sem Fidelidade",
        description: "Cancele quando quiser, sem multas ou taxas escondidas",
      },
    ],
    highlighted: true,
    badge: "MAIS POPULAR",
  },
  {
    id: "infinite",
    name: "INFINITE",
    price: "R$ 219",
    priceNote: "/mês",
    description: "Máxima segurança e tranquilidade total.",
    features: [
      {
        icon: ShieldCheck,
        label: "Tudo do Premium +",
        description: "Proteção adicional para Vidros, Faróis, Lanternas e Retrovisores",
      },
      {
        icon: Car,
        label: "Carro Reserva Estendido",
        description: "Opções de 15 ou 30 dias de veículo reserva",
      },
      {
        icon: CarFront,
        label: "Flexibilidade de Frota",
        description:
          "Aceitamos veículos de leilão (com depreciação de tabela) e modelos de alta performance",
      },
      {
        icon: MapPin,
        label: "Abrangência Nacional",
        description: "Proteção garantida em todo o território brasileiro",
      },
      {
        icon: Wrench,
        label: "Peças de Qualidade",
        description: "Reparos garantidos com peças M.A. (Mercado Alternativo/Compatíveis)",
      },
    ],
  },
];

export const SEGUROS_TESTIMONIALS: SegurosTestimonial[] = [
  {
    id: "1",
    name: "Ricardo Almeida",
    city: "São Paulo, SP",
    rating: 5,
    comment:
      "Sou motorista de app e sempre tinha o seguro negado. Na iGreen fui aceito na hora e pago boleto todo mês.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Fernanda Costa",
    city: "Belo Horizonte, MG",
    rating: 5,
    comment:
      "Comprei um carro de leilão e nenhuma seguradora tradicional aceitava. Aqui contratei tudo pelo celular em 10 minutos.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Marcos Oliveira",
    city: "Curitiba, PR",
    rating: 5,
    comment:
      "Assistência 24h salvou meu dia quando o carro parou na estrada. Guincho chegou em 40 minutos.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Juliana Santos",
    city: "Recife, PE",
    rating: 5,
    comment:
      "Sem consulta SPC foi o diferencial. Estava com nome sujo e mesmo assim consegui proteger meu carro.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

export const SEGUROS_ASSISTANCE: SegurosAssistanceItem[] = [
  {
    id: "guincho",
    title: "Guincho",
    description: "Reboque do veículo em caso de pane ou acidente, 24 horas por dia.",
    icon: Truck,
  },
  {
    id: "pane",
    title: "Pane Seca",
    description: "Envio de combustível para você voltar a rodar com segurança.",
    icon: Fuel,
  },
  {
    id: "chaveiro",
    title: "Chaveiro",
    description: "Abertura de veículo e confecção de chave quando necessário.",
    icon: KeyRound,
  },
  {
    id: "pneu",
    title: "Troca de Pneu",
    description: "Troca ou reparo de pneu no local, sem precisar ir à oficina.",
    icon: Wrench,
  },
];

export const SEGUROS_FAQ: SegurosFaqItem[] = [
  {
    id: "1",
    question: "O seguro iGreen consulta SPC ou Serasa?",
    answer:
      "Não. Nosso modelo digital não realiza consulta ao SPC, Serasa ou birôs de crédito. Qualquer pessoa pode fazer a cotação.",
  },
  {
    id: "2",
    question: "Motoristas de aplicativo são aceitos?",
    answer:
      "Sim. Aceitamos motoristas de Uber, 99, iFood e demais apps de transporte e entrega sem análise de perfil adicional.",
  },
  {
    id: "3",
    question: "Aceitam carro de leilão ou financiado?",
    answer:
      "Sim. Veículos adquiridos em leilão, financiados ou com restrição em seguradoras tradicionais podem ser segurados conosco.",
  },
  {
    id: "4",
    question: "Quanto tempo leva para o seguro ficar ativo?",
    answer:
      "Após o pagamento do primeiro boleto e envio das fotos do veículo, a ativação ocorre em até 10 minutos.",
  },
  {
    id: "5",
    question: "Existe fidelidade ou multa de cancelamento?",
    answer:
      "Não há fidelidade. Você pode cancelar a qualquer momento sem multa, bastando não pagar a próxima mensalidade.",
  },
  {
    id: "6",
    question: "Quais veículos podem ser segurados?",
    answer:
      "Carros, motos e caminhões de passeio e comercial, incluindo veículos usados, de leilão e para uso em aplicativos.",
  },
  {
    id: "7",
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é mensal via boleto bancário ou PIX. Não é necessário cartão de crédito nem comprometer limite.",
  },
  {
    id: "8",
    question: "O seguro é regulamentado?",
    answer:
      "Sim. Operamos em parceria com seguradoras autorizadas pela SUSEP (Superintendência de Seguros Privados).",
  },
  {
    id: "9",
    question: "O que cobre o plano Basic?",
    answer:
      "O plano Basic inclui cobertura contra roubo e furto, assistência 24h básica e guincho até 200 km, sem consulta SPC.",
  },
  {
    id: "10",
    question: "Como acionar a assistência 24h?",
    answer:
      "Basta ligar para o número informado na apólice ou pelo app. Atendimento disponível 24 horas, 7 dias por semana.",
  },
];

export const SEGUROS_APP_DRIVER_FEATURES = [
  { icon: ShieldCheck, label: "Indenização completa" },
  { icon: CreditCard, label: "Boleto mensal" },
  { icon: Clock, label: "Assistência 24h" },
  { icon: UserCheck, label: "Sem análise de perfil" },
];

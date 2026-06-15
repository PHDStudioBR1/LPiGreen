import {
  Car,
  CarFront,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Fuel,
  KeyRound,
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
  { label: "Sem análise de perfil", digital: true, traditional: false },
  { label: "Sem consulta SPC/Serasa", digital: true, traditional: false },
  { label: "Sem fidelidade", digital: true, traditional: false },
  { label: "Contratação 100% online", digital: true, traditional: false },
  { label: "Aprovação em minutos", digital: true, traditional: false },
  { label: "Motorista de app aceito", digital: true, traditional: false },
  { label: "Carro de leilão aceito", digital: true, traditional: false },
  { label: "Burocracia extensa", digital: false, traditional: true },
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
    name: "Basic",
    price: "R$ 89",
    priceNote: "/mês",
    description: "Proteção essencial para quem busca economia.",
    features: [
      "Cobertura contra roubo e furto",
      "Assistência 24h básica",
      "Guincho até 200 km",
      "Sem consulta SPC",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 149",
    priceNote: "/mês",
    description: "O plano mais escolhido pelos nossos clientes.",
    features: [
      "Cobertura completa",
      "Assistência 24h premium",
      "Guincho ilimitado",
      "Carro reserva 7 dias",
      "Motorista de app aceito",
      "Sem fidelidade",
    ],
    highlighted: true,
    badge: "MAIS POPULAR",
  },
  {
    id: "infinite",
    name: "Infinite",
    price: "R$ 219",
    priceNote: "/mês",
    description: "Máxima proteção para quem não aceita limites.",
    features: [
      "Tudo do Premium",
      "Cobertura internacional",
      "Carro reserva 15 dias",
      "Vidros e faróis inclusos",
      "Carro de leilão aceito",
      "Prioridade no atendimento",
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

export type HomeFaqItem = {
  q: string;
  a: string;
};

const HOME_FAQ_TIMING_ANSWER_DEFAULT =
  "Depois de feita a adesão e da validação junto à distribuidora, os créditos começam a aparecer em sua fatura geralmente a partir do mês seguinte ao da ativação. A partir daí, você já vê o desconto direto na conta.";

const HOME_FAQ_TIMING_ANSWER_LPIGREEN =
  "Após a adesão e a validação da análise, o prazo para que os créditos de energia comecem a ser aplicados na sua fatura é de 90 a 150 dias. Assim que a ativação for concluída junto à distribuidora de energia, os descontos passarão a aparecer automaticamente nas próximas contas, sem que você precise fazer nenhuma alteração na sua instalação elétrica.";

export const HOME_FAQS: HomeFaqItem[] = [
  {
    q: "\"Isso parece golpe. Como pode ser de graça?\"",
    a: "Entendemos sua desconfiança. Vivemos em um país onde todo mundo desconfia de tudo — e com razão. Mas olha só: Não é de graça. Você continua pagando sua conta de luz. A diferença é que você paga menos, porque está usando créditos de energia limpa. A iGreen ganha porque vende a energia produzida nas usinas para a distribuidora. E você ganha porque recebe desconto. É uma relação de ganha-ganha. Não tem mágica. É negócio."
  },
  {
    q: "\"Se eu não pago a usina, como vocês ganham dinheiro?\"",
    a: "A iGreen vende a energia gerada em suas usinas para a distribuidora e recebe por isso. Uma parte desse valor é usada para gerar o desconto na sua conta. Você paga menos, nós recebemos pela energia gerada e a distribuidora continua entregando a mesma energia de sempre."
  },
  {
    q: "\"Minha energia vai ficar ruim? Vai cair luz?\"",
    a: "Não. Nada muda na qualidade da energia que chega na sua casa. A distribuidora continua sendo a mesma, usando a mesma rede de postes e cabos. O que muda é apenas a forma como a energia é compensada na sua fatura, com os créditos de energia limpa."
  },
  {
    q: "\"Tem taxa escondida?\"",
    a: "Não. Não existe taxa de adesão escondida, mensalidade extra ou qualquer cobrança surpresa. Você continua pagando a fatura normalmente para a distribuidora, só que com o valor reduzido pelos créditos de energia limpa."
  },
  {
    q: "\"E se eu quiser sair?\"",
    a: "Você pode sair quando quiser. Basta solicitar o cancelamento e, após o prazo operacional para a distribuidora processar a alteração, sua conta volta ao valor normal, sem os créditos de energia limpa."
  },
  {
    q: "\"Isso é legal? É regulamentado?\"",
    a: "Sim. Todo o modelo é regulamentado pela ANEEL e pela Lei nº 14.300/2022, que trata justamente da geração distribuída e da possibilidade de compensar créditos de energia limpa na sua conta de luz."
  },
  {
    q: "\"Por que minha distribuidora não me ofereceu isso?\"",
    a: "O modelo de negócio da distribuidora é diferente. A iGreen injeta energia limpa na rede (Cemig, CPFL, Equatorial e outras) e você recebe os créditos na sua conta — sem investimento, sem burocracia e sem fidelidade. É a Conexão Green para baixa tensão/residencial."
  },
  {
    q: "\"Tem que ter telhado ou espaço?\"",
    a: "Não. Na Conexão Green você não instala nada. A energia limpa é gerada em usinas e injetada na rede da distribuidora. Você só usa os créditos na sua fatura e ainda pode participar do Cashback Indicou, Ganhou."
  },
  {
    q: "\"Quanto tempo demora para começar a economizar?\"",
    a: HOME_FAQ_TIMING_ANSWER_DEFAULT,
  },
];

function isLpigreenProdDomain(host: string): boolean {
  return host === "lpigreen.546digitalservices.com";
}

export function getHomeFaqs(host?: string): HomeFaqItem[] {
  const resolvedHost =
    host ?? (typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "");

  if (!isLpigreenProdDomain(resolvedHost)) {
    return HOME_FAQS;
  }

  return HOME_FAQS.map((faq) =>
    faq.q.includes("Quanto tempo demora para começar a economizar")
      ? { ...faq, a: HOME_FAQ_TIMING_ANSWER_LPIGREEN }
      : faq
  );
}

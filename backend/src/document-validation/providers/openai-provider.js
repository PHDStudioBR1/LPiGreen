const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1/chat/completions';

export async function callOpenAI({ prompt, model, apiKey, signal }) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const url = process.env.OPENAI_API_BASE_URL || DEFAULT_OPENAI_BASE_URL;

  const body = {
    model,
    messages: [
      {
        role: 'system',
        content:
          'Você é um serviço de validação de documentos. Responda sempre em JSON estrito e válido, sem comentários e sem texto extra.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    // Evita logar conteúdo sensível da resposta
    throw new Error(`OpenAI API error: status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI: resposta vazia ou inválida');
  }

  return content;
}


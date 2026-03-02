const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com/chat/completions';

export async function callDeepSeek({ prompt, model, apiKey, signal }) {
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY não configurada');
  }

  const url = process.env.DEEPSEEK_API_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL;

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
    throw new Error(`DeepSeek API error: status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek: resposta vazia ou inválida');
  }

  return content;
}


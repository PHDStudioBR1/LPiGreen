const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1/chat/completions';

const IMAGE_MIMETYPE_PREFIX = 'image/';

function buildUserContentWithImages(prompt, images) {
  if (!images || images.length === 0) {
    return prompt;
  }
  const parts = [{ type: 'text', text: prompt }];
  for (const img of images) {
    const { mimetype, base64 } = img;
    const mediaType = mimetype && mimetype.startsWith(IMAGE_MIMETYPE_PREFIX)
      ? mimetype
      : 'image/jpeg';
    parts.push({
      type: 'image_url',
      image_url: { url: `data:${mediaType};base64,${base64}` },
    });
  }
  return parts;
}

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
    throw new Error(`OpenAI API error: status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI: resposta vazia ou inválida');
  }

  return content;
}

/**
 * Chama a API OpenAI com suporte a visão (imagens). Use model com capacidade vision (ex: gpt-4o).
 * images: array de { mimetype, base64 } na ordem dos documentos (document_front, document_back, energy_bill).
 */
export async function callOpenAIVision({ prompt, images, model, apiKey, signal }) {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const url = process.env.OPENAI_API_BASE_URL || DEFAULT_OPENAI_BASE_URL;
  const userContent = buildUserContentWithImages(prompt, images);

  const body = {
    model: model || 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'Você é um serviço de validação de documentos. Analise as imagens enviadas e responda sempre em JSON estrito e válido, sem comentários e sem texto extra.',
      },
      { role: 'user', content: userContent },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
    max_tokens: 2048,
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
    throw new Error(`OpenAI API error: status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI Vision: resposta vazia ou inválida');
  }

  return content;
}


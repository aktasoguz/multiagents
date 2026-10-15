export type APIProvider = 'openai' | 'anthropic' | 'custom';

export interface APIConfig {
  provider: APIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string; // for custom endpoints
}

export interface APIResponse {
  content: string;
  error?: string;
}

export const callAPI = async (
  config: APIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<APIResponse> => {
  if (!config.apiKey) {
    return { content: '', error: 'API key is required' };
  }

  try {
    if (config.provider === 'anthropic') {
      return await callAnthropic(config, systemPrompt, userPrompt);
    } else {
      // openai and custom both use OpenAI-compatible format
      return await callOpenAICompatible(config, systemPrompt, userPrompt);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { content: '', error: errorMessage };
  }
};

const callOpenAICompatible = async (
  config: APIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<APIResponse> => {
  const baseUrl = config.provider === 'custom' 
    ? (config.baseUrl || 'https://api.openai.com/v1')
    : 'https://api.openai.com/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  return { content: data.choices[0].message.content };
};

const callAnthropic = async (
  config: APIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<APIResponse> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error (${response.status})`);
  }

  const data = await response.json();
  return { content: data.content[0].text };
};

export const saveAPIConfig = (config: APIConfig): void => {
  localStorage.setItem('map_api_config', JSON.stringify(config));
};

export const loadAPIConfig = (): APIConfig | null => {
  const stored = localStorage.getItem('map_api_config');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export type APIProvider = 'openai' | 'anthropic';

export interface APIConfig {
  provider: APIProvider;
  apiKey: string;
  model: string;
}

export interface APIResponse {
  content: string;
  error?: string;
}

const OPENAI_MODELS = ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];
const ANTHROPIC_MODELS = ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];

export const getModels = (provider: APIProvider): string[] => {
  return provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS;
};

export const getDefaultModel = (provider: APIProvider): string => {
  return provider === 'openai' ? OPENAI_MODELS[0] : ANTHROPIC_MODELS[0];
};

export const callAPI = async (
  config: APIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<APIResponse> => {
  if (!config.apiKey) {
    return { content: '', error: 'API key is required' };
  }

  try {
    if (config.provider === 'openai') {
      return await callOpenAI(config, systemPrompt, userPrompt);
    } else {
      return await callAnthropic(config, systemPrompt, userPrompt);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { content: '', error: errorMessage };
  }
};

const callOpenAI = async (
  config: APIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<APIResponse> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenAI API error');
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
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Anthropic API error');
  }

  const data = await response.json();
  return { content: data.content[0].text };
};

export const saveAPIConfig = (config: APIConfig): void => {
  localStorage.setItem('metagpt_api_config', JSON.stringify(config));
};

export const loadAPIConfig = (): APIConfig | null => {
  const stored = localStorage.getItem('metagpt_api_config');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

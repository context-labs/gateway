import { ProviderAPIConfig } from '../types';

export const inferenceDoNodeAPIConfig: ProviderAPIConfig = {
  getBaseURL: () => {
    if (process.env.ENVIRONMENT === 'dev') {
      return 'https://donode.inference.cool/v1';
    }
    return 'https://donode.inference.net/v1';
  },
  headers({ providerOptions }) {
    const { apiKey } = providerOptions;
    return { Authorization: `Bearer ${apiKey}` };
  },
  getEndpoint({ fn }) {
    switch (fn) {
      case 'chatComplete':
        return `/chat/completions`;
      case 'complete': {
        return '/completions';
      }
      default:
        return '';
    }
  },
};

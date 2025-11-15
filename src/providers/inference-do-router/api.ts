import { ProviderAPIConfig } from '../types';

export const inferenceDoNodeAPIConfig: ProviderAPIConfig = {
  getBaseURL: () => 'https://donode.inference.net/v1',
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

import { ProviderAPIConfig } from '../types';

export const inferenceDevnetAPIConfig: ProviderAPIConfig = {
  getBaseURL: () => 'https://api.devnet.inference.net/v1',
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

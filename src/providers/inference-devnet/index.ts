import { INFERENCEDEVNET } from '../../globals';
import { chatCompleteParams, responseTransformers } from '../open-ai-base';
import { ProviderConfigs } from '../types';
import { inferenceDevnetAPIConfig } from './api';
import { InferenceDevnetChatCompleteStreamChunkTransform } from './chatComplete';

export const InferenceDevnetProviderConfigs: ProviderConfigs = {
  chatComplete: chatCompleteParams([], { model: 'llama3' }),
  api: inferenceDevnetAPIConfig,
  responseTransforms: {
    ...responseTransformers(INFERENCEDEVNET, {
      chatComplete: true,
      complete: true,
    }),
    'stream-chatComplete': InferenceDevnetChatCompleteStreamChunkTransform,
  },
};

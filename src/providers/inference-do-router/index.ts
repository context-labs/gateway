import { INFERENCE_DO_NODE } from '../../globals';
import { chatCompleteParams, responseTransformers } from '../open-ai-base';
import { ProviderConfigs } from '../types';
import { inferenceDoNodeAPIConfig } from './api';
import { InferenceDoNodeChatCompleteStreamChunkTransform } from './chatComplete';

export const InferenceDoNodeProviderConfigs: ProviderConfigs = {
  chatComplete: chatCompleteParams([], { model: 'llama3' }),
  api: inferenceDoNodeAPIConfig,
  responseTransforms: {
    ...responseTransformers(INFERENCE_DO_NODE, {
      chatComplete: true,
      complete: true,
    }),
    'stream-chatComplete': InferenceDoNodeChatCompleteStreamChunkTransform,
  },
};

import { INFERENCEDEVNET } from '../../globals';

export const InferenceDevnetChatCompleteStreamChunkTransform: (
  response: string
) => string = (responseChunk) => {
  let trimmedChunk = responseChunk.trim();

  if (trimmedChunk === 'data: [DONE]') {
    return responseChunk;
  }

  if (!trimmedChunk.startsWith('data: ')) {
    return responseChunk;
  }

  const parsedChunk = JSON.parse(trimmedChunk.replace(/^data: /, ''));
  return (
    `data: ${JSON.stringify({
      ...parsedChunk,
      provider: INFERENCEDEVNET,
    })}` + '\n\n'
  );
};

import { INFERENCENET } from '../../globals';

export const InferenceNetChatCompleteStreamChunkTransform: (
  response: string
) => string = (responseChunk) => {
  let trimmedChunk = responseChunk.trim();

  if (trimmedChunk === 'data: [DONE]') {
    return responseChunk + '\n\n';
  }

  if (!trimmedChunk.startsWith('data: ')) {
    return responseChunk + '\n\n';
  }

  const parsedChunk = JSON.parse(trimmedChunk.replace(/^data: /, ''));
  return (
    `data: ${JSON.stringify({
      ...parsedChunk,
      provider: INFERENCENET,
    })}` + '\n\n'
  );
};

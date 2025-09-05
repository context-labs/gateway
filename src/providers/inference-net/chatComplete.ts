import { INFERENCENET } from '../../globals';

export const InferenceNetChatCompleteStreamChunkTransform: (
  response: string
) => string = (responseChunk) => {
  let trimmedChunk = responseChunk.trim();

  if (trimmedChunk === 'data: [DONE]') {
    return responseChunk + '\n\n';
  }

  if (trimmedChunk.startsWith('event: error')) {
    const errorMatch = trimmedChunk.match(/^event: error\s*\n?data: (.+)$/);

    try {
      const errorString = errorMatch ? errorMatch[1] : '';
      const error = JSON.parse(errorString);
      return (
        `event: error\ndata: ${JSON.stringify({
          ...error,
          provider: INFERENCENET,
        })}` + '\n\n'
      );
    } catch (error) {
      // fallback to the original chunk
      return trimmedChunk + '\n\n';
    }
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

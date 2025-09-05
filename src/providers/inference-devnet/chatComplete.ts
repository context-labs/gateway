import { INFERENCEDEVNET } from '../../globals';

export const InferenceDevnetChatCompleteStreamChunkTransform: (
  response: string
) => string = (responseChunk) => {
  console.debug('responseChunk: ', JSON.stringify(responseChunk));
  let trimmedChunk = responseChunk.trim();

  if (trimmedChunk === 'data: [DONE]') {
    return 'data: [DONE]\n\n';
  }

  if (trimmedChunk.startsWith('event: error')) {
    const errorMatch = trimmedChunk.match(/^event: error\s*\n?data: (.+)$/);

    try {
      const errorString = errorMatch ? errorMatch[1] : '';
      const error = JSON.parse(errorString);
      return (
        `event: error\ndata: ${JSON.stringify({
          ...error,
          provider: INFERENCEDEVNET,
        })}` + '\n\n'
      );
    } catch (error) {
      // fallback to the original chunk
      return trimmedChunk + '\n\n';
    }
  }

  if (!trimmedChunk.startsWith('data: ')) {
    return trimmedChunk + '\n\n';
  }

  const parsedChunk = JSON.parse(trimmedChunk.replace(/^data: /, ''));
  return (
    `data: ${JSON.stringify({
      ...parsedChunk,
      provider: INFERENCEDEVNET,
    })}` + '\n\n'
  );
};

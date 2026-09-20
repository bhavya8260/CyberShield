import apiFetch from './api';

export const chatWithAI = async (message, context) => {
  return await apiFetch('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context })
  });
};

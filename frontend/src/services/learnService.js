import apiFetch from './api';

export const getLearnTopics = async () => {
  return await apiFetch(`/learn`);
};

export const getLearnTopicById = async (id) => {
  return await apiFetch(`/learn/${id}`);
};

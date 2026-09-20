import apiFetch from './api';

export const getMyProgress = async () => {
  return await apiFetch(`/users/me/progress`);
};

export const getLeaderboard = async () => {
  return await apiFetch(`/users/leaderboard`);
};

export const getDailyChallenge = async () => {
  return await apiFetch(`/users/daily-challenge`);
};

export const getMySkills = async () => {
  return await apiFetch(`/users/me/skills`);
};

export const getMyRecommendations = async () => {
  return await apiFetch(`/users/me/recommendations`);
};

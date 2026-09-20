import apiFetch from './api';

export const getAnalyticsOverview = async () => {
  return await apiFetch(`/admin/analytics/overview`);
};

export const getAdminUsers = async () => {
  return await apiFetch(`/admin/users`);
};

export const updateAdminUser = async (id, data) => {
  return await apiFetch(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const getAdminMissions = async () => {
  return await apiFetch(`/admin/missions`);
};

export const getAdminAuditLogs = async (limit = 50) => {
  return await apiFetch(`/admin/audit-logs?limit=${limit}`);
};

export const getHealthStatus = async () => {
  return await apiFetch(`/admin/health`);
};

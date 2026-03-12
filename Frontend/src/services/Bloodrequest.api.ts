import api from './api';

export const createBloodRequestApi = (data: {
  bloodType: string;
  urgency: string;
  unitsNeeded: number;
  contactPerson: string;
  contactPhone: string;
  notes?: string;
}) => {
  return api.post('/blood-requests', data);
};

export const getHospitalRequestsApi = () => {
  return api.get('/blood-requests/hospital');
};

export const getAllActiveRequestsApi = (bloodType?: string) => {
  return api.get('/blood-requests', { params: { bloodType } });
};

export const updateRequestStatusApi = (id: string, status: 'active' | 'fulfilled' | 'cancelled') => {
  return api.patch(`/blood-requests/${id}/status`, { status });
};

export const deleteRequestApi = (id: string) => {
  return api.delete(`/blood-requests/${id}`);
};

export const respondToRequestApi = (requestId: string, message?: string) => {
  return api.post(`/blood-request-responses/${requestId}`, { message });
};

export const getRequestResponsesApi = (requestId: string) => {
  return api.get(`/blood-request-responses/request/${requestId}`);
};
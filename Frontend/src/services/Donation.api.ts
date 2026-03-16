import api from './api';

export const searchDonorApi = (query: string) =>
  api.get('/donations/search', { params: { query } });

export const markDonationApi = (data: {
  donorId: string;
  donationDate: string;
  donationTime: string;
  notes?: string;
}) => {
  return api.post('/donations/mark', data);
};

export const getRecentDonationsApi = () => {
  return api.get('/donations/recent');
};
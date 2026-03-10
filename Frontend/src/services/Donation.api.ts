import api from './api';

export const searchDonorApi = (donorId: string) => {
  return api.get('/donations/search', { params: { donorId } });
};

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
import api from './api';
import axios from 'axios';

export const getAllActiveEventsApi = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
  return response.data;
};

export const getEventByIdApi = (id: string) => {
  return api.get(`/events/${id}`);
};

export const createEventApi = (data: {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  expectedDonors?: number;
  contactPerson: string;
  contactPhone: string;
}) => {
  return api.post('/events', data);
};

export const cancelEventApi = (id: string) => {
  return api.patch(`/events/${id}/cancel`);
};

export const getHospitalEventsApi = () => {
  return api.get('/events/hospital');
};

export const getPendingEventsApi = () => {
  return api.get('/events/pending');
};

export const approveEventApi = (id: string) => {
  return api.patch(`/events/${id}/approve`);
};

export const rejectEventApi = (id: string) => {
  return api.patch(`/events/${id}/reject`);
};






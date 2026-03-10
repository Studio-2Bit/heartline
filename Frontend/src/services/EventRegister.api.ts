import api from './api';

export const registerForEventApi = (eventId: string, data: {
  fullName: string;
  phone: string;
  bloodType: string;
  age: number;
  gender: string;
  timeSlot: string;
  healthNotes?: string;
}) => {
  return api.post(`/event-registrations/${eventId}`, data);
};

export const getDonorRegistrationsApi = () => {
  return api.get('/event-registrations/donor');
};

export const getEventRegistrationsApi = (eventId: string) => {
  return api.get(`/event-registrations/event/${eventId}`);
};

export const cancelRegistrationApi = (id: string) => {
  return api.patch(`/event-registrations/${id}/cancel`);
};

export const markAttendedApi = (id: string) => {
  return api.patch(`/event-registrations/${id}/attend`);
};
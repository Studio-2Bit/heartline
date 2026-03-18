export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const urgencyLevels = ['Critical', 'High', 'Medium', 'Low'];



export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!phone.startsWith('+94')) return 'Phone number must start with +94';
  if (phone.length !== 12) return 'Phone number must be 12 digits (e.g. +94771234567)';
  const digits = phone.slice(3);
  if (!/^\d{9}$/.test(digits)) return 'Phone number must contain only digits after +94';
  return null; // valid
};


export const formatPhone = (value: string): string => {
  if (!value) return '+94';
  if (!value.startsWith('+94')) {
   
    if (value.startsWith('0')) return '+94' + value.slice(1);
    return '+94' + value;
  }
  return value;
};
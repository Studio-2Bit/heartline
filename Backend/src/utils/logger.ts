import { SystemLog } from '../models/SystemLog.model';

export const createLog = async (
  type: 'info' | 'warning' | 'error',
  action: string,
  user: string,
  details: string
) => {
  try {
    await SystemLog.create({ type, action, user, details });
  } catch (err) {
    console.error('Failed to save log:', err);
  }
};
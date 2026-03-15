import { Notification } from '../models/Notification.model';
import mongoose from 'mongoose';

export const createNotification = async (
  userId: string,
  type: 'request' | 'success' | 'info' | 'message',
  title: string,
  message: string
) => {
  try {
    await Notification.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      title,
      message,
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};
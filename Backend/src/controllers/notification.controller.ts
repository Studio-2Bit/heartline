import { Request, Response } from 'express';
import { Notification } from '../models/Notification.model';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }).limit(50);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return res.status(200).json({ message: 'All marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const markOneRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true }
    );
    return res.status(200).json({ message: 'Marked as read' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
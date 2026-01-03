export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  cloudinary: {
    name: process.env.CLOUDINARY_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
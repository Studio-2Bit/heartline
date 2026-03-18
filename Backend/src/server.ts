import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

import fs from 'fs';
import path from 'path';

console.log('__dirname:', __dirname);
console.log('dist contents:', fs.readdirSync(path.join(__dirname)));
try {
  console.log('dist/data contents:', fs.readdirSync(path.join(__dirname, 'data')));
} catch {
  console.log('dist/data folder does not exist');
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Server
    app.listen(config.port, () => {
      console.log(`\n🚀 Server running on http://localhost:${config.port}`);
      console.log(`📦 Environment: ${config.nodeEnv}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

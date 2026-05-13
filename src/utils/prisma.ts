import { PrismaClient } from '@prisma/client';

// Get proper database path for Electron
const getDatabasePath = () => {
  // Check if running in Electron
  if (typeof window !== 'undefined' && window.electronAPI) {
    // Running in Electron renderer process
    return window.electronAPI.getDatabasePath();
  }
  
  // Fallback for development/web
  if (process.env.NODE_ENV === 'development') {
    return './database.db';
  }
  
  // Production web fallback
  return './database.db';
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: `file:${getDatabasePath()}`
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Close database connection
export const closeDatabase = async () => {
  await prisma.$disconnect();
};

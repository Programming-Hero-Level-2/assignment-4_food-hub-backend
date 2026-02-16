import { app } from './app/app';
import { prisma } from './config/prisma';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database');
    console.error(error);
    process.exit(1);
  }
}

startServer();

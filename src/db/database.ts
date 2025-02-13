import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || '');

const connectDB = async (retries = 5) => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Обработка закрытия соединения
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

export { client, connectDB };

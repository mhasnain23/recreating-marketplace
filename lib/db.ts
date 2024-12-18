import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    try {
        const conn = await mongoose.connect(uri!);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        setupConnectionHandlers();
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
    }
}

function setupConnectionHandlers() {
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    setupGracefulShutdown();
}

function setupGracefulShutdown() {
    process.on('SIGINT', async () => {
        try {
            await mongoose.connection.close();
            console.info('MongoDB connection closed through app termination');
            process.exit(0);
        } catch (err) {
            console.error('Error during MongoDB disconnect:', err);
            process.exit(1);
        }
    });
}
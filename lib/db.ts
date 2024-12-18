import mongoose from "mongoose";
const DB_CONNECT_URI = process.env.MONGODB_URI!;

if (!DB_CONNECT_URI) {
    throw new Error('Please define the DB_CONNECT_URI environment variable inside .env');
}

// Global type definition
declare global {
    var mongoose: {
        promise: Promise<typeof mongoose> | null;
        conn: typeof mongoose | null;
    } | undefined;
}

// Cached connection type
type CachedConnection = {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
} | undefined;

// Initialize cache
const cached: CachedConnection | any = global.mongoose ?? {
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null,
    };
}

async function connectDB() {
    try {
        // Agar connection already exist karta hai
        if (cached?.conn) {
            console.log("Using existing database connection");
            // console.log("connection",cached.promise);
            // console.log("data",cached);
            return cached.conn;
        }

        // Agar koi promise already pending hai
        if (!cached?.promise) {
            const opts = {
                bufferCommands: false,
            };

            try {
                // Naya connection create karo
                const mongooseInstance = await mongoose.connect(DB_CONNECT_URI!, opts);
                if (cached) {
                    cached.promise = Promise.resolve(mongooseInstance);
                }
                console.log("New database connection established");

                // Connection events ko handle karo
                mongoose.connection.on('connected', () => {
                    console.log('MongoDB connected successfully');
                });

                mongoose.connection.on('error', (err) => {
                    console.log('MongoDB connection error:', err);
                });

                mongoose.connection.on('disconnected', () => {
                    console.log('MongoDB disconnected');
                });

                return mongooseInstance;
            } catch (error) {
                console.error("Error in creating new connection:", error);
                if (cached) {
                    cached.promise = null;
                }
                throw error;
            }
        }

        if (cached) {
            cached.conn = await cached.promise;
            return cached.conn;
        }

    } catch (error) {
        console.error("Database connection error:", error);
        // Connection fail hone par cache clear karo
        if (cached) {
            cached.promise = null;
            cached.conn = null;
        }
        throw error;
    }
}

export default connectDB;
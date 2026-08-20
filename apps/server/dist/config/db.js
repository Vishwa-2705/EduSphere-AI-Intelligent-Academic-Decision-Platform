"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const User_1 = require("../models/User");
const seed_1 = require("../seed/seed");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.ENV.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
        // Auto-seed if database is empty
        const userCount = await User_1.User.countDocuments();
        if (userCount === 0) {
            console.log('[MongoDB] Database is empty. Running initial seed...');
            await (0, seed_1.seedDatabase)(false);
        }
    }
    catch (error) {
        console.error(`[MongoDB] Connection error: ${error.message}`);
        console.warn(`[MongoDB] Note: Running without active MongoDB connection. Ensure MongoDB service is running.`);
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('[MongoDB] Disconnected from MongoDB');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error(`[MongoDB] Runtime error: ${err.message}`);
});

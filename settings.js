import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

// Load environment variables
dotenv.config()

// Get current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const botConfig = {
    // Bot Info
    name: process.env.BOT_NAME || 'Chanda-MD',
    prefix: process.env.PREFIX || '!',
    
    // Owner Info
    ownerName: 'Your Name',
    ownerNumber: ['1234567890'],
    
    // Session
    sessionFolder: process.env.SESSION_FOLDER || 'auth_info_baileys',
    sessionPath: join(__dirname, '..', process.env.SESSION_FOLDER || 'auth_info_baileys'),
    
    // Debug
    debugMode: process.env.DEBUG_MODE === 'true',
    logLevel: process.env.LOG_LEVEL || 'silent',
    
    // Connection
    reconnectInterval: parseInt(process.env.RECONNECT_INTERVAL) || 5000,
    maxRetries: parseInt(process.env.MAX_RETRIES) || 5,
    
    // Performance
    processMessages: process.env.PROCESS_MESSAGES === 'true',
    autoRead: process.env.AUTO_READ === 'true',
    alwaysOnline: process.env.ALWAYS_ONLINE === 'true',
    
    // Message Settings
    replyPrefix: '️「 Chanda-MD 」',
    footer: '© 2023 Chanda-MD Bot',
    
    // Feature Toggles
    antiSpam: true,
    antiLink: true,
    antiToxic: true,
    
    // Limits
    maxFileSize: 100, // in MB
    maxProcessTime: 30000, // in ms
    
    // API Keys (add your own keys)
    openaiKey: process.env.OPENAI_KEY || '',
    rapidApiKey: process.env.RAPID_API_KEY || '',
    
    // Database
    useMongoDB: false,
    mongoUrl: process.env.MONGO_URL || '',
    
    // Media Settings
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    bannerUrl: 'https://example.com/banner.jpg'
}

export const messageResponses = {
    notOwner: '⚠️ This command can only be used by the owner!',
    notAdmin: '⚠️ This command can only be used by admins!',
    notGroup: '⚠️ This command can only be used in groups!',
    success: '✅ Command executed successfully!',
    error: '❌ An error occurred while executing the command!',
    invalidFormat: '⚠️ Invalid command format! Please check !help for usage.',
    cooldown: '⚠️ Please wait before using this command again.',
    maintenance: '🛠️ This feature is currently under maintenance.'
}

export const permissionLevels = {
    OWNER: 'owner',
    ADMIN: 'admin',
    USER: 'user'
}

export default {
    botConfig,
    messageResponses,
    permissionLevels
}

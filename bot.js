import { default as makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import * as fs from 'fs'
import P from 'pino'

const logger = P()

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: P({ level: 'silent' })
    })

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            console.log('Connection closed due to:', lastDisconnect?.error, 'Reconnecting:', shouldReconnect)

            if (shouldReconnect) {
                connectToWhatsApp()
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp!')
        }
    })

    // Save credentials whenever updated
    sock.ev.on('creds.update', saveCreds)

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]

        if (!m.message) return
        const messageType = Object.keys(m.message)[0]
        
        // Don't respond to status broadcasts
        if (m.key.remoteJid === 'status@broadcast') return

        if (messageType === 'conversation') {
            const text = m.message.conversation.toLowerCase()

            // Basic command handling
            if (text === '!ping') {
                await sock.sendMessage(m.key.remoteJid, { text: 'Pong! 🏓' })
            } else if (text === '!help') {
                const helpText = `
*Chanda-MD Bot Commands*
• !ping - Check if bot is alive
• !help - Show this help message
                `.trim()
                await sock.sendMessage(m.key.remoteJid, { text: helpText })
            }
        }
    })
}

// Create auth_info_baileys directory if it doesn't exist
if (!fs.existsSync('./auth_info_baileys')) {
    fs.mkdirSync('./auth_info_baileys')
}

// Start the bot
connectToWhatsApp()

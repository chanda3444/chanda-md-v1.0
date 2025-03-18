import ytdl from 'ytdl-core'
import yts from 'yt-search'
import fs from 'fs'
import { join } from 'path'
import { botConfig, messageResponses } from './settings.js'
import ffmpeg from 'fluent-ffmpeg'

export class YouTubePlayer {
    constructor() {
        this.tempDir = join(process.cwd(), 'temp')
        this.ensureTempDir()
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir)
        }
    }

    async search(query) {
        try {
            const results = await yts(query)
            return results.videos.length > 0 ? results.videos[0] : null
        } catch (error) {
            console.error('Error searching YouTube:', error)
            return null
        }
    }

    async downloadAudio(videoUrl, filename) {
        return new Promise((resolve, reject) => {
            const outputPath = join(this.tempDir, filename)
            const stream = ytdl(videoUrl, {
                quality: 'highestaudio',
                filter: 'audioonly'
            })

            ffmpeg(stream)
                .audioBitrate(128)
                .toFormat('mp3')
                .save(outputPath)
                .on('end', () => resolve(outputPath))
                .on('error', reject)
        })
    }

    async cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        } catch (error) {
            console.error('Error cleaning up file:', error)
        }
    }

    async handlePlayCommand(sock, message, query) {
        try {
            // Send searching message
            await sock.sendMessage(message.key.remoteJid, {
                text: `🔍 Searching for: ${query}`
            })

            // Search for the video
            const video = await this.search(query)
            if (!video) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ No results found!'
                })
                return
            }

            // Send found message
            await sock.sendMessage(message.key.remoteJid, {
                text: `🎵 Found: ${video.title}\n⏱️ Duration: ${video.duration.timestamp}\n👤 Channel: ${video.author.name}`
            })

            // Download and convert to audio
            const filename = `${Date.now()}.mp3`
            const audioPath = await this.downloadAudio(video.url, filename)

            // Send audio file
            await sock.sendMessage(message.key.remoteJid, {
                audio: { url: audioPath },
                mimetype: 'audio/mp3',
                fileName: `${video.title}.mp3`
            })

            // Cleanup
            await this.cleanupFile(audioPath)

        } catch (error) {
            console.error('Error in play command:', error)
            await sock.sendMessage(message.key.remoteJid, {
                text: messageResponses.error
            })
        }
    }
}

export const player = new YouTubePlayer()

export default {
    command: 'play',
    description: 'Play audio from YouTube',
    usage: '!play <song name or URL>',
    async handler(sock, message, args) {
        if (!args.length) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '⚠️ Please provide a song name or YouTube URL!'
            })
            return
        }

        const query = args.join(' ')
        await player.handlePlayCommand(sock, message,

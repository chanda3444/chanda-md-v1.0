# Chanda-MD WhatsApp Bot

A WhatsApp bot built with the Baileys library that provides various features and commands.

## Features

- Easy to set up and use
- Built with Baileys library
- Supports multiple commands
- QR code authentication
- Auto-reconnect functionality

## Installation

1. Clone the repository:
```bash
git clone https://github.com/chanda3444/chanda-md.git
cd chanda-md
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
npm start
```

## Usage

When you first run the bot, it will generate a QR code in the terminal. Scan this QR code with WhatsApp to authenticate the bot.

### Available Commands

- `!ping` - Check if the bot is active
- `!help` - Display list of available commands

## Configuration

The bot uses the following dependencies:
- @whiskeysockets/baileys - Main WhatsApp Web API library
- @hapi/boom - Error handling
- pino - Logging utility
- qrcode-terminal - QR code generation in terminal

## Development

To run the bot in development mode with auto-reload:
```bash
npm run dev
```

## Authentication

The bot stores authentication data in the `auth_info_baileys` directory. This allows the bot to reconnect without requiring QR code scanning every time.

## Contributing

Feel free to fork this repository and submit pull requests to contribute to this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

/**
 * Simple Telegram Bot Handler
 * 
 * This is an optional server-side handler for your Telegram bot.
 * It can respond to commands and provide basic bot functionality.
 * 
 * To use this:
 * 1. Install: npm install node-telegram-bot-api
 * 2. Create .env.local file with: TELEGRAM_BOT_TOKEN=your_token_here
 * 3. Run: node bot-handler.js
 * 
 * For production, deploy this as a separate service (e.g., on Railway, Render, or Vercel Serverless)
 * 
 * ⚠️ SECURITY: Never commit your bot token to git!
 */

const TelegramBot = require('node-telegram-bot-api');

// Get bot token from environment variable
// ⚠️ NEVER hardcode your bot token! Always use environment variables.
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('❌ ERROR: TELEGRAM_BOT_TOKEN environment variable is not set!');
  console.error('Set it in your .env.local file or as an environment variable.');
  process.exit(1);
}

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

// Web App URL (your deployed app)
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://cryptoolate.com';

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;

  bot.sendMessage(chatId, `👋 Welcome ${firstName}!\n\n` +
    `🚀 Manage Solana - Your Solana Wallet Toolkit\n\n` +
    `Click the button below to open the app:`, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🚀 Open Manage Solana',
          web_app: { url: WEB_APP_URL }
        }
      ]]
    }
  });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `📚 *Manage Solana - Help*\n\n` +
    `*Available Tools:*\n` +
    `💰 The Rent Finder - Reclaim rent from empty accounts\n` +
    `🔥 The Spam Burner - Burn spam NFTs and tokens\n` +
    `🔒 Permissions Revoke - Revoke risky token approvals\n\n` +
    `*How to Use:*\n` +
    `1. Click the menu button or use /start\n` +
    `2. Connect your Solana wallet\n` +
    `3. Choose a tool from the dashboard\n` +
    `4. Follow the on-screen instructions\n\n` +
    `*Security:*\n` +
    `✅ Non-custodial - We never touch your private keys\n` +
    `✅ Atomic transactions - All or nothing\n` +
    `✅ Open source - Review the code\n\n` +
    `Need help? Visit: ${WEB_APP_URL}`, {
    parse_mode: 'Markdown'
  });
});

// Handle web app data (when user interacts with Mini App)
bot.on('message', (msg) => {
  // If message contains web_app_data, handle it
  if (msg.web_app_data) {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app_data.data);
    
    // Handle data from Mini App if needed
    console.log('Received data from Mini App:', data);
    
    bot.sendMessage(chatId, '✅ Data received from Mini App!');
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Startup message
console.log('🤖 Telegram Bot Handler Started');
console.log(`📱 Web App URL: ${WEB_APP_URL}`);
console.log('✅ Bot is ready to receive commands');

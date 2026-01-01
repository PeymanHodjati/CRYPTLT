import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://cryptoolate.com';

export async function POST(req: Request) {
  try {
    // Verify bot token is configured
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN is not configured');
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const body = await req.json();
    
    // Handle /start command
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      const firstName = body.message.from?.first_name || 'there';
      
      // Send welcome message with Mini App button
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `👋 *Welcome to Manage Solana, ${firstName}!*\n\n` +
                `🚀 *Your Solana Wallet Toolkit*\n\n` +
                `I can help you:\n` +
                `💰 Reclaim rent from empty accounts\n` +
                `🔥 Burn spam NFTs and tokens\n` +
                `🪙 Swap small balances to SOL\n` +
                `🔒 Revoke risky permissions\n\n` +
                `Click the button below to get started!`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '🚀 Open Manage Solana', 
                web_app: { url: WEB_APP_URL } 
              }]
            ]
          }
        })
      });
    }
    
    // Handle /help command
    if (body.message && body.message.text === '/help') {
      const chatId = body.message.chat.id;
      
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `📚 *Manage Solana - Help*\n\n` +
                `*Available Tools:*\n` +
                `💰 *The Rent Finder* - Reclaim rent from empty token accounts\n` +
                `🔥 *The Spam Burner* - Burn spam NFTs and tokens, reclaim rent\n` +
                `🪙 *Loose Change Collector* - Batch swap small token balances into SOL\n` +
                `🔒 *Permissions Revoke* - Revoke risky token approvals (free)\n\n` +
                `*How to Use:*\n` +
                `1. Click the button below to open the app\n` +
                `2. Connect your Solana wallet (Phantom, Solflare, or Backpack)\n` +
                `3. Choose a tool from the dashboard\n` +
                `4. Follow the on-screen instructions\n\n` +
                `*Security:*\n` +
                `✅ Non-custodial - We never touch your private keys\n` +
                `✅ Atomic transactions - All or nothing\n` +
                `✅ Transparent - Review all transactions before signing\n\n` +
                `Need more help? Visit: ${WEB_APP_URL}`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ 
                text: '🚀 Open App', 
                web_app: { url: WEB_APP_URL } 
              }]
            ]
          }
        })
      });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ 
    message: 'Telegram bot webhook endpoint',
    status: 'active',
    instructions: 'Set webhook URL to: https://cryptoolate.com/api/bot'
  });
}

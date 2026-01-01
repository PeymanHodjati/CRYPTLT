import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://cryptoolate.com';

export async function POST(req: Request) {
  try {
    // Verify bot token is configured
    if (!BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN is not configured');
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const body = await req.json();
    console.log('📥 Received webhook update:', JSON.stringify(body, null, 2));
    
    // Handle /start command (also handles /start with parameters)
    if (body.message && body.message.text && body.message.text.startsWith('/start')) {
      const chatId = body.message.chat.id;
      const firstName = body.message.from?.first_name || 'there';
      
      console.log(`📤 Sending welcome message to chat ${chatId}`);
      
      // Send welcome message with Mini App button
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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

      const result = await response.json();
      if (!result.ok) {
        console.error('❌ Telegram API error:', result);
      } else {
        console.log('✅ Welcome message sent successfully');
      }
    }
    
    // Handle /help command
    else if (body.message && body.message.text && body.message.text.startsWith('/help')) {
      const chatId = body.message.chat.id;
      
      console.log(`📤 Sending help message to chat ${chatId}`);
      
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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

      const result = await response.json();
      if (!result.ok) {
        console.error('❌ Telegram API error:', result);
      } else {
        console.log('✅ Help message sent successfully');
      }
    } else {
      console.log('ℹ️ Received update but no matching command:', body.message?.text || 'no text');
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    return NextResponse.json({ error: 'Failed to process webhook', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  const hasToken = !!BOT_TOKEN;
  return NextResponse.json({ 
    message: 'Telegram bot webhook endpoint',
    status: 'active',
    hasToken: hasToken,
    webAppUrl: WEB_APP_URL,
    instructions: 'Set webhook URL to: https://www.managesolana.com/api/bot',
    note: hasToken ? 'Bot token is configured' : '⚠️ Bot token is NOT configured - add TELEGRAM_BOT_TOKEN to Vercel environment variables'
  });
}

# Telegram Bot Setup Guide

## Bot Information
- **Bot Username**: @ManageSolanaBot
- **Bot Link**: https://t.me/ManageSolanaBot
- **Bot Token**: Get it from @BotFather (send `/mybots` → select your bot → "API Token")

## Step 1: Set Webhook (Required for Bot Responses)

After deploying to Vercel, you need to tell Telegram where to send messages.

**Option A: Using Browser (Easiest)**
Open this URL in your browser (replace with your bot token and domain):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot
```

**Option B: Using curl**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot"
```

**Verify webhook is set:**
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

## Step 2: Configure Web App URL (Menu Button)

1. Open Telegram and search for **@BotFather**
2. Send the command: `/mybots`
3. Select **ManageSolanaBot**
4. Choose **Bot Settings** → **Menu Button**
5. Choose **Configure Menu Button**
6. Enter the following:
   - **Button Text**: "Open App" (or "Manage Solana")
   - **Web App URL**: `https://cryptoolate.com` (or your Vercel deployment URL)

Alternatively, you can use the command:
```
/setmenubutton
@ManageSolanaBot
Open App
https://cryptoolate.com
```

## Step 3: Set Bot Description

Set a description for your bot:
```
/setdescription
@ManageSolanaBot
Manage your Solana wallet with powerful tools: reclaim rent, burn spam, swap dust, and revoke permissions.
```

## Step 4: Set Bot Commands

Set up commands users can use:
```
/setcommands
@ManageSolanaBot
start - Open the Manage Solana app
help - Get help about the app
```

## Step 5: Test the Bot

1. Open Telegram
2. Search for **@ManageSolanaBot**
3. Click **Start** - You should receive a welcome message with a button to open the app
4. Click the menu button - The Mini App should open with your dashboard

1. Open Telegram
2. Search for **@ManageSolanaBot**
3. Click **Start** or the menu button
4. The Mini App should open with your dashboard

## Environment Variables

Make sure your Vercel deployment has these environment variables set:

**Required:**
- `NEXT_PUBLIC_PROJECT_ID` - Your Reown Project ID
- `NEXT_PUBLIC_TREASURY_WALLET` - Your treasury wallet address
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token (for webhook responses)

**Optional:**
- `NEXT_PUBLIC_RPC_URL` - Your RPC endpoint (defaults to public Solana RPC)
- `NEXT_PUBLIC_WEB_APP_URL` - Your web app URL (defaults to https://cryptoolate.com)

### Adding Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - `TELEGRAM_BOT_TOKEN` = Your bot token from @BotFather (send `/mybots` → select your bot → "API Token")
   - `NEXT_PUBLIC_PROJECT_ID` = Your Reown Project ID
   - `NEXT_PUBLIC_TREASURY_WALLET` = Your treasury wallet address
4. **Redeploy** your project after adding variables

## Bot Token Security

⚠️ **IMPORTANT**: Never commit the bot token to your repository!

The bot token is sensitive. Always store it in environment variables:
- `TELEGRAM_BOT_TOKEN` - Your bot token (server-side only)

**If your token is ever exposed:**
1. Go to @BotFather
2. Send `/revoke` and select your bot
3. This will generate a new token
4. Update your environment variables with the new token
5. Redeploy your Vercel project

## Optional: Bot Handler

If you want the bot to respond to commands (beyond just opening the Mini App), you can set up a simple bot handler. See `bot-handler.js` for an example.

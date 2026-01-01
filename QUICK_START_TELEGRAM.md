# Quick Start: Telegram Bot Configuration

## Your Bot Information
- **Bot Username**: @ManageSolanaBot
- **Bot Link**: https://t.me/ManageSolanaBot
- **Bot Token**: Get it from @BotFather (send `/mybots` → select your bot → "API Token") ⚠️ Keep this secret!

## Step 1: Add Bot Token to Vercel (Required)

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add: `TELEGRAM_BOT_TOKEN` = Your bot token from @BotFather
   - To get your token: Open @BotFather → `/mybots` → Select your bot → "API Token"
4. **Redeploy** your project

## Step 2: Set Webhook (Required for Bot Responses)

After deploying, set the webhook so the bot can respond to `/start`:

Open this URL in your browser (replace `<YOUR_BOT_TOKEN>` with your actual token):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot
```

**To get your bot token:**
1. Open Telegram and search for @BotFather
2. Send `/mybots` and select your bot
3. Choose "API Token" to view your token

You should see: `{"ok":true,"result":true,"description":"Webhook was set"}`

## Step 3: Configure Menu Button

This makes the bot show a button that opens your Mini App.

1. Open Telegram
2. Search for **@BotFather**
3. Send: `/setmenubutton`
4. When asked, select: `@ManageSolanaBot`
5. Enter button text: `Open App`
6. Enter Web App URL: `https://cryptoolate.com` (or your Vercel URL)

**Done!** Users can now click the menu button to open your app.

## Step 4: Set Bot Description (Optional but Recommended)

1. In @BotFather, send: `/setdescription`
2. Select: `@ManageSolanaBot`
3. Enter description:
   ```
   Manage your Solana wallet with powerful tools: reclaim rent, burn spam, swap dust, and revoke permissions.
   ```

## Step 5: Set Bot Commands (Optional)

1. In @BotFather, send: `/setcommands`
2. Select: `@ManageSolanaBot`
3. Enter commands:
   ```
   start - Open the Manage Solana app
   help - Get help about the app
   ```

## Step 6: Test It!

1. Open Telegram
2. Search for **@ManageSolanaBot**
3. Click **Start** - You should receive a welcome message! 👋
4. Click the "🚀 Open Manage Solana" button in the message
5. Or click the menu button at the bottom
6. Your Mini App should open! 🎉

## Troubleshooting

### Bot not responding to /start?
- Make sure you completed Step 1 (added TELEGRAM_BOT_TOKEN to Vercel)
- Make sure you completed Step 2 (set the webhook)
- Verify webhook is set: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Vercel function logs for errors

### Menu button not showing?
- Make sure you completed Step 3 correctly
- Try restarting Telegram
- Check that the Web App URL is accessible (HTTPS required)

### App not loading?
- Verify your Vercel deployment is live
- Check that the URL in the menu button matches your deployment
- Make sure environment variables are set in Vercel

### Need help?
See `TELEGRAM_BOT_SETUP.md` for more detailed instructions.

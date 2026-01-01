# Telegram Webhook Setup Guide

## What is a Webhook?

A webhook allows Telegram to send messages to your bot when users interact with it. This enables your bot to respond to `/start` and `/help` commands.

## Quick Setup (After Deploying to Vercel)

### Step 1: Add Bot Token to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `TELEGRAM_BOT_TOKEN`
   - **Value**: Get your bot token from @BotFather (send `/token` to your bot in @BotFather)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your project (go to Deployments → ... → Redeploy)

### Step 2: Set the Webhook

After your Vercel deployment is live, set the webhook URL:

**Option A: Using Browser (Easiest)**

Open this URL in your browser (replace `<YOUR_BOT_TOKEN>` with your actual token):
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot
```

**Option B: Using curl**

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot"
```

**To get your bot token:**
1. Open Telegram and search for @BotFather
2. Send `/mybots` and select your bot
3. Choose "API Token" to view your token

**Expected Response:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

### Step 3: Verify Webhook is Set

Check that the webhook is configured correctly (replace `<YOUR_BOT_TOKEN>` with your actual token):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

**Expected Response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://cryptoolate.com/api/bot",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

### Step 4: Test It!

1. Open Telegram
2. Search for **@ManageSolanaBot**
3. Click **Start**
4. You should receive a welcome message with a button to open the app! 🎉

## Troubleshooting

### Bot not responding?

1. **Check Vercel Environment Variables**
   - Make sure `TELEGRAM_BOT_TOKEN` is set
   - Make sure you redeployed after adding it

2. **Check Webhook Status**
   - Visit: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
   - Make sure `url` matches your deployment URL
   - Check `pending_update_count` - if it's high, there might be errors

3. **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/bot` function
   - Check for any errors in the logs

4. **Test the Endpoint Directly**
   - Visit: `https://cryptoolate.com/api/bot` in your browser
   - You should see: `{"message":"Telegram bot webhook endpoint","status":"active"}`

### Webhook URL not working?

- Make sure your Vercel deployment is live
- Make sure the URL uses HTTPS (required by Telegram)
- Make sure the `/api/bot` route is accessible
- Check that your domain is properly configured in Vercel

### Getting 403 or 500 errors?

- Verify `TELEGRAM_BOT_TOKEN` is set correctly in Vercel
- Make sure you redeployed after adding the environment variable
- Check Vercel function logs for specific error messages

## Removing the Webhook

If you need to remove the webhook (to stop receiving updates):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

## Security Notes

⚠️ **Never commit your bot token to git!**

- The bot token is stored in Vercel environment variables (server-side only)
- The token is never exposed to the client
- If your token is ever exposed, revoke it in @BotFather and generate a new one

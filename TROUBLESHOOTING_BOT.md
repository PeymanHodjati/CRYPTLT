# Troubleshooting: Bot Not Responding to /start

## Quick Checklist

1. ✅ **Is the webhook set?**
   - Check: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo`
   - Should show: `"url": "https://cryptoolate.com/api/bot"`

2. ✅ **Is TELEGRAM_BOT_TOKEN set in Vercel?**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure `TELEGRAM_BOT_TOKEN` is set
   - **Important**: Redeploy after adding environment variables!

3. ✅ **Is the API endpoint accessible?**
   - Visit: `https://cryptoolate.com/api/bot` in your browser
   - Should show: `{"message":"Telegram bot webhook endpoint","status":"active"}`

4. ✅ **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/bot` function
   - Look for error messages or logs

## Step-by-Step Debugging

### Step 1: Verify Webhook is Set

Replace `<YOUR_BOT_TOKEN>` with your actual token:

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

**If webhook is not set:**
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot
```

### Step 2: Check Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify `TELEGRAM_BOT_TOKEN` exists
5. If you just added it, **redeploy** your project:
   - Go to **Deployments**
   - Click the three dots on the latest deployment
   - Click **Redeploy**

### Step 3: Check Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on **Functions** tab
3. Find `/api/bot` function
4. Click on it to see logs
5. Look for:
   - `❌ TELEGRAM_BOT_TOKEN is not configured` → Token not set
   - `📥 Received webhook update` → Webhook is working, check what was received
   - `❌ Telegram API error` → Check the error details

### Step 4: Test the Endpoint Manually

Visit in your browser:
```
https://cryptoolate.com/api/bot
```

Should return:
```json
{
  "message": "Telegram bot webhook endpoint",
  "status": "active",
  "instructions": "Set webhook URL to: https://cryptoolate.com/api/bot"
}
```

### Step 5: Send a Test Message

1. Open Telegram
2. Search for **@ManageSolanaBot**
3. Send `/start`
4. Check Vercel function logs immediately after
5. Look for log entries showing the webhook was received

## Common Issues

### Issue: "Bot token not configured"

**Solution:**
1. Add `TELEGRAM_BOT_TOKEN` to Vercel environment variables
2. **Redeploy** your project (important!)

### Issue: Webhook returns 500 error

**Check:**
- Is `TELEGRAM_BOT_TOKEN` set correctly?
- Are there any syntax errors in the function logs?
- Is the bot token valid? (Get it from @BotFather)

### Issue: Webhook is set but bot doesn't respond

**Check:**
- Vercel function logs for errors
- Make sure you redeployed after adding environment variables
- Verify the webhook URL matches your deployment URL exactly

### Issue: "pending_update_count" is high

This means Telegram is trying to send updates but they're failing.

**Solution:**
1. Check Vercel function logs for errors
2. Fix any errors in the function
3. The pending updates will be retried automatically

## Still Not Working?

1. **Revoke and regenerate bot token:**
   - Go to @BotFather
   - Send `/revoke`
   - Select your bot
   - Update `TELEGRAM_BOT_TOKEN` in Vercel
   - Redeploy

2. **Remove and re-set webhook:**
   ```
   https://api.telegram.org/bot<TOKEN>/deleteWebhook
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://cryptoolate.com/api/bot
   ```

3. **Check Vercel deployment status:**
   - Make sure your latest deployment is successful
   - Check for any build errors

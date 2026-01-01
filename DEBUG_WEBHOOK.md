# Debug: Bot Not Responding to /start

## Issue
No requests are appearing in Vercel logs for `/api/bot` endpoint when sending `/start` to the bot.

## Step 1: Verify Webhook is Set

Replace `<YOUR_BOT_TOKEN>` with your actual token from @BotFather:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

**Expected Response:**
```json
{
  "ok": true,
  "result": {
    "url": "https://www.managesolana.com/api/bot",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

**If webhook is NOT set or URL is wrong:**
1. Set it to your correct domain:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://www.managesolana.com/api/bot
```

**Important:** Make sure the URL matches your actual Vercel deployment URL exactly!

## Step 2: Test the Endpoint Directly

Visit in your browser:
```
https://www.managesolana.com/api/bot
```

Should return:
```json
{
  "message": "Telegram bot webhook endpoint",
  "status": "active",
  "instructions": "Set webhook URL to: https://cryptoolate.com/api/bot"
}
```

If this doesn't work, the endpoint isn't deployed correctly.

## Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Functions** tab
4. Look for `/api/bot` function
5. Check for any errors or logs

If you don't see the function listed, it might not be deployed.

## Step 4: Verify Environment Variable

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Make sure `TELEGRAM_BOT_TOKEN` is set
3. **Redeploy** after adding/updating environment variables

## Step 5: Test Webhook Manually

You can simulate a webhook request using curl:

```bash
curl -X POST https://www.managesolana.com/api/bot \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "text": "/start",
      "chat": {
        "id": 123456789
      },
      "from": {
        "first_name": "Test"
      }
    }
  }'
```

This should trigger the webhook handler and you should see logs in Vercel.

## Common Issues

### Issue 1: Webhook URL doesn't match deployment
- Make sure webhook URL matches your actual Vercel domain
- Check if you're using `www.managesolana.com` or `managesolana.com` (with/without www)
- Use the exact domain from your Vercel deployment

### Issue 2: HTTPS Certificate Issues
If Telegram can't verify your SSL certificate:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://www.managesolana.com/api/bot&certificate=<path_to_cert>
```

But usually Vercel handles this automatically.

### Issue 3: Function Not Deployed
- Make sure `app/api/bot/route.ts` exists
- Make sure it's committed and pushed to GitHub
- Check that Vercel has deployed the latest version

### Issue 4: Environment Variable Not Set
- `TELEGRAM_BOT_TOKEN` must be set in Vercel
- Must redeploy after adding environment variables

## Quick Fix Checklist

- [ ] Webhook is set to correct URL: `https://www.managesolana.com/api/bot`
- [ ] Endpoint is accessible: Visit `https://www.managesolana.com/api/bot` in browser
- [ ] `TELEGRAM_BOT_TOKEN` is set in Vercel environment variables
- [ ] Project has been redeployed after adding environment variable
- [ ] Function appears in Vercel Functions tab
- [ ] No errors in Vercel function logs

# Fix Webhook: Wrong Domain

## Problem
Your webhook is set to `https://cryptoolate.com/api/bot` but your actual domain is `www.managesolana.com`. This is causing 404 errors.

## Solution: Update Webhook URL

Replace `<YOUR_BOT_TOKEN>` with your actual token and run this:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://www.managesolana.com/api/bot
```

**Expected Response:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

## Verify It's Fixed

1. Check webhook status:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

Should show:
```json
{
  "ok": true,
  "result": {
    "url": "https://www.managesolana.com/api/bot",
    "pending_update_count": 0,
    "last_error_message": ""
  }
}
```

2. Test the endpoint:
Visit `https://www.managesolana.com/api/bot` in your browser - should return JSON

3. Send `/start` to your bot - should work now!

## Clear Pending Updates

After fixing the webhook, the 6 pending updates will be retried automatically. If you want to clear them manually:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook?drop_pending_updates=true
```

Then set it again:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://www.managesolana.com/api/bot
```

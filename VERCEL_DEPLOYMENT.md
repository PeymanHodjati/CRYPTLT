# Vercel Deployment Guide for Cryptoolate

## Pre-Deployment Checklist

✅ **Project ID**: `4f3ea9c03e7ad4ba1dda5f7c59a6f39a`  
✅ **Treasury Wallet**: `3LdJReJo1VxMjkNukZpZ9yanxzSXcW596eFWu9bB6Tq9`  
✅ **Build Status**: Passing  

## Step-by-Step Vercel Deployment

### 1. Push to GitHub (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Cryptoolate Telegram Mini App"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables

**IMPORTANT**: Add these in Vercel Dashboard → Project Settings → Environment Variables:

#### Required Variables:

```
NEXT_PUBLIC_PROJECT_ID=4f3ea9c03e7ad4ba1dda5f7c59a6f39a
```

```
NEXT_PUBLIC_TREASURY_WALLET=3LdJReJo1VxMjkNukZpZ9yanxzSXcW596eFWu9bB6Tq9
```

#### Optional (for production RPC):

```
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

**Note**: For production, consider using a paid RPC like Helius or QuickNode for better reliability.

### 4. Deploy Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (or `cryptoolate` if deploying from parent directory)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 5. Deploy!

Click **"Deploy"** and wait for the build to complete.

## Post-Deployment

### 1. Get Your Deployment URL

After deployment, Vercel will give you a URL like:
- `https://cryptoolate-xyz.vercel.app`

### 2. Configure Telegram Bot

1. Open Telegram
2. Search for `@BotFather`
3. Create a new bot: `/newbot`
4. Create a Mini App: `/newapp`
5. Select your bot
6. Upload a 640x360 image (screenshot of your app)
7. Set **Web App URL** to your Vercel URL
8. Configure menu button: `/mybots` → Select bot → "Bot Settings" → "Menu Button"

### 3. Test Your Deployment

1. Open your bot in Telegram
2. Click the menu button or Mini App link
3. Test the full flow:
   - Connect wallet
   - Scan for accounts
   - Claim accounts (test with small amounts first!)

## Environment Variables Summary

Copy these for Vercel:

```
NEXT_PUBLIC_PROJECT_ID=4f3ea9c03e7ad4ba1dda5f7c59a6f39a
NEXT_PUBLIC_TREASURY_WALLET=3LdJReJo1VxMjkNukZpZ9yanxzSXcW596eFWu9bB6Tq9
```

## Troubleshooting

### Build Fails
- Check that all environment variables are set in Vercel
- Verify the Project ID is correct
- Check build logs in Vercel dashboard

### Wallet Won't Connect
- Verify Project ID is correct
- Check browser console for errors
- Ensure HTTPS is enabled (Vercel provides this automatically)

### Transactions Fail
- Verify treasury wallet address is correct
- Check Solana RPC endpoint is working
- Test with small amounts first

## Production Recommendations

1. **Custom Domain**: Add a custom domain in Vercel for better trust
2. **RPC Endpoint**: Use Helius or QuickNode for production ($49/mo)
3. **Monitoring**: Set up Vercel Analytics
4. **Error Tracking**: Consider Sentry for error monitoring

## Support

If you encounter issues:
- Check Vercel build logs
- Check browser console
- Verify environment variables are set correctly
- Test locally first: `npm run dev`

Good luck with your deployment! 🚀

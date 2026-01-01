# Deployment Guide

## Quick Start

### 1. Get Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID
5. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_PROJECT_ID=your_project_id_here
   ```

### 2. Configure Treasury Wallet

Edit `utils/config.ts`:
```typescript
export const TREASURY_WALLET = new PublicKey("YOUR_WALLET_ADDRESS_HERE");
```

Replace with your Solana wallet address where fees will be sent.

### 3. Set Up RPC (Recommended for Production)

For production, use a paid RPC provider:

**Option A: Helius**
1. Sign up at [Helius](https://helius.dev)
2. Get your API key
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
   ```

**Option B: QuickNode**
1. Sign up at [QuickNode](https://quicknode.com)
2. Create a Solana endpoint
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RPC_URL=https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_KEY
   ```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEXT_PUBLIC_RPC_URL` (optional)
6. Click "Deploy"

### 5. Configure Telegram Bot

1. Open Telegram
2. Search for `@BotFather`
3. Create a new bot: `/newbot`
4. Follow the prompts to name your bot
5. Create a Mini App: `/newapp`
6. Select your bot
7. Upload a 640x360 image (screenshot of your app)
8. Set Web App URL to your Vercel URL (e.g., `https://cryptoolate.vercel.app`)
9. Configure menu button: `/mybots` → Select your bot → "Bot Settings" → "Menu Button" → "Configure Menu Button" → Set text and URL

## Testing

### Local Testing

1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Test wallet connection
4. Test scanning (use a test wallet with empty accounts)

### Telegram Testing

1. Deploy to Vercel
2. Open your bot in Telegram
3. Click the menu button or Mini App link
4. Test the full flow:
   - Connect wallet
   - Scan for accounts
   - Claim accounts

## Troubleshooting

### Wallet Connection Issues

- Ensure you have a valid Reown Project ID
- Check that your RPC endpoint is working
- Try a different wallet (Phantom, Solflare, Backpack)

### Transaction Failures

- Check that the user has enough SOL for transaction fees
- Verify the treasury wallet address is correct
- Check RPC endpoint is not rate-limited

### Telegram Mini App Not Loading

- Ensure your Vercel deployment uses HTTPS
- Check that the URL in BotFather matches your deployment
- Verify the app is accessible from mobile browsers

## Production Checklist

- [ ] Reown Project ID configured
- [ ] Treasury wallet address set
- [ ] Paid RPC endpoint configured (recommended)
- [ ] Deployed to Vercel
- [ ] Telegram bot configured
- [ ] Tested wallet connection
- [ ] Tested transaction flow
- [ ] Tested on mobile device
- [ ] Tested with multiple wallets

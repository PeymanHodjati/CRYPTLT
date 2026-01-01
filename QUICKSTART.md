# Quick Start Guide

Get Cryptoolate running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd cryptoolate
npm install
```

## Step 2: Get Reown Project ID

1. Visit https://cloud.reown.com
2. Sign up (free)
3. Create a new project
4. Copy your Project ID

## Step 3: Create Environment File

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_PROJECT_ID=your_project_id_from_step_2
```

## Step 4: Set Your Treasury Wallet

Edit `utils/config.ts` and replace:
```typescript
export const TREASURY_WALLET = new PublicKey("YOUR_WALLET_ADDRESS_HERE");
```

With your Solana wallet address (where fees will be sent).

## Step 5: Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 6: Test It

1. Click "Connect Wallet"
2. Connect with Phantom, Solflare, or Backpack
3. The app will automatically scan for zombie accounts
4. If found, click "Claim All" to test the transaction

## Next Steps

- Deploy to Vercel (see DEPLOYMENT.md)
- Configure Telegram bot (see DEPLOYMENT.md)
- Set up paid RPC for production (recommended)

## Troubleshooting

**"Project ID not found" error:**
- Make sure you've added `NEXT_PUBLIC_PROJECT_ID` to `.env.local`
- Restart the dev server after adding the env variable

**Wallet won't connect:**
- Make sure you have Phantom/Solflare/Backpack installed
- Check browser console for errors
- Try a different wallet

**No accounts found:**
- This is normal if your test wallet doesn't have empty token accounts
- Try with a wallet that has traded many tokens

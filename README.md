# Manage Solana - Solana Toolkit Telegram Mini App

A comprehensive Telegram Mini App that provides multiple tools to manage and optimize your Solana wallet.

## Features

### 🛠️ Multi-Tool Dashboard
- **💰 The Rent Finder**: Reclaim rent from empty token accounts
- **🔥 The Spam Burner**: Burn spam NFTs and tokens, reclaim rent
- **🔒 Permissions Revoke**: Revoke risky token approvals (free)

### Core Features
- 🔍 **Automatic Scanning**: Finds zombie accounts, spam items, and permissions
- 💰 **Rent Reclamation**: Closes empty accounts to refund locked SOL
- 🔒 **Atomic Transactions**: Fees only charged if operations succeed
- 📱 **Mobile Optimized**: Built for Telegram's mobile interface
- ✨ **Glassmorphism UI**: Beautiful modern design with glass effects

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Wallet Connection**: Reown AppKit (formerly Web3Modal)
- **Blockchain**: Solana (@solana/web3.js, @solana/spl-token)
- **Telegram**: @twa-dev/sdk
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Reown Project ID

**IMPORTANT**: You MUST get a Project ID before building/running the app.

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Sign up for a free account (or sign in)
3. Click "Create Project" in the dashboard
4. Fill in your project details:
   - Name: Cryptoolate (or your preferred name)
   - Description: Telegram Mini App for reclaiming Solana rent
5. Copy your Project ID from the project details page

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Project ID:

```env
NEXT_PUBLIC_PROJECT_ID=your_actual_project_id_here
```

- **NEXT_PUBLIC_RPC_URL** (Optional): For production, use a paid RPC like Helius or QuickNode
  - Free tier: `https://api.mainnet-beta.solana.com`
  - Recommended: Helius or QuickNode ($49/mo for better reliability)

### 3. Configure Treasury Wallet

Edit `utils/config.ts` and replace `YOUR_WALLET_ADDRESS_HERE` with your Solana wallet address where fees will be sent.

```typescript
export const TREASURY_WALLET = new PublicKey("YOUR_WALLET_ADDRESS_HERE");
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Configure Telegram Bot

Your bot is already created: **@ManageSolanaBot**

1. Open Telegram and search for `@BotFather`
2. Send `/mybots` and select **ManageSolanaBot**
3. Choose **Bot Settings** → **Menu Button**
4. Choose **Configure Menu Button**
5. Enter:
   - **Button Text**: "Open App" (or "Manage Solana")
   - **Web App URL**: `https://cryptoolate.com` (or your Vercel deployment URL)

Alternatively, use the command:
```
/setmenubutton
@ManageSolanaBot
Open App
https://cryptoolate.com
```

**See `TELEGRAM_BOT_SETUP.md` for detailed setup instructions.**

## How It Works

### The Rent Finder
1. **User connects wallet** (Phantom, Solflare, or Backpack)
2. **App scans** for empty token accounts (0 balance)
3. **App calculates** total recoverable rent and fee
4. **User clicks "Claim"** and signs a single atomic transaction
5. **Transaction includes**:
   - Instructions to close all empty accounts (refunding rent)
   - One transfer instruction to send the fee to your treasury wallet
6. **If any close fails**, the entire transaction fails (user doesn't pay)

### The Spam Burner
1. **App scans** for NFTs and tokens in the wallet
2. **User selects** spam items to burn (up to 50 at once)
3. **User clicks "Incinerate"** - items are closed and rent is refunded
4. **15% fee** is taken from the refunded rent

### Permissions Revoke
1. **App scans** for active token approvals
2. **User reviews** risky permissions
3. **One-click revoke** - completely free

## Transaction Batching

Solana transactions have a size limit (~1232 bytes). The app automatically batches accounts:
- Max 20 accounts per transaction
- If user has 50 accounts, they'll see "Batch 1 of 3", "Batch 2 of 3", etc.

## Security Notes

- **Non-custodial only**: Only works with wallets where users hold their keys
- **No private keys**: The app never touches user private keys
- **Atomic transactions**: Users only pay if they successfully reclaim rent
- **Transparent**: All transaction details visible in wallet preview

## Revenue Model

- **Rent Finder**: 0.005 SOL (~$1) per claim transaction
- **Spam Burner**: 15% of refunded rent per burn
- **Permissions Revoke**: Free (no fees)

All fees are taken from reclaimed/optimized funds - users never pay extra.

## Support

For issues or questions, check:
- [Reown AppKit Docs](https://docs.reown.com/appkit)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)

## License

MIT

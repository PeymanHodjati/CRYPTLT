# Programmatic SEO System - "The Surgical Solution"

This system generates dynamic landing pages for frustrated users searching for specific token cleanup solutions.

## Strategy

**Target Keyword Pattern**: `"How to close empty [TOKEN_NAME] ([TICKER]) account"`

**URL Structure**: `managesolana.com/clean/[ticker]` (e.g., `/clean/bonk`, `/clean/wif`)

## How It Works

1. **Token Database**: `data/tokens.json` contains all token information
2. **Dynamic Pages**: `app/clean/[ticker]/page.tsx` generates pages for each token
3. **Static Generation**: All pages are pre-rendered at build time for maximum speed
4. **SEO Optimized**: Each page includes:
   - Unique title and description
   - Open Graph tags
   - Twitter Cards
   - FAQ Schema (for Google snippets)
   - Article structured data

## Adding New Tokens

### Method 1: Interactive Script (Recommended)

```bash
npm run add-token
```

The script will prompt you for:
- Token name (e.g., "Bonk")
- Ticker (e.g., "BONK")
- Mint Address (contract address)
- Description (unique, human-written)
- Fun Fact (makes content feel authentic)

### Method 2: Manual Edit

Edit `data/tokens.json` directly:

```json
{
  "name": "Token Name",
  "ticker": "TICKER",
  "mintAddress": "ContractAddressHere",
  "description": "Unique, human-written description. Avoid Wikipedia-style.",
  "funFact": "Something interesting that makes it feel authentic."
}
```

## Content Guidelines

### Descriptions

**❌ Bad (Wikipedia-style)**:
> "Bonk is a cryptocurrency token on the Solana blockchain."

**✅ Good (Human, unique)**:
> "The dog coin that saved Solana when everyone thought it was dead. It was airdropped to artists and devs."

### Fun Facts

Make them:
- Specific
- Interesting
- Unique to that token
- Not generic crypto facts

**Example for WIF**:
> "Literally just a dog with a hat. There is no utility, yet it is worth billions. Welcome to crypto."

## Posting Schedule

### Day 1: Top 10 Coins
- BONK, WIF, JUP, PYTH, RAY, ORCA, etc.
- High volume = high search volume

### Day 2: "Old" Coins
- SAMO, COPE, STEP, etc.
- Established tokens with active communities

### Day 3: Spam/Scam Tokens
- Random tokens people received
- Lower volume but high frustration = searches

### Ongoing: 10 tokens/day
- Add 10 new tokens daily
- Focus on trending tokens
- Monitor search trends

## SEO Best Practices

1. **Unique Content**: Each description and funFact should be unique
2. **Natural Language**: Write like a human, not a bot
3. **Target Intent**: Users are frustrated and want solutions
4. **Clear CTA**: "Scan My Wallet" button is prominent
5. **Structured Data**: FAQ schema helps with Google snippets

## Testing

### Local Development

```bash
npm run dev
```

Visit: `http://localhost:3000/clean/bonk`

### Build Test

```bash
npm run build
```

Verify all token pages are generated in the build output.

### Check Generated Pages

After build, check:
```
Route (app)
├ ● /clean/[ticker]
│ ├ /clean/bonk
│ ├ /clean/wif
│ └ ...
```

The `●` means static generation (SSG) - perfect for SEO.

## Monitoring

### Track Performance

1. **Google Search Console**: Monitor impressions and clicks
2. **Analytics**: Track page views and conversions
3. **Rank Tracking**: Monitor keyword rankings

### Key Metrics

- Organic traffic to `/clean/*` pages
- Conversion rate (wallet scans)
- Average position for target keywords
- Click-through rate from search

## Advanced: Bulk Import

For adding many tokens at once, you can:

1. Create a CSV with token data
2. Write a script to convert CSV → JSON
3. Merge with existing `tokens.json`

Example script structure:
```javascript
// scripts/bulk-import.js
const csv = require('csv-parser');
// Read CSV, validate, add to tokens.json
```

## Troubleshooting

### Page Not Generating

1. Check `tokens.json` syntax (valid JSON)
2. Verify ticker is lowercase in URL
3. Check build logs for errors

### Duplicate Content Warnings

- Ensure descriptions are unique
- Vary the funFact for each token
- Don't use templates verbatim

### TypeScript Errors

- Ensure `tokens.json` matches Token interface
- Check `data/token-types.ts` for type definitions

## Next Steps

- [ ] Add 50+ tokens to database
- [ ] Monitor search rankings
- [ ] A/B test descriptions
- [ ] Add more FAQ questions
- [ ] Create token category pages
- [ ] Add internal linking between token pages

---

**Remember**: The goal is to rank for specific, frustrated user searches. Each page should feel like it was written specifically for that token, not generated from a template.

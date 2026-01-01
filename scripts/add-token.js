#!/usr/bin/env node

/**
 * Add Token Script
 * 
 * Usage: node scripts/add-token.js
 * 
 * Interactive script to add new tokens to tokens.json for Programmatic SEO
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function addToken() {
  console.log('\n🪙 Add New Token to Programmatic SEO Database\n');
  console.log('Press Ctrl+C to cancel at any time\n');

  try {
    const tokensPath = path.join(process.cwd(), 'data', 'tokens.json');
    
    // Read existing tokens
    let tokens = [];
    if (fs.existsSync(tokensPath)) {
      const content = fs.readFileSync(tokensPath, 'utf8');
      tokens = JSON.parse(content);
    }

    // Get token data
    const name = await question('Token name (e.g., Bonk): ');
    if (!name.trim()) {
      console.log('❌ Name is required');
      process.exit(1);
    }

    const ticker = await question('Ticker (e.g., BONK): ');
    if (!ticker.trim()) {
      console.log('❌ Ticker is required');
      process.exit(1);
    }

    // Check if ticker already exists
    const existing = tokens.find(t => t.ticker.toUpperCase() === ticker.toUpperCase());
    if (existing) {
      const overwrite = await question(`\n⚠️  Token with ticker ${ticker} already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Cancelled');
        process.exit(0);
      }
      // Remove existing
      tokens = tokens.filter(t => t.ticker.toUpperCase() !== ticker.toUpperCase());
    }

    const mintAddress = await question('Mint Address (contract address): ');
    if (!mintAddress.trim()) {
      console.log('❌ Mint address is required');
      process.exit(1);
    }

    const description = await question('Description (1 sentence, unique and human-written): ');
    if (!description.trim()) {
      console.log('❌ Description is required');
      process.exit(1);
    }

    const funFact = await question('Fun Fact (unique fact to make content feel human): ');
    if (!funFact.trim()) {
      console.log('❌ Fun fact is required');
      process.exit(1);
    }

    // Create new token object
    const newToken = {
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      mintAddress: mintAddress.trim(),
      description: description.trim(),
      funFact: funFact.trim(),
    };

    // Add to array
    tokens.push(newToken);

    // Sort by ticker for easier management
    tokens.sort((a, b) => a.ticker.localeCompare(b.ticker));

    // Write back to file
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + '\n', 'utf8');

    console.log(`\n✅ Token ${newToken.name} (${newToken.ticker}) added successfully!`);
    console.log(`\n📄 Page will be available at: /clean/${newToken.ticker.toLowerCase()}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Run 'npm run build' to generate the new page`);
    console.log(`   2. Deploy to see it live`);
    console.log(`\n📊 Total tokens in database: ${tokens.length}\n`);
  } catch (error) {
    if (error.message.includes('SIGINT')) {
      console.log('\n\n❌ Cancelled');
      process.exit(0);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  addToken();
}

module.exports = { addToken };

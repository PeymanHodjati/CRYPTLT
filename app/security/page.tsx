import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-300 mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-100">Security & FAQ</h1>
          <p className="text-sm text-gray-400 mt-1">Your safety is our priority</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Security Guarantee */}
        <div className="glass-dark rounded-xl p-6 border border-[#7a9b76]/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔒</div>
            <div>
              <h2 className="text-xl font-semibold text-[#8fae8a] mb-2">Our Security Guarantee</h2>
              <p className="text-gray-300 text-lg font-semibold mb-2">
                We NEVER ask for your private keys or seed phrases.
              </p>
              <p className="text-gray-400">
                Manage Solana is a non-custodial service. You maintain complete control of your wallet and funds at all times. All transactions require your explicit approval through your wallet provider.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">🛡️ How Our Security Works</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-[#8fae8a] font-semibold">1.</div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Non-Custodial Architecture</h3>
                <p className="text-gray-400 text-sm">
                  We never have access to your private keys. All scanning and transaction building happens in your browser.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#8fae8a] font-semibold">2.</div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Read-Only Scanning</h3>
                <p className="text-gray-400 text-sm">
                  We only read your public wallet data to find zombie accounts and spam. We cannot make changes without your approval.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#8fae8a] font-semibold">3.</div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Transparent Transactions</h3>
                <p className="text-gray-400 text-sm">
                  Every transaction is shown in full detail in your wallet before you sign. You can verify exactly what will happen.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#8fae8a] font-semibold">4.</div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">Atomic Operations</h3>
                <p className="text-gray-400 text-sm">
                  All transactions are atomic - either everything succeeds or nothing happens. You only pay fees if you successfully reclaim rent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Is Manage Solana safe to use?</h3>
              <p className="text-gray-400 text-sm">
                Yes. Manage Solana is a non-custodial service, meaning we never have access to your private keys or funds. All transactions require your explicit approval through your wallet. We only scan public blockchain data that anyone can access.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Will you ask for my seed phrase or private keys?</h3>
              <p className="text-gray-400 text-sm">
                <span className="font-semibold text-red-400">NEVER.</span> We will NEVER ask for your seed phrase or private keys. If anyone claiming to be from Manage Solana asks for these, it is a scam. Please report it immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">How does wallet connection work?</h3>
              <p className="text-gray-400 text-sm">
                When you click "Connect Wallet," we use Reown AppKit (formerly Web3Modal) to securely connect to your wallet provider (Phantom, Solflare, or Backpack). This connection only gives us permission to view your public address and request transaction approvals - never to access your funds directly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">What are zombie accounts?</h3>
              <p className="text-gray-400 text-sm">
                Zombie accounts are empty token accounts with 0 balance. On Solana, each token account requires rent (usually ~0.002 SOL). When you close these empty accounts, the rent is refunded to you.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Can you reverse a transaction after I approve it?</h3>
              <p className="text-gray-400 text-sm">
                No. Blockchain transactions are irreversible. Once you approve and sign a transaction, it cannot be undone by us or anyone else. This is why we show you complete transaction details before you sign.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">What happens to my fees?</h3>
              <p className="text-gray-400 text-sm">
                All fees are transparently displayed before you approve any transaction. Fees go to our treasury wallet to support the development and maintenance of the service. The treasury wallet address is publicly visible in our source code.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Do you store my wallet information?</h3>
              <p className="text-gray-400 text-sm">
                No. We do not store your wallet address or transaction history on our servers. All scanning is done in real-time and results are only held temporarily in your browser session.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">What if I accidentally close an account I needed?</h3>
              <p className="text-gray-400 text-sm">
                Our tools only show empty accounts (0 balance) for closing. You can review the full list before approving. If you need the token again later, your wallet will automatically create a new token account when you receive that token.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Is the Permissions Revoke tool really free?</h3>
              <p className="text-gray-400 text-sm">
                Yes! We believe security should be accessible to everyone. The Permissions Revoke tool charges no fees - you only pay standard Solana network fees for the transaction.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-300 mb-1">How can I verify the code is safe?</h3>
              <p className="text-gray-400 text-sm">
                You can review all transaction details in your wallet before signing. Advanced users can inspect the transaction data to verify exactly what operations will be performed. The source code follows Solana's standard practices for token account operations.
              </p>
            </div>
          </div>
        </div>

        {/* What We Never Do */}
        <div className="glass-dark rounded-xl p-6 border border-red-500/30">
          <h2 className="text-xl font-semibold text-red-400 mb-4">🚫 What We NEVER Do</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Ask for your seed phrase or private keys</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Have custody or control of your funds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Send transactions without your explicit approval</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Store your wallet data on our servers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Contact you via DM asking for sensitive information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">×</span>
              <span>Offer "support" that requires you to validate your wallet</span>
            </li>
          </ul>
        </div>

        {/* Trust Indicators */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">✅ Trust Indicators</h2>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[#8fae8a]">✓</span>
              <span><span className="font-semibold text-gray-300">Transparent Operations:</span> All transaction details visible before signing</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#8fae8a]">✓</span>
              <span><span className="font-semibold text-gray-300">Open Source Practices:</span> Following Solana standard operations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#8fae8a]">✓</span>
              <span><span className="font-semibold text-gray-300">Secure Connection:</span> HTTPS encryption for all communications</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#8fae8a]">✓</span>
              <span><span className="font-semibold text-gray-300">No Hidden Fees:</span> All costs clearly displayed upfront</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#8fae8a]">✓</span>
              <span><span className="font-semibold text-gray-300">Privacy Focused:</span> Minimal data collection</span>
            </div>
          </div>
        </div>

        {/* Report Issues */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">📧 Report Security Issues</h2>
          <p className="text-gray-400 mb-4">
            If you discover a security vulnerability or suspicious activity, please report it immediately. We take all security reports seriously and will investigate promptly.
          </p>
          <div className="glass-dark rounded-lg p-4">
            <p className="text-sm text-gray-400">
              Note: Our code follows industry-standard security practices. If you believe there's an issue, please provide specific details so we can address it quickly.
            </p>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">📚 Learn More</h2>
          <div className="space-y-2">
            <Link href="/privacy" className="block text-[#8fae8a] hover:text-[#7a9b76] transition-colors">
              → Privacy Policy
            </Link>
            <Link href="/terms" className="block text-[#8fae8a] hover:text-[#7a9b76] transition-colors">
              → Terms of Service
            </Link>
            <a
              href="https://docs.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#8fae8a] hover:text-[#7a9b76] transition-colors"
            >
              → Solana Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

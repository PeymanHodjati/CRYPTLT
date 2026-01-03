import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-300 mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-100">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mt-1">Last updated: January 3, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-xl p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. Introduction</h2>
            <p className="text-gray-400">
              Manage Solana ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our Solana wallet optimization tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. Information We Collect</h2>
            <div className="space-y-3 text-gray-400">
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">2.1 Wallet Information</h3>
                <p>We temporarily access your wallet's public address to scan for zombie accounts, spam tokens, and token approvals. We <span className="font-semibold text-[#8fae8a]">NEVER</span> collect, store, or have access to your private keys or seed phrases.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">2.2 Transaction Data</h3>
                <p>All transactions are executed directly through your wallet provider (Phantom, Solflare, or Backpack). We do not process, store, or have custody of your funds.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-1">2.3 Technical Data</h3>
                <p>We may collect basic technical information such as browser type, device information, and usage patterns to improve our services.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. Non-Custodial Service</h2>
            <div className="glass-dark rounded-lg p-4 border border-[#7a9b76]/30">
              <p className="text-gray-300">
                <span className="font-semibold text-[#8fae8a]">Important:</span> Manage Solana is a non-custodial service. This means:
              </p>
              <ul className="mt-2 space-y-1 text-gray-400 ml-4">
                <li>• You maintain complete control of your wallet and funds</li>
                <li>• We never have access to your private keys or seed phrases</li>
                <li>• All transactions require your explicit approval in your wallet</li>
                <li>• We cannot access, transfer, or freeze your funds</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. How We Use Information</h2>
            <p className="text-gray-400">We use the minimal information we collect to:</p>
            <ul className="mt-2 space-y-1 text-gray-400 ml-4">
              <li>• Scan your wallet for zombie accounts, spam, and risky permissions</li>
              <li>• Build transactions for you to review and approve</li>
              <li>• Improve our services and user experience</li>
              <li>• Ensure the security and proper functioning of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. Data Storage and Security</h2>
            <p className="text-gray-400">
              We do not store your wallet address or transaction history on our servers. All scanning operations are performed in real-time and the results are only temporarily held in your browser session. We implement industry-standard security measures to protect our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. Third-Party Services</h2>
            <div className="space-y-2 text-gray-400">
              <p>We integrate with the following third-party services:</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• <span className="font-semibold text-gray-300">Reown AppKit</span> - For wallet connection functionality</li>
                <li>• <span className="font-semibold text-gray-300">Solana RPC</span> - For blockchain data access</li>
                <li>• <span className="font-semibold text-gray-300">Wallet Providers</span> - Phantom, Solflare, and Backpack for transaction signing</li>
              </ul>
              <p className="mt-2">These services have their own privacy policies and we recommend reviewing them.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. Cookies and Tracking</h2>
            <p className="text-gray-400">
              We use minimal cookies and local storage only for essential functionality such as maintaining your session and user preferences. We do not use tracking cookies or sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">8. Your Rights</h2>
            <p className="text-gray-400">You have the right to:</p>
            <ul className="mt-2 space-y-1 text-gray-400 ml-4">
              <li>• Disconnect your wallet at any time</li>
              <li>• Clear your browser data to remove any stored session information</li>
              <li>• Request information about data we may have collected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">9. Children's Privacy</h2>
            <p className="text-gray-400">
              Our service is not intended for users under the age of 18. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-400">
              We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">11. Contact Us</h2>
            <p className="text-gray-400">
              If you have any questions about this Privacy Policy or our practices, please contact us through our{' '}
              <Link href="/security" className="text-[#8fae8a] hover:text-[#7a9b76] underline">
                Security page
              </Link>.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-[#7a9b76]/20">
            <p className="text-sm text-gray-500 text-center">
              By using Manage Solana, you agree to this Privacy Policy and our{' '}
              <Link href="/terms" className="text-[#8fae8a] hover:text-[#7a9b76] underline">
                Terms of Service
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-300 mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-100">Terms of Service</h1>
          <p className="text-sm text-gray-400 mt-1">Last updated: January 3, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-xl p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-400">
              By accessing or using Manage Solana ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. Description of Service</h2>
            <p className="text-gray-400">
              Manage Solana provides tools to help you optimize your Solana wallet by:
            </p>
            <ul className="mt-2 space-y-1 text-gray-400 ml-4">
              <li>• Finding and closing empty token accounts to reclaim rent</li>
              <li>• Identifying and burning spam tokens and NFTs</li>
              <li>• Detecting and revoking risky token approvals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. Non-Custodial Service</h2>
            <div className="glass-dark rounded-lg p-4 border border-[#7a9b76]/30 space-y-2">
              <p className="text-gray-300 font-semibold">
                IMPORTANT: Manage Solana is a NON-CUSTODIAL service.
              </p>
              <ul className="space-y-1 text-gray-400 ml-4">
                <li>• We do NOT have access to your wallet, private keys, or seed phrases</li>
                <li>• We NEVER ask for your private keys or seed phrases</li>
                <li>• You maintain complete control of your funds at all times</li>
                <li>• All transactions require your explicit approval</li>
                <li>• We cannot reverse, cancel, or modify transactions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. User Responsibilities</h2>
            <p className="text-gray-400">You are responsible for:</p>
            <ul className="mt-2 space-y-1 text-gray-400 ml-4">
              <li>• Maintaining the security of your wallet and private keys</li>
              <li>• Reviewing all transaction details before approving</li>
              <li>• Understanding the risks associated with blockchain transactions</li>
              <li>• Ensuring you have sufficient SOL for transaction fees</li>
              <li>• Verifying that you want to close accounts or burn tokens before proceeding</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. Fees</h2>
            <div className="space-y-3 text-gray-400">
              <p>Our service charges the following fees:</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• <span className="font-semibold text-gray-300">Rent Finder:</span> 0.005 SOL (~$1) per claim transaction</li>
                <li>• <span className="font-semibold text-gray-300">Spam Burner:</span> 15% of the refunded rent</li>
                <li>• <span className="font-semibold text-gray-300">Permissions Revoke:</span> Free (no fees)</li>
              </ul>
              <p className="mt-2">
                Fees are only charged when transactions successfully complete. All fees are transparently displayed before you approve any transaction.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. Risks and Disclaimers</h2>
            <div className="glass-dark rounded-lg p-4 border border-red-500/30 space-y-2">
              <p className="text-red-400 font-semibold">
                WARNING: Using blockchain services involves risks.
              </p>
              <ul className="space-y-1 text-gray-400 ml-4">
                <li>• Blockchain transactions are irreversible and cannot be undone</li>
                <li>• You may lose access to funds if you lose your private keys</li>
                <li>• Network fees (gas) may fluctuate and affect transaction costs</li>
                <li>• Smart contracts and blockchain protocols carry inherent risks</li>
                <li>• The value of cryptocurrencies can be volatile</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. No Financial Advice</h2>
            <p className="text-gray-400">
              Manage Solana provides tools and information for wallet optimization only. We do not provide financial, investment, or tax advice. You should consult with appropriate professionals before making financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-400">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MANAGE SOLANA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">9. Service Availability</h2>
            <p className="text-gray-400">
              We strive to maintain service availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We are not liable for any losses resulting from service downtime.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">10. Prohibited Uses</h2>
            <p className="text-gray-400">You may not use the Service to:</p>
            <ul className="mt-2 space-y-1 text-gray-400 ml-4">
              <li>• Violate any laws or regulations</li>
              <li>• Engage in fraudulent or deceptive practices</li>
              <li>• Interfere with the Service's operation or security</li>
              <li>• Attempt to gain unauthorized access to our systems</li>
              <li>• Use the Service for money laundering or illicit activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">11. Intellectual Property</h2>
            <p className="text-gray-400">
              All content, features, and functionality of the Service are owned by Manage Solana and are protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">12. Termination</h2>
            <p className="text-gray-400">
              We reserve the right to terminate or suspend access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">13. Changes to Terms</h2>
            <p className="text-gray-400">
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We will update the "Last updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">14. Governing Law</h2>
            <p className="text-gray-400">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">15. Contact</h2>
            <p className="text-gray-400">
              For questions about these Terms, please visit our{' '}
              <Link href="/security" className="text-[#8fae8a] hover:text-[#7a9b76] underline">
                Security page
              </Link>.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-[#7a9b76]/20">
            <p className="text-sm text-gray-500 text-center">
              By using Manage Solana, you agree to these Terms of Service and our{' '}
              <Link href="/privacy" className="text-[#8fae8a] hover:text-[#7a9b76] underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

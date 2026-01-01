'use client';

import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import Link from 'next/link';

export default function Dashboard() {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  const tools = [
    {
      id: 'rent-finder',
      name: 'The Rent Finder',
      description: 'Reclaim rent from empty token accounts',
      icon: '💰',
      color: 'from-blue-500 to-indigo-600',
      href: '/tools/rent-finder',
      status: 'active',
    },
    {
      id: 'spam-burner',
      name: 'The Spam Burner',
      description: 'Burn spam NFTs and tokens, reclaim rent',
      icon: '🔥',
      color: 'from-orange-500 to-red-600',
      href: '/tools/spam-burner',
      status: 'active',
    },
    {
      id: 'loose-change',
      name: 'Loose Change Collector',
      description: 'Batch swap small token balances into SOL',
      icon: '🪙',
      color: 'from-green-500 to-emerald-600',
      href: '/tools/loose-change',
      status: 'active',
    },
    {
      id: 'permissions',
      name: 'Free Permissions Revoke',
      description: 'Revoke risky token approvals',
      icon: '🔒',
      color: 'from-purple-500 to-pink-600',
      href: '/tools/permissions',
      status: 'active',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Manage Solana</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Dashboard {'>'} Tools
              </p>
            </div>
            {isConnected && address ? (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-gray-500">Connected</div>
                <div className="text-sm font-mono text-blue-600">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            ) : (
              <button
                onClick={() => open()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Solana Toolkit</h2>
          <p className="text-gray-600">
            Manage your Solana wallet with powerful tools to clean, optimize, and secure your assets.
          </p>
        </div>

        {/* Tool Cards Grid - Always Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="glass rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-3`}>
                  {tool.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  {tool.description}
                </p>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {tool.status}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Connect Wallet Card */}
        {!isConnected ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Connect your wallet to start managing your Solana assets
            </p>
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect Your Wallet</h3>
            <button
              onClick={() => open()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors card-shadow"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Connected Wallet</div>
                <div className="text-lg font-mono text-gray-900">{address?.slice(0, 8)}...{address?.slice(-6)}</div>
              </div>
              <button
                onClick={() => open({ view: 'Account' })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast & Efficient</h4>
            <p className="text-sm text-gray-600">
              All tools use atomic transactions for maximum safety and efficiency.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 mb-2">Secure</h4>
            <p className="text-sm text-gray-600">
              Non-custodial. We never touch your private keys or funds.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 mb-2">Cost-Effective</h4>
            <p className="text-sm text-gray-600">
              Small fees only when you successfully reclaim or optimize your assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

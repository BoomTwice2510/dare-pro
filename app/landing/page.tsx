'use client';

import { useAccount, useConnect } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';
import { glassStyles } from '@/lib/glass-styles';

export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  if (isConnected && address) {
    return (
      <div style={{ backgroundColor: '#000000', minHeight: '100vh' }} className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Logo Section */}
          <div className="flex justify-center pt-8">
            <img
              src="/images/logo.png"
              alt="Dare Protocol"
              className="h-48 w-48 object-contain"
            />
          </div>

          {/* Connected Status */}
          <div className="text-center space-y-4">
            <p
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(to right, #d4af37, #e6c547)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Wallet Connected
            </p>
            <p className="text-white/70 text-lg">Ready to stake your commitment?</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dares">
              <button style={glassStyles.btnGold} className="px-8 py-3 text-lg font-bold hover:shadow-2xl transition-all">
                Go to Dares
              </button>
            </Link>
            <Link href="/arena">
              <button style={glassStyles.btnGold} className="px-8 py-3 text-lg font-bold hover:shadow-2xl transition-all">
                Public Arena
              </button>
            </Link>
            <Link href="/leaderboard">
              <button style={glassStyles.btnGold} className="px-8 py-3 text-lg font-bold hover:shadow-2xl transition-all">
                Leaderboard
              </button>
            </Link>
            <Link href="/components-showcase">
              <button style={glassStyles.btnGold} className="px-8 py-3 text-lg font-bold hover:shadow-2xl transition-all">
                View All Components
              </button>
            </Link>
          </div>

          {/* Features Grid Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(to right, #d4af37, #e6c547)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Why Dare Protocol?
              </h2>
            </div>

            {/* 2x2 Grid of Features - Colorful */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1 - Cyan */}
              <div
                className="rounded-3xl p-8 border-2 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 255, 0.05))',
                  borderColor: '#00d4ff',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-5xl">🛡️</div>
                <h3 className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #00d4ff, #0099ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Economic Consequences</h3>
                <p className="text-white/70 text-sm">
                  Every dare is backed by real capital. No excuses when stakes are real.
                </p>
              </div>

              {/* Card 2 - Green */}
              <div
                className="rounded-3xl p-8 border-2 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(56, 142, 60, 0.05))',
                  borderColor: '#4caf50',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-5xl">✓</div>
                <h3 className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #4caf50, #81c784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deterministic Onchain Rules</h3>
                <p className="text-white/70 text-sm">
                  Smart contracts enforce outcomes. No middleman. No favoritism.
                </p>
              </div>

              {/* Card 3 - Orange */}
              <div
                className="rounded-3xl p-8 border-2 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 111, 0, 0.05))',
                  borderColor: '#ff9800',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-5xl">✕</div>
                <h3 className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #ff9800, #ffb74d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>No Offchain Moderation</h3>
                <p className="text-white/70 text-sm">
                  Your proof is your truth. Code judges, not committees.
                </p>
              </div>

              {/* Card 4 - Purple */}
              <div
                className="rounded-3xl p-8 border-2 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(123, 31, 162, 0.05))',
                  borderColor: '#9c27b0',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-5xl">⚖️</div>
                <h3 className="text-xl font-bold" style={{ background: 'linear-gradient(90deg, #9c27b0, #ce93d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Transparent Reputation (XP)</h3>
                <p className="text-white/70 text-sm">
                  Earn trust through action. Your XP is public and permanent.
                </p>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="text-center pt-12">
              <p
                className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight"
                style={{
                  background: 'linear-gradient(90deg, #ff6b5b 0%, #ff9800 25%, #d4af37 50%, #4caf50 75%, #00d4ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(212, 175, 55, 0.2)',
                }}
              >
                Motivation fades. Consequences don't.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh' }} className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Logo and Tagline Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img
              src="/images/logo.png"
              alt="Dare Protocol"
              className="h-32 w-32 object-contain"
            />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #00d4ff 0%, #0099ff 25%, #d4af37 50%, #ff9800 75%, #ff6b5b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
            }}
          >
            DARE PROTOCOL
          </h1>
          <p className="text-2xl font-semibold text-white">Put real stakes behind real commitments.</p>
          <p className="text-lg text-white/70 font-medium">No screenshots. No promises. No excuses.</p>
          
          {/* Main Tagline - Multicolored */}
          <div className="mt-8 space-y-4">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-balance">
              <span
                style={{
                  background: 'linear-gradient(90deg, #00d4ff 0%, #0099ff 25%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dare.
              </span>
              {' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #d4af37 0%, #f5d566 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Stake.
              </span>
              {' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #ff6b5b 0%, #ff3838 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Prove it.
              </span>
            </p>
          </div>

          {/* Connect Wallet Button - Below Tagline */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={() => {
                const connector = connectors[0];
                if (connector) connect({ connector });
              }}
              style={glassStyles.btnGold}
              className="px-10 py-4 text-lg font-bold hover:shadow-2xl transition-all"
            >
              Connect Wallet to Start
            </button>
            <p className="text-white/60 text-sm">
              MetaMask, WalletConnect, and other Web3 wallets supported
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="rounded-2xl p-8" style={glassStyles.glassGold}>
          <h2
            className="text-3xl font-bold mb-6"
            style={{
              background: 'linear-gradient(to right, #d4af37, #e6c547)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">1. Create a Dare</p>
              <p className="text-sm">Define your challenge, set a duration, and stake real value (ETH or ERC20).</p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">2. Accept with Equal Stake</p>
              <p className="text-sm">Another user accepts your dare with an equal stake. The pool doubles.</p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">3. Complete or Fail</p>
              <p className="text-sm">The timer counts down. Succeed and submit proof, or admit defeat.</p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">4. Resolve & Claim</p>
              <p className="text-sm">Auto-resolve or judge-resolve. Winner takes the full pool.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl p-8" style={glassStyles.glassGold}>
          <h2
            className="text-3xl font-bold mb-6"
            style={{
              background: 'linear-gradient(to right, #d4af37, #e6c547)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">What is Dare Protocol?</p>
              <p className="text-white/80">
                An onchain commitment system where two users lock real value behind a task and let smart contracts
                enforce the outcome. Economic incentives replace trust.
              </p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">Is this a gambling app?</p>
              <p className="text-white/80">
                No. It's a commitment tool. Both parties risk real capital to ensure they follow through. Success
                depends on your ability to deliver, not chance.
              </p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">Can I cancel a dare?</p>
              <p className="text-white/80">
                Once accepted by another user, a dare cannot be cancelled. This is intentional—it ensures commitment.
              </p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">What if I submit false proof?</p>
              <p className="text-white/80">
                The other party can dispute. A judge reviews and decides. False claims damage your reputation (XP).
              </p>
            </div>
            <div className="rounded-lg p-4" style={glassStyles.glassLight}>
              <p className="font-semibold text-[#d4af37] mb-2">What is XP?</p>
              <p className="text-white/80">
                Onchain reputation. You gain XP when you win dares. Badges reflect your trust level in the protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="rounded-2xl p-8 border border-red-500/30" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Legal Disclaimer</h2>
          <div className="space-y-3 text-white/80 text-sm">
            <p>
              <span className="font-semibold">Experimental Software:</span> Dare Protocol is experimental. Smart
              contracts may contain bugs. Use at your own risk.
            </p>
            <p>
              <span className="font-semibold">No Financial Advice:</span> This is not financial advice. Losses are
              possible. Only risk capital you can afford to lose.
            </p>
            <p>
              <span className="font-semibold">Non-Custodial:</span> Your funds are always in your control. We never
              hold your assets.
            </p>
            <p>
              <span className="font-semibold">No Liability:</span> We are not liable for losses due to smart contract
              bugs, failed disputes, or market conditions.
            </p>
            <p>
              <span className="font-semibold">Terms Acceptance:</span> By using this protocol, you accept all risks
              and disclaimers above.
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}

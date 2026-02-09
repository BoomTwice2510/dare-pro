'use client';

import { useState } from 'react';
import { glassStyles } from '@/lib/glass-styles';

export interface FlashTaskTemplate {
  id: string;
  title: string;
  description: string;
  deadline: number; // in seconds
  proofType: string;
  failureRate: string;
}

export interface FlashTaskCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  failureRating: number; // 1-4 flames
  templates: FlashTaskTemplate[];
}

export const FLASH_TASK_CATEGORIES: FlashTaskCategory[] = [
  {
    id: 'build',
    name: 'Build / Ship',
    emoji: '🔨',
    description: 'High ego, high fail. Builders overestimate themselves.',
    failureRating: 3,
    templates: [
      {
        id: 'ship-feature',
        title: 'Ship any feature (UI or contract) in 24h',
        description: 'Build and deploy a new feature to your project within 24 hours',
        deadline: 86400,
        proofType: 'GitHub link / deployment tx',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'deploy-contract',
        title: 'Deploy any contract on testnet in 12h',
        description: 'Deploy a smart contract to a testnet within 12 hours',
        deadline: 43200,
        proofType: 'Deployment transaction hash',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'github-commits',
        title: 'Push 3 GitHub commits in 24h',
        description: 'Make 3 meaningful commits to your repository within 24 hours',
        deadline: 86400,
        proofType: 'GitHub commit links',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'fix-issue',
        title: 'Fix 1 open issue in your repo today',
        description: 'Identify and fix one open issue in your repository by end of day',
        deadline: 86400,
        proofType: 'GitHub issue link',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'landing-page',
        title: 'Launch a landing page (any stack) in 24h',
        description: 'Build and launch a complete landing page within 24 hours',
        deadline: 86400,
        proofType: 'Deployed URL',
        failureRate: '🔥🔥🔥',
      },
    ],
  },
  {
    id: 'social',
    name: 'Post / Social',
    emoji: '📢',
    description: 'Low effort but consistency kills people.',
    failureRating: 2,
    templates: [
      {
        id: 'farcaster-daily',
        title: 'Post 1 Farcaster cast daily for 7 days',
        description: 'Share a meaningful cast on Farcaster every day for 7 days',
        deadline: 604800,
        proofType: 'Profile link with 7 casts',
        failureRate: '🔥🔥',
      },
      {
        id: 'tweet-daily',
        title: 'Tweet once daily for next 5 days',
        description: 'Post a tweet every day for the next 5 days',
        deadline: 432000,
        proofType: 'Twitter/X profile link',
        failureRate: '🔥🔥',
      },
      {
        id: 'reply-casts',
        title: 'Reply to 10 casts today',
        description: 'Engage by replying to 10 different casts on Farcaster today',
        deadline: 86400,
        proofType: 'Profile screenshot',
        failureRate: '🔥🔥',
      },
      {
        id: 'build-update',
        title: 'Post 1 build update in 24h',
        description: 'Share progress on what you are currently building',
        deadline: 86400,
        proofType: 'Profile link / tweet link',
        failureRate: '🔥🔥',
      },
      {
        id: 'onchain-share',
        title: 'Share 1 onchain tx publicly today',
        description: 'Complete an onchain transaction and share it publicly today',
        deadline: 86400,
        proofType: 'Profile link with tx share',
        failureRate: '🔥🔥',
      },
    ],
  },
  {
    id: 'learn',
    name: 'Learn / Study',
    emoji: '📚',
    description: 'People think they will do it. They won\'t.',
    failureRating: 3,
    templates: [
      {
        id: 'whitepaper',
        title: 'Read 1 whitepaper + summary in 24h',
        description: 'Read a blockchain/crypto whitepaper and write a summary',
        deadline: 86400,
        proofType: 'Notion / doc / link',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'dev-tutorial',
        title: 'Watch 1 dev tutorial + notes today',
        description: 'Complete a development tutorial and take detailed notes',
        deadline: 86400,
        proofType: 'Notion / doc / link',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'protocol-feature',
        title: 'Learn 1 new protocol feature in 12h',
        description: 'Deep dive into one feature of your favorite protocol',
        deadline: 43200,
        proofType: 'Twitter/Farcaster thread',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'write-summary',
        title: 'Write 200 words about any crypto topic',
        description: 'Write thoughtful content on a crypto topic of your choice',
        deadline: 86400,
        proofType: 'Notion / Medium / blog',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'study-docs',
        title: 'Study documentation for 2 hours',
        description: 'Dedicate 2 hours to learning from official protocol documentation',
        deadline: 86400,
        proofType: 'Self-attestation + challenge window',
        failureRate: '🔥🔥🔥',
      },
    ],
  },
  {
    id: 'onchain',
    name: 'Onchain Actions',
    emoji: '⛓️',
    description: 'Best for automation. Clean & verifiable.',
    failureRating: 1,
    templates: [
      {
        id: 'any-tx',
        title: 'Do 1 onchain tx today (any chain)',
        description: 'Execute any transaction on any blockchain today',
        deadline: 86400,
        proofType: 'Transaction hash',
        failureRate: '🔥',
      },
      {
        id: 'bridge-funds',
        title: 'Bridge funds to any L2 in 12h',
        description: 'Bridge tokens to a Layer 2 network within 12 hours',
        deadline: 43200,
        proofType: 'Bridge transaction hash',
        failureRate: '🔥',
      },
      {
        id: 'swap-token',
        title: 'Swap any token on DEX today',
        description: 'Complete a token swap on any decentralized exchange today',
        deadline: 86400,
        proofType: 'Swap transaction hash',
        failureRate: '🔥',
      },
      {
        id: 'mint-nft',
        title: 'Mint any NFT in 24h',
        description: 'Mint an NFT from any collection within 24 hours',
        deadline: 86400,
        proofType: 'NFT transaction hash',
        failureRate: '🔥',
      },
      {
        id: 'dao-vote',
        title: 'Vote on 1 DAO proposal',
        description: 'Participate in DAO governance by voting on a proposal',
        deadline: 604800,
        proofType: 'Vote transaction hash',
        failureRate: '🔥',
      },
    ],
  },
  {
    id: 'money',
    name: 'Money / Discipline',
    emoji: '💰',
    description: 'Money rules behavior. Painful = good.',
    failureRating: 4,
    templates: [
      {
        id: 'no-degen-trading',
        title: 'No degen trading for 48h',
        description: 'Abstain from high-risk trading for 48 hours',
        deadline: 172800,
        proofType: 'Wallet history / self-attest',
        failureRate: '🔥🔥🔥🔥',
      },
      {
        id: 'no-leverage',
        title: 'No leverage trades for 72h',
        description: 'Avoid all leverage trades for 72 hours',
        deadline: 259200,
        proofType: 'Wallet history / self-attest',
        failureRate: '🔥🔥🔥🔥',
      },
      {
        id: 'hold-eth',
        title: 'Hold ETH without selling for 7 days',
        description: 'Hold your ETH position without selling for 7 days',
        deadline: 604800,
        proofType: 'Wallet history / self-attest',
        failureRate: '🔥🔥🔥🔥',
      },
      {
        id: 'no-new-nfts',
        title: 'No new NFTs minted for 5 days',
        description: 'Avoid minting new NFTs for 5 days',
        deadline: 432000,
        proofType: 'Wallet history / self-attest',
        failureRate: '🔥🔥🔥🔥',
      },
      {
        id: 'track-expenses',
        title: 'Track expenses today & share summary',
        description: 'Track all your expenses today and share a summary',
        deadline: 86400,
        proofType: 'Screenshot / spreadsheet',
        failureRate: '🔥🔥🔥🔥',
      },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    emoji: '💪',
    description: 'Crypto crowd secretly wants discipline.',
    failureRating: 3,
    templates: [
      {
        id: 'no-junk-food',
        title: 'No junk food for 24h',
        description: 'Avoid all junk food and eat clean for 24 hours',
        deadline: 86400,
        proofType: 'Photo / self-attestation',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'wake-early',
        title: 'Wake up before 7 AM tomorrow',
        description: 'Wake up and be productive before 7 AM tomorrow',
        deadline: 86400,
        proofType: 'Screenshot / photo',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'walk-steps',
        title: 'Walk 5,000 steps today',
        description: 'Complete 5,000 steps today for your health',
        deadline: 86400,
        proofType: 'Health app screenshot',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'no-smoking',
        title: 'No smoking for 24h',
        description: 'Stay smoke-free for the next 24 hours',
        deadline: 86400,
        proofType: 'Self-attestation',
        failureRate: '🔥🔥🔥',
      },
      {
        id: 'pushups',
        title: '30 pushups in one session',
        description: 'Complete 30 pushups in a single session today',
        deadline: 86400,
        proofType: 'Photo / video',
        failureRate: '🔥🔥🔥',
      },
    ],
  },
];

interface FlashTaskModalProps {
  onSelectTemplate: (template: FlashTaskTemplate, category: FlashTaskCategory) => void;
}

export function FlashTaskModal({ onSelectTemplate }: FlashTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FlashTaskCategory | null>(null);

  const handleSelectTemplate = (template: FlashTaskTemplate, category: FlashTaskCategory) => {
    onSelectTemplate(template, category);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={glassStyles.btnGold}
        className="px-6 py-3 font-semibold text-sm"
      >
        ⚡ Flash Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            style={glassStyles.glass}
            className="rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Flash Task Templates</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedCategory(null);
                }}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {!selectedCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FLASH_TASK_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    style={glassStyles.glassLight}
                    className="p-4 rounded-xl text-left hover:bg-white/10 transition-all group"
                  >
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <h3 className="font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-white/60 mb-2">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/40">
                        {category.templates.length} templates
                      </span>
                      <span className="text-sm">{'🔥'.repeat(category.failureRating)}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-white/60 hover:text-white text-sm mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedCategory.emoji} {selectedCategory.name}
                  </h3>
                  <p className="text-white/60 text-sm">{selectedCategory.description}</p>
                </div>

                <div className="space-y-2">
                  {selectedCategory.templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template, selectedCategory)}
                      style={glassStyles.glassLight}
                      className="w-full p-4 rounded-xl text-left hover:bg-white/10 transition-all"
                    >
                      <h4 className="font-semibold text-white mb-1">{template.title}</h4>
                      <p className="text-xs text-white/60 mb-2">{template.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#d4af37]">
                          Proof: {template.proofType}
                        </span>
                        <span className="text-xs">{template.failureRate}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

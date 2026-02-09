import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// ===============================
// DARE Protocol – NEW CONTRACT
// ===============================

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const DARE_CONTRACT_ADDRESS =
  '0x5cb88a7B927b9D47fbf8A0c0A8549471c84d8D20' as const;

export const DARE_CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },

  /* ========= EVENTS ========= */

  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint8', name: 'badge', type: 'uint8' },
    ],
    name: 'BadgeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'accepter', type: 'address' },
    ],
    name: 'DareAccepted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'DareCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'DareCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'DareDisputed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'payoutAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'feeAmount', type: 'uint256' },
    ],
    name: 'DareResolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'accepter', type: 'address' },
      { indexed: false, internalType: 'string', name: 'proofURI', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'proofTime', type: 'uint256' },
    ],
    name: 'ProofSubmitted',
    type: 'event',
  },

  /* ========= READ ========= */

  { inputs: [], name: 'CONFIRM_WINDOW', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'PROOF_WINDOW', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'WIN_FEE_BPS', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'XP_WIN', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'judge', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'treasury', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ type: 'address' }], name: 'xp', outputs: [{ type: 'int256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ type: 'address' }], name: 'badge', outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' },

  { inputs: [], name: 'dareCount', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },

  {
    inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
    name: 'getDare',
    outputs: [
      { type: 'address' },
      { type: 'address' },
      { type: 'string' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'bool' },
      { type: 'bool' },
      { type: 'string' },
      { type: 'uint256' },
      { type: 'bool' },
      { type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },

  /* ========= WRITE ========= */

  { inputs: [{ type: 'uint256' }], name: 'acceptDare', stateMutability: 'payable', type: 'function' },
  { inputs: [{ type: 'uint256' }], name: 'cancelDare', stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ type: 'uint256' }], name: 'approveProof', stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ type: 'uint256' }], name: 'disputeProof', stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ type: 'uint256' }], name: 'autoResolve', stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ type: 'uint256' }], name: 'claimExpiredDare', stateMutability: 'nonpayable', type: 'function' },

  {
    inputs: [
      { type: 'string' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'uint256' },
    ],
    name: 'createDare',
    stateMutability: 'payable',
    type: 'function',
  },

  {
    inputs: [
      { type: 'uint256' },
      { type: 'string' },
    ],
    name: 'submitProof',
    stateMutability: 'nonpayable',
    type: 'function',
  },

  {
    inputs: [
      { type: 'uint256' },
      { type: 'address' },
    ],
    name: 'judgeResolve',
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

/* ===============================
   WAGMI CONFIG
================================ */

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});

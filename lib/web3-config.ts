import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// ===============================
// DARE Protocol – NEW CONTRACT
// ===============================

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const DARE_CONTRACT_ADDRESS =
  '0xC96b5a52a661105468B7202516930158E42be0fb' as const;

export const DARE_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_judge", "type": "address" },
      { "internalType": "address", "name": "_treasury", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "badge", "type": "uint8" }
    ],
    "name": "BadgeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "accepter", "type": "address" }
    ],
    "name": "DareAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "DareCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "DareCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "DareDisputed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "DareExpired",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "payoutAmount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "feeAmount", "type": "uint256" }
    ],
    "name": "DareResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "oldJudge", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newJudge", "type": "address" }
    ],
    "name": "JudgeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "accepter", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "proofURI", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "proofTime", "type": "uint256" }
    ],
    "name": "ProofSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "oldTreasury", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newTreasury", "type": "address" }
    ],
    "name": "TreasuryUpdated",
    "type": "event"
  },
  { "stateMutability": "payable", "type": "fallback" },

  { "inputs": [], "name": "CONFIRM_WINDOW", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "JUDGE_WINDOW", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "PROOF_WINDOW", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "WIN_FEE_BPS", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "XP_WIN", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },

  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "acceptDare", "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "cancelOpenDare", "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "confirmSuccess", "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "name": "_description", "type": "string" },
      { "name": "_duration", "type": "uint256" },
      { "name": "_token", "type": "address" },
      { "name": "_stake", "type": "uint256" }
    ],
    "name": "createDare",
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "dareCount", "outputs": [{ "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "disputeDare", "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "expireUnacceptedDare", "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [{ "name": "_id", "type": "uint256" }],
    "name": "getDare",
    "outputs": [
      { "name": "creator", "type": "address" },
      { "name": "accepter", "type": "address" },
      { "name": "description", "type": "string" },
      { "name": "token", "type": "address" },
      { "name": "stake", "type": "uint256" },
      { "name": "createdAt", "type": "uint256" },
      { "name": "deadline", "type": "uint256" },
      { "name": "proofSubmitted", "type": "bool" },
      { "name": "proofURI", "type": "string" },
      { "name": "proofTime", "type": "uint256" },
      { "name": "disputeTime", "type": "uint256" },
      { "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "judge", "outputs": [{ "type": "address" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [
      { "name": "_id", "type": "uint256" },
      { "name": "creatorWins", "type": "bool" }
    ],
    "name": "judgeResolve",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [{ "name": "_id", "type": "uint256" }], "name": "resolveAfterConfirmTimeout", "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "_judge", "type": "address" }], "name": "setJudge", "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "_treasury", "type": "address" }], "name": "setTreasury", "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "name": "_id", "type": "uint256" },
      { "name": "_proofURI", "type": "string" }
    ],
    "name": "submitProof",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "treasury", "outputs": [{ "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "type": "address" }], "name": "xp", "outputs": [{ "type": "int256" }], "stateMutability": "view", "type": "function" },
  { "stateMutability": "payable", "type": "receive" }
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

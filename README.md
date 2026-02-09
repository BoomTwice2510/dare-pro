# DARE PROTOCOL - Web3 DApp UI

A complete, production-ready React/Next.js dapp interface for the DARE Protocol smart contract deployed on Base Sepolia.

## Overview

**DARE PROTOCOL** is an onchain commitment system where two users lock real value behind a task and let smart contracts enforce the outcome.

- **Motto**: "Dare. Stake. Prove it."
- **Contract Address**: `0xA350dDf25f6851EDe98A59E92977Dd6Fe5Fd3C6D` (Base Sepolia)
- **Chain**: Base Sepolia (ChainID: 84532)

## Features

### Core Dapp Sections

1. **Explore Dares** (`/`)
   - View all dares on the protocol
   - Filter by status (Open, Active, All)
   - See dare details: creator, stake, deadline, accepter
   - Quick actions based on user role

2. **Create Dare** (`/create`)
   - Define dare description
   - Set duration (hours/days/weeks)
   - Specify stake amount
   - Choose payment (ETH or ERC20)
   - Real-time transaction feedback

3. **My Dares** (`/my-dares`)
   - View dares created by connected wallet
   - View dares accepted by connected wallet
   - Role-specific actions (creator vs accepter)
   - Filtered views for each role

4. **Reputation System** (`/reputation`)
   - View connected wallet's XP and badge level
   - Search any address for reputation
   - Badge progression tracker
   - Protocol parameters display

5. **Judge Panel** (`/judge`)
   - Judge-only access to resolve disputed dares
   - Resolve disputed dares by ID and winner
   - View protocol governance info
   - Transparency disclosures

6. **Landing Page** (Home)
   - What is Dare Protocol?
   - How it works
   - Why use it
   - Legal disclaimer

## Technology Stack

- **Frontend**: React 19 + Next.js 16
- **Blockchain**: wagmi 3 + viem 2
- **State Management**: @tanstack/react-query
- **Styling**: Tailwind CSS v4 with custom glassy morphism theme
- **Components**: shadcn/ui

## Design System

### Glassy Morphism Aesthetic

The UI features a premium **glassy morphism** design with:

- **Color Scheme**:
  - Primary: Gold (`#d4af37`, `#e6c547`)
  - Dark Background: Navy/Purple gradient (`#0a0e27`, `#1a0f2e`)
  - Glass Elements: Semi-transparent white overlays with backdrop blur
  - Accents: Cyan, green, yellow for status indicators

- **Key Classes**:
  - `.glass` - Base glass effect
  - `.glass-light` - Lighter variant
  - `.glass-gold` - Gold-tinted glass
  - `.glow-gold` - Gold shadow glow
  - `.gradient-text` - Gold gradient text
  - `.btn-gold` - Primary button
  - `.btn-glass` - Secondary button

### Status Indicators

- **Open**: Blue - Dare waiting for accepter
- **Running**: Cyan - Dare in progress
- **Proof Submitted**: Yellow - Accepter submitted proof
- **Disputed**: Red - Proof disputed by creator
- **Resolved**: Green - Winner determined
- **Cancelled**: Gray - Dare cancelled

## Installation & Setup

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- Web3 wallet (MetaMask, WalletConnect, etc.)

### 2. Clone & Install

```bash
# Clone the project
git clone <repo-url>
cd dare-protocol-dapp

# Install dependencies
npm install

# Or with yarn
yarn install
```

### 3. Configuration

The app is pre-configured for Base Sepolia. No env vars needed for basic operation.

To use on a different chain, update `/lib/web3-config.ts`:

```typescript
// Change these values
export const DARE_CONTRACT_ADDRESS = '0x...'; // Your contract address
export const BASE_SEPOLIA_CHAIN_ID = 84532;  // Your chain ID

// Update the config
export const config = createConfig({
  chains: [yourChain],  // Import your chain from wagmi/chains
  transports: {
    [yourChain.id]: http('your-rpc-url'),
  },
});
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dare-protocol-dapp/
├── app/
│   ├── layout.tsx              # Root layout with Web3Provider
│   ├── globals.css             # Glassy theme styles
│   ├── page.tsx                # Explore Dares (landing + list)
│   ├── create/
│   │   └── page.tsx            # Create Dare form
│   ├── my-dares/
│   │   └── page.tsx            # My Dares view
│   ├── reputation/
│   │   └── page.tsx            # Reputation & XP system
│   └── judge/
│       └── page.tsx            # Judge panel
├── components/
│   ├── header.tsx              # Navigation header
│   ├── dare-card.tsx           # Reusable dare card
│   ├── web3-provider.tsx       # Wagmi provider setup
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── web3-config.ts          # Wagmi config & contract ABI
│   ├── types.ts                # TypeScript definitions
│   └── utils-dare.ts           # Utility functions
└── public/
    └── images/
        └── logo.png            # Dare Protocol logo
```

## Smart Contract Integration

### Contract Address

**Base Sepolia**: `0xA350dDf25f6851EDe98A59E92977Dd6Fe5Fd3C6D`

### Key Functions

#### Write Functions (require wallet)

- `createDare(description, duration, token, stake)` - Create a new dare
- `acceptDare(dareId)` - Accept an open dare
- `cancelDare(dareId)` - Cancel own dare (open dares only)
- `submitProof(dareId, proofURI)` - Submit proof after deadline
- `approveProof(dareId)` - Creator approves proof
- `disputeProof(dareId)` - Creator disputes proof
- `judgeResolve(dareId, winner)` - Judge resolves dispute
- `autoResolve(dareId)` - Auto-resolve after confirm window

#### Read Functions

- `dareCount()` - Total number of dares
- `dares(id)` - Get dare details by ID
- `xp(address)` - Get XP for an address
- `badge(address)` - Get badge for an address
- `judge` - Get judge address
- `treasury` - Get treasury address
- `protocolFeeBps` - Get protocol fee (basis points)
- `CONFIRM_WINDOW` - Confirmation window (24 hours)
- `XP_WIN` - XP gained per win (100)

## Key Features in Detail

### 1. Dare Lifecycle

1. **Creator** creates a dare with description, duration, and stake
2. **Other user** accepts dare with matching stake
3. **Time runs** - no shortcuts
4. **Accepter** submits proof after deadline
5. **Creator** can approve or dispute proof
6. **Judge** resolves disputes if needed
7. **Winner** receives pooled stakes minus fees

### 2. Reputation System

- **XP**: Earned by winning dares (+100 per win)
- **Badges**: Visual indicators of reputation
  - 🥉 Bronze: 100 XP
  - 🥈 Silver: 500 XP
  - 🥇 Gold: 1,000 XP
- **Non-transferable**: XP is tied to your address
- **Public**: All XP and badges are onchain

### 3. Judge Arbitration

- **Judge Address**: Public and transparent
- **Powers**: Resolve only disputed dares
- **Limits**: Cannot interfere with undisputed dares, steal funds, or change rules
- **Accountability**: All actions are onchain

### 4. Payment Options

- **ETH**: Native chain token (address(0))
- **ERC20**: Any ERC20 token by address
- **Pool**: Stake + Accepter Stake = Winner Prize Pool (minus protocol fees)

## Transaction Flow Example

### Creating a Dare

```typescript
// 1. User clicks "Create Dare"
// 2. Form collects: description, duration, stake, token choice
// 3. If ETH: send stake as msg.value
// 4. Contract emits DareCreated event
// 5. UI shows success and links to dare

// Code example (from /app/create/page.tsx):
writeContract({
  address: DARE_CONTRACT_ADDRESS,
  abi: DARE_CONTRACT_ABI,
  functionName: 'createDare',
  args: [
    'Run 5km in under 30 minutes',
    BigInt(86400 * 7),  // 7 days
    '0x0000000000000000000000000000000000000000',  // ETH
    parseEther('0.1'),  // 0.1 ETH stake
  ],
  value: parseEther('0.1'),  // Include value for ETH
});
```

### Accepting a Dare

```typescript
// 1. User sees open dare
// 2. Clicks "Accept Dare"
// 3. Same stake amount required
// 4. Contract updates dare status to Running
// 5. Accepter must wait until deadline to submit proof

writeContract({
  address: DARE_CONTRACT_ADDRESS,
  abi: DARE_CONTRACT_ABI,
  functionName: 'acceptDare',
  args: [dareId],
  value: dareStakeAmount,  // If ETH dare
});
```

## Error Handling

The UI gracefully handles:

- **Wallet not connected**: Prompt to connect
- **Wrong network**: Display chain info
- **Insufficient balance**: Transaction will fail on chain
- **Transaction errors**: Display error message from contract
- **Rate limits**: Prevent double-clicks during pending

## Testing

### On Base Sepolia Testnet

1. Get testnet ETH from a faucet
2. Connect MetaMask to Base Sepolia
3. Create a dare
4. Use a different wallet to accept
5. After deadline, submit proof
6. Approve or dispute proof
7. Check XP and badges

### Common Test Scenarios

- Create dare → Cancel (before acceptance)
- Create dare → Accept → Submit Proof → Auto Resolve
- Create dare → Accept → Submit Proof → Dispute → Judge Resolve
- Check XP progression and badge upgrades

## Deployment

### Deploy to Vercel

```bash
# Connect GitHub repo
# Push to main branch
# Vercel auto-deploys

# Or manual deploy
vercel deploy
```

### Build for Production

```bash
npm run build
npm run start
```

## Security Considerations

### Smart Contract Security

- **Non-custodial**: Protocol never holds funds (user wallets + smart contracts)
- **Deterministic**: Onchain rules, no offchain modifications
- **Transparent**: All events emitted and indexed

### Frontend Security

- **No private keys stored**: Uses Web3 wallet for signing
- **Input validation**: All forms validate before submission
- **No localStorage**: Data from blockchain only
- **HTTPS only**: Use HTTPS in production

## FAQ

**Q: Is my data safe?**
A: You control your wallet and sign all transactions. Data is on the public blockchain.

**Q: What if the judge is malicious?**
A: Only judges can resolve disputes. You can see all judge actions onchain. Future versions may make the judge role configurable.

**Q: Can I cancel after acceptance?**
A: No. Once accepted, dares are locked until resolved.

**Q: What tokens can I use?**
A: Any ERC20 token or ETH (address(0)).

**Q: How long is the confirmation window?**
A: 24 hours. After proof submission, if not disputed within 24h, it auto-resolves.

## Support & Contact

- **GitHub Issues**: Report bugs and request features
- **Documentation**: See `/FAQ-ENmh1.txt` for full FAQ and legal disclaimer
- **Discord**: Community support (if applicable)

## License

This project is provided as-is for the DARE Protocol.

## Disclaimer

DARE Protocol is experimental software. Smart contracts may contain bugs. Use at your own risk. No financial advice. Non-custodial system.

---

**Made with ❤️ for the Web3 community**

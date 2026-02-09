# DARE PROTOCOL DApp - Quick Start Guide

Get up and running with the DARE Protocol dapp in 5 minutes.

## 1️⃣ Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or yarn
- ✅ MetaMask or any Web3 wallet
- ✅ Base Sepolia testnet access

## 2️⃣ Installation

```bash
# Clone repository
git clone <repo-url>
cd dare-protocol-dapp

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 3️⃣ Connect Your Wallet

1. Click **"Connect Wallet"** in top-right
2. Select MetaMask (or WalletConnect)
3. Approve connection
4. Make sure you're on **Base Sepolia** network

## 4️⃣ Get Test ETH

Visit a Base Sepolia faucet:
- [Base Sepolia Faucet](https://www.basechain.org/news/base-sepolia-testnet-ethernal-faucet-guide)
- [Infura Faucet](https://infura.io/faucet/sepolia)

Request test ETH for your wallet.

## 5️⃣ Create Your First Dare

1. Go to **Create** page
2. Fill in form:
   - **Description**: "Learn Solidity in 1 week"
   - **Duration**: 7 days
   - **Stake**: 0.01 ETH
   - **Token**: Use ETH
3. Click **"Create Dare"**
4. Approve transaction in wallet
5. ✅ Dare created!

## 6️⃣ Accept a Dare

Using a different wallet:

1. Go to **Explore** page
2. Find your dare
3. Click **"Accept Dare"**
4. Send matching stake (0.01 ETH)
5. ✅ Dare accepted!

## 7️⃣ Submit Proof

After deadline (7 days):

1. Go to **My Dares** → **Accepted**
2. Click **"Submit Proof"**
3. Add proof URI (any URL, IPFS hash, etc.)
4. Example: `https://github.com/username/solidity-learn`
5. Click **"Submit Proof"**
6. ✅ Proof submitted!

## 8️⃣ Approve Proof

As the creator:

1. Go to **My Dares** → **Created**
2. Find dare with proof
3. Click **"Approve Proof"**
4. ✅ Accepter wins! 0.02 ETH paid to them
5. Check **Reputation** to see new XP

## 🎯 Common Actions

### I Created a Dare but No One Accepted

The dare auto-cancels after 24 hours and your stake is refunded.

### I Accepted but the Creator Disputes

1. Judge will review proof
2. Go to **Judge Panel** (if you're the judge)
3. Resolve with a winner
4. Winner gets paid

### I Want to Check Someone's Reputation

1. Go to **Reputation** page
2. Scroll to "Check Other Profiles"
3. Enter wallet address
4. See their XP and badge level

### How Do I Get Badges?

Win dares and earn XP:

- 🥉 **Bronze**: 100 XP
- 🥈 **Silver**: 500 XP
- 🥇 **Gold**: 1,000 XP

Each win = +100 XP

## 🔥 Pro Tips

1. **Be Specific**: Clear descriptions = less disputes
2. **Reasonable Timeline**: Too short = too hard, too long = commitment issues
3. **Good Proof**: Links to verifiable sources (GitHub commits, social media posts, etc.)
4. **Build Reputation**: Higher XP = more trust
5. **Community Dares**: Create dares about fitness, learning, projects - build accountability

## ⚠️ Important Notes

- ❌ **No Cancelling After Acceptance**: You're locked in
- ⏰ **Confirmation Window**: 24 hours to dispute proof
- 👨‍⚖️ **Judge Arbitration**: Only for disputed dares
- 🔒 **Non-Custodial**: You control your wallet
- 📊 **Everything Onchain**: All data is public

## 🐛 Troubleshooting

### "Wrong Network"

Make sure MetaMask is set to **Base Sepolia**:
1. Click network dropdown in MetaMask
2. Select "Base Sepolia"
3. Refresh page

### "Insufficient Balance"

You need ETH for:
- Dare stake (0.01 ETH for test)
- Gas fees (~0.001 ETH per transaction)

Get more from faucet.

### "Transaction Failed"

Check:
1. Network is Base Sepolia
2. You have enough ETH
3. Wallet is unlocked
4. Gas price is reasonable
5. Try again

### "Can't See My Dare"

1. Refresh page (F5)
2. Check you're on right wallet
3. Check **My Dares** page (not just Explore)

## 📚 Learn More

- **Full Docs**: See `/README.md`
- **Contract Details**: See `/docs/CONTRACT_GUIDE.md`
- **FAQ**: See `/FAQ.txt` in docs
- **Smart Contract**: [Base Sepolia Explorer](https://sepolia.basescan.org/address/0xA350dDf25f6851EDe98A59E92977Dd6Fe5Fd3C6D)

## 🎓 Example Dare Ideas

**Fitness**:
- Run 5km in 30 minutes
- Complete 30-day workout challenge
- Hit new PR in gym

**Learning**:
- Learn Solidity in 2 weeks
- Complete online course
- Build and deploy dapp

**Creative**:
- Write 10,000 words
- Create music/art
- Launch side project

**Habit**:
- No social media for 7 days
- Daily meditation for 30 days
- Read 1 book in 2 weeks

## 🚀 Next Steps

1. ✅ Create your first dare
2. ✅ Get someone to accept
3. ✅ Complete the dare
4. ✅ Submit proof
5. ✅ Build your reputation
6. ✅ Inspire others

---

**Questions?** Check the FAQ in the app or read the full documentation.

**Ready?** Go to [http://localhost:3000](http://localhost:3000) and create your first dare! 🚀

Dare. Stake. Prove it. 💪

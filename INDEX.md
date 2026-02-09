# DARE PROTOCOL DApp - Complete Project Index

Welcome to the DARE Protocol dapp! This document is your navigation guide for the entire project.

## 📚 Documentation Guide

### Start Here
1. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Overview of the entire project ⭐ **START HERE**
2. **[README.md](./README.md)** - Complete feature guide and setup instructions
3. **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes

### Deployment & Operations
4. **[DEPLOY.md](./DEPLOY.md)** - Production deployment guide
5. **[.env.example](./.env.example)** - Environment variables template
6. **[/docs/CONTRACT_GUIDE.md](./docs/CONTRACT_GUIDE.md)** - Smart contract reference

---

## 🗺️ Project Directory Map

### App Pages
```
/app
├── page.tsx                    # Explore Dares + Landing page
├── create/page.tsx             # Create Dare form
├── my-dares/page.tsx           # User's dares view
├── reputation/page.tsx         # XP & badge system
├── judge/page.tsx              # Judge panel (judge-only)
└── globals.css                 # Glassy morphism theme styles
```

### Components
```
/components
├── header.tsx                  # Navigation header with wallet connect
├── dare-card.tsx               # Reusable dare card component
├── web3-provider.tsx           # Wagmi provider wrapper
└── ui/                         # shadcn/ui components
```

### Hooks (Custom React Hooks)
```
/hooks
└── use-dare-contract.ts        # Contract interaction hooks
```

### Library (Utilities & Config)
```
/lib
├── web3-config.ts             # Wagmi config + complete ABI
├── types.ts                   # TypeScript interfaces & enums
├── utils-dare.ts              # Formatting & utility functions
└── networks.ts                # Network configurations
```

### Assets
```
/public
├── images/
│   └── logo.png               # DARE Protocol logo
└── ...                        # Other public assets
```

---

## 📄 File Descriptions

### Core Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| **lib/web3-config.ts** | Wagmi setup, full contract ABI | Changing network/contract |
| **lib/networks.ts** | Network configs & contract addresses | Adding new chain |
| **lib/types.ts** | TypeScript enums & interfaces | Schema changes |
| **.env.example** | Environment variable template | Adding new env vars |

### Application Pages

| File | Purpose | Shows |
|------|---------|-------|
| **app/page.tsx** | Landing + Explore dares | All dares with filters |
| **app/create/page.tsx** | Create dare form | Form to create dares |
| **app/my-dares/page.tsx** | User dares view | Created + accepted dares |
| **app/reputation/page.tsx** | Reputation system | XP, badges, profile lookup |
| **app/judge/page.tsx** | Judge interface | Dispute resolution (judge only) |

### Components

| File | Purpose | Used In |
|------|---------|---------|
| **components/header.tsx** | Navigation + wallet | All pages |
| **components/dare-card.tsx** | Dare display | Explore, My Dares |
| **components/web3-provider.tsx** | Web3 setup | Root layout |

### Utilities

| File | Purpose | Contains |
|------|---------|----------|
| **lib/utils-dare.ts** | Utility functions | Format address, time, stake |
| **hooks/use-dare-contract.ts** | Contract hooks | createDare, acceptDare, etc. |

---

## 🚀 Quick Navigation

### I Want To...

**...Set up the project**
→ [QUICKSTART.md](./QUICKSTART.md)

**...Understand the architecture**
→ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

**...Deploy to production**
→ [DEPLOY.md](./DEPLOY.md)

**...Learn about the smart contract**
→ [/docs/CONTRACT_GUIDE.md](./docs/CONTRACT_GUIDE.md)

**...Find a specific component**
→ See [Components](#components) section below

**...Configure for different chain**
→ Edit [lib/web3-config.ts](./lib/web3-config.ts) and [lib/networks.ts](./lib/networks.ts)

**...Understand the dare lifecycle**
→ [README.md](./README.md#dare-lifecycle-example)

**...Check security practices**
→ [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#-security--best-practices)

---

## 🎯 Feature Matrix

| Feature | File | Status |
|---------|------|--------|
| Explore dares | app/page.tsx | ✅ Complete |
| Create dare | app/create/page.tsx | ✅ Complete |
| Accept dare | dare-card.tsx | ✅ Complete |
| Submit proof | dare-card.tsx | ✅ Complete |
| Approve proof | dare-card.tsx | ✅ Complete |
| Dispute proof | dare-card.tsx | ✅ Complete |
| Auto-resolve | dare-card.tsx | ✅ Complete |
| Judge resolve | app/judge/page.tsx | ✅ Complete |
| XP tracking | app/reputation/page.tsx | ✅ Complete |
| Badges | app/reputation/page.tsx | ✅ Complete |
| Wallet connect | components/header.tsx | ✅ Complete |
| Mobile responsive | app/globals.css | ✅ Complete |
| Glassy UI | app/globals.css | ✅ Complete |

---

## 💻 Development Workflow

### Getting Started
```bash
npm install
npm run dev
```

### Making Changes
1. Edit component/page in `/app` or `/components`
2. Hot reload auto-refreshes
3. Check browser console for errors
4. TypeScript catches type errors

### Adding Features
1. Create component in `/components`
2. Use hooks from `/hooks/use-dare-contract.ts`
3. Import utilities from `/lib`
4. Add types to `/lib/types.ts`

### Testing Locally
1. Connect wallet (MetaMask)
2. Use Base Sepolia testnet
3. Get test ETH from faucet
4. Try all user flows

---

## 🔧 Key Code Locations

### Smart Contract Integration
- **Full ABI**: [lib/web3-config.ts](./lib/web3-config.ts) (lines ~10-468)
- **Contract Address**: [lib/web3-config.ts](./lib/web3-config.ts) (line 3)
- **Wagmi Config**: [lib/web3-config.ts](./lib/web3-config.ts) (lines ~470+)

### Utility Functions
- **Format Address**: [lib/utils-dare.ts](./lib/utils-dare.ts) line 2
- **Format Stake**: [lib/utils-dare.ts](./lib/utils-dare.ts) line 27
- **Get Relative Time**: [lib/utils-dare.ts](./lib/utils-dare.ts) line 14
- **Get Dare Actions**: [lib/utils-dare.ts](./lib/utils-dare.ts) line 60

### Contract Hooks
- **useDareCount**: [hooks/use-dare-contract.ts](./hooks/use-dare-contract.ts) line 6
- **useDareDetails**: [hooks/use-dare-contract.ts](./hooks/use-dare-contract.ts) line 13
- **useDareActions**: [hooks/use-dare-contract.ts](./hooks/use-dare-contract.ts) line 60

### UI Styles
- **Glass effect**: [app/globals.css](./app/globals.css) line 116
- **Status badges**: [app/globals.css](./app/globals.css) line 150
- **Animations**: [app/globals.css](./app/globals.css) line 179

---

## 🎨 Design System

All custom CSS classes documented in [app/globals.css](./app/globals.css):

- `.glass` - Base glass effect
- `.glass-light` - Lighter variant
- `.glass-gold` - Gold-tinted glass
- `.glow-gold` - Gold glow effect
- `.gradient-text` - Gold gradient text
- `.btn-gold` - Primary gold button
- `.btn-glass` - Secondary glass button
- `.status-badge` - Status indicator badge
- `.status-[open/running/proof/disputed/resolved/cancelled]` - Status colors

---

## 📊 Code Statistics

- **TypeScript Files**: ~15 files
- **React Components**: 6 page + 4 component = 10 total
- **Custom Hooks**: 1 file with 8+ hook functions
- **Utility Functions**: 10+ helper functions
- **Lines of Code**: ~2,500+ across app
- **Documentation**: 4 guides + inline comments
- **Test Coverage**: Ready for testing

---

## 🔐 Important Notes

### Do NOT:
- ❌ Commit private keys anywhere
- ❌ Store secrets in `.env` (committed)
- ❌ Hardcode API keys in code
- ❌ Use `localStorage` for sensitive data

### Do:
- ✅ Use wallet for signing (user controls keys)
- ✅ Use `.env.local` for local secrets (not committed)
- ✅ Add env vars to Vercel dashboard for production
- ✅ Use React Query for data caching

---

## 📞 Support Resources

### Official Docs
- **Wagmi**: https://wagmi.sh
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com
- **Base**: https://docs.base.org

### Within This Project
- **FAQ**: See landing page or [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Troubleshooting**: See [README.md](./README.md#troubleshooting)
- **Deployment Help**: See [DEPLOY.md](./DEPLOY.md)

---

## 🗺️ File Access Guide

### By Purpose

**I need to...**

| Need | Go To |
|------|-------|
| Create a dare | `/app/create/page.tsx` |
| List dares | `/app/page.tsx` |
| Show dare card | `/components/dare-card.tsx` |
| Format values | `/lib/utils-dare.ts` |
| Call contract | `/hooks/use-dare-contract.ts` |
| Configure wagmi | `/lib/web3-config.ts` |
| Add enum/type | `/lib/types.ts` |
| Change theme | `/app/globals.css` |
| Add navigation link | `/components/header.tsx` |
| Update network | `/lib/networks.ts` |

---

## ✅ Checklist for First Run

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Connect wallet
- [ ] Get test ETH
- [ ] Read [QUICKSTART.md](./QUICKSTART.md)
- [ ] Create first dare
- [ ] Accept with different wallet
- [ ] Submit proof
- [ ] Check reputation
- [ ] Deploy to Vercel

---

## 🎓 Learning Path

1. **Understand Architecture**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. **Get Running**: [QUICKSTART.md](./QUICKSTART.md)
3. **Learn Contract**: [/docs/CONTRACT_GUIDE.md](./docs/CONTRACT_GUIDE.md)
4. **Explore Code**: Start with `/app/page.tsx`
5. **Try Features**: Create dare → Accept → Submit → Resolve
6. **Deploy**: Follow [DEPLOY.md](./DEPLOY.md)

---

## 🚀 Next Steps

1. **First Time?** → Start with [QUICKSTART.md](./QUICKSTART.md)
2. **Want to Deploy?** → Read [DEPLOY.md](./DEPLOY.md)
3. **Need Details?** → Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
4. **Understand Contract?** → See [/docs/CONTRACT_GUIDE.md](./docs/CONTRACT_GUIDE.md)
5. **Ready to Develop?** → Edit files in `/app` and `/components`

---

**Last Updated**: 2026-02-03  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

**Dare. Stake. Prove it.** 🚀

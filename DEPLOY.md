# Deployment Guide - DARE Protocol DApp

Deploy your DARE Protocol dapp to production using Vercel or traditional hosting.

## 🚀 Deploy to Vercel (Recommended)

Vercel is optimized for Next.js apps and has zero-config deployment.

### 1. Push Code to GitHub

```bash
# Initialize Git (if not done)
git init
git add .
git commit -m "Initial commit: DARE Protocol dapp"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dare-protocol-dapp.git
git push -u origin main
```

### 2. Connect to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"Add New Project"**
4. Select your repository
5. Click **"Import"**
6. Keep default settings
7. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# When asked about settings, use defaults
```

### 3. Configuration (Optional)

The app works out of the box with Base Sepolia. To customize:

1. In Vercel dashboard: **Settings** → **Environment Variables**
2. Add any custom env vars (optional)
3. Redeploy: **Deployments** → **Redeploy**

### 4. Success! 🎉

Your app is live at: `https://your-project.vercel.app`

---

## 📦 Build & Deploy Manually

For self-hosted or alternative hosting.

### 1. Build Production Bundle

```bash
npm run build
```

This creates a `.next` directory with optimized code.

### 2. Start Production Server

```bash
npm run start
```

Server runs on `http://localhost:3000` (or set PORT env var).

### 3. Deploy to Your Server

**Using Docker (Recommended)**:

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next .next
COPY public public

EXPOSE 3000

CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t dare-protocol-dapp .
docker run -p 3000:3000 dare-protocol-dapp
```

**Using PM2 (Node Process Manager)**:

```bash
npm install -g pm2

pm2 start "npm run start" --name "dare-dapp"
pm2 save
pm2 startup
```

**Using systemd (Linux)**:

Create `/etc/systemd/system/dare-dapp.service`:
```ini
[Unit]
Description=DARE Protocol DApp
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/ubuntu/dare-protocol-dapp
ExecStart=/usr/bin/npm start
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable dare-dapp
sudo systemctl start dare-dapp
```

---

## 🌐 Configure Production Environment

### 1. Update Contract Address (If Needed)

Edit `/lib/web3-config.ts`:

```typescript
// Change this to your contract address if using different chain
export const DARE_CONTRACT_ADDRESS = '0x...'; // Your contract

// Change chain if not Base Sepolia
import { baseSepolia, mainnet, optimism } from 'wagmi/chains';
export const config = createConfig({
  chains: [baseSepolia],  // Change here
  // ...
});
```

### 2. Custom RPC Provider

```typescript
transports: {
  [baseSepolia.id]: http('https://your-rpc-url.com'),
},
```

### 3. Environment Variables

Create `.env.local` (not .env - not committed):

```bash
# Only needed for custom RPC or analytics
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CHAIN_ID=84532
```

### 4. Analytics (Optional)

Vercel Analytics is auto-enabled. To disable:

In `app/layout.tsx`:
```typescript
// Remove or comment out
// <Analytics />
```

---

## 🔒 Security Checklist

- [ ] No private keys in code or .env files
- [ ] All wallet connections use standard Web3 libraries
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] CSP headers configured (check Vercel settings)
- [ ] No sensitive data logged
- [ ] Contract address is public (non-sensitive)
- [ ] RPC endpoints are public (non-sensitive)

---

## 📊 Monitoring & Logs

### Vercel Dashboard

1. **Deployments** tab: See all deployments
2. **Logs** tab: View build and runtime logs
3. **Analytics** tab: View traffic and performance
4. **Integrations** tab: Connect services

### Local Logs

```bash
# Development
npm run dev

# Production server
npm run start
```

---

## 🆘 Troubleshooting

### Deploy Fails with "Build Error"

Check logs in Vercel dashboard. Common issues:

1. **TypeScript errors**: `npm run build` locally to debug
2. **Missing dependencies**: Run `npm install` and commit lock file
3. **Environment variables**: Ensure correct format in Vercel

### App Runs Slow

1. Check network requests in DevTools
2. Verify RPC endpoint is responding
3. Use Lighthouse for performance audit

### Wallet Connection Fails

1. Verify correct chain ID (Base Sepolia: 84532)
2. Check contract address is correct
3. Test with different wallets

### Transactions Revert

1. Check Basescan for error reason
2. Verify wallet has enough gas
3. Ensure on correct network

---

## 🔄 Update & Redeploy

### Git-based (Recommended)

```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push origin main

# Vercel auto-deploys on push!
```

### Manual Redeploy

In Vercel dashboard:
1. **Deployments** tab
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**

---

## 📈 Scale for Production

### High Traffic

- Enable edge caching in Vercel
- Use CDN for static assets (Vercel does this)
- Consider read-only RPC endpoints with load balancing

### Multiple Contracts

Update `/lib/web3-config.ts`:
```typescript
// Support multiple contracts
export const CONTRACTS = {
  mainnet: '0x...',
  sepolia: '0x...',
};
```

### Custom Domain

In Vercel dashboard:
1. **Settings** → **Domains**
2. Add custom domain
3. Update DNS records (Vercel provides instructions)

---

## 🧪 Pre-Production Checklist

- [ ] Test all pages (/, /create, /my-dares, /reputation, /judge)
- [ ] Test with multiple wallets
- [ ] Test on actual Base Sepolia testnet
- [ ] Check mobile responsiveness
- [ ] Test wallet connection/disconnection
- [ ] Test transaction flows (create, accept, submit, etc.)
- [ ] Verify gas costs are reasonable
- [ ] Check error messages are user-friendly
- [ ] Verify no console errors in DevTools
- [ ] Test page load times

---

## 📝 Going Mainnet (When Ready)

To deploy on production Base network:

1. **Update Contract Address**: Point to mainnet deployment
2. **Change RPC**: Use Base mainnet RPC
3. **Update Chain**:
   ```typescript
   import { base } from 'wagmi/chains';
   chains: [base],  // Instead of baseSepolia
   ```
4. **Verify Everything**:
   - Contract address is correct
   - Contract is deployed on that chain
   - RPC endpoint works
5. **Test on Testnet First**: Deploy to staging first!
6. **Monitor**: Watch for errors, track gas costs

---

## 💡 Tips

1. **Version Control**: Always use git for deployment tracking
2. **Staging Environment**: Test on testnet before mainnet
3. **Monitoring**: Set up alerts for errors
4. **Backups**: Keep production configs backed up
5. **Documentation**: Keep deployment notes updated

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Wagmi Docs**: [wagmi.sh](https://wagmi.sh)
- **Base Docs**: [docs.base.org](https://docs.base.org)

---

Happy deploying! 🚀

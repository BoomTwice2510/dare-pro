/**
 * Network configurations for DARE Protocol DApp
 * Easily switch between different chains by updating this file
 */

export const NETWORKS = {
  baseSepolia: {
    id: 84532,
    name: 'Base Sepolia',
    rpc: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    currency: 'ETH',
    testnet: true,
  },
  baseMainnet: {
    id: 8453,
    name: 'Base Mainnet',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    currency: 'ETH',
    testnet: false,
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpc: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    testnet: true,
  },
  optimismSepolia: {
    id: 11155420,
    name: 'Optimism Sepolia',
    rpc: 'https://sepolia.optimism.io',
    explorer: 'https://sepolia-optimism.etherscan.io',
    currency: 'ETH',
    testnet: true,
  },
};

// Current active network - Change this to switch chains
export const ACTIVE_NETWORK = NETWORKS.baseSepolia;

/**
 * Contract addresses by network
 * Add your contract deployments here
 */
export const CONTRACT_ADDRESSES: Record<number, string> = {
  [NETWORKS.baseSepolia.id]: '0xA350dDf25f6851EDe98A59E92977Dd6Fe5Fd3C6D',
  [NETWORKS.baseMainnet.id]: '0x...', // TODO: Add mainnet contract
  [NETWORKS.sepolia.id]: '0x...', // TODO: Add Sepolia contract
  [NETWORKS.optimismSepolia.id]: '0x...', // TODO: Add Optimism contract
};

/**
 * Get contract address for current network
 */
export function getContractAddress(chainId: number = ACTIVE_NETWORK.id): string {
  const address = CONTRACT_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`No contract address configured for chain ${chainId}`);
  }
  return address;
}

/**
 * Get network config by chain ID
 */
export function getNetworkConfig(chainId: number) {
  return Object.values(NETWORKS).find(n => n.id === chainId) || ACTIVE_NETWORK;
}

/**
 * Faucets for testnet ETH
 */
export const FAUCETS: Record<number, string> = {
  [NETWORKS.baseSepolia.id]: 'https://www.basechain.org/news/base-sepolia-testnet-ethernal-faucet-guide',
  [NETWORKS.sepolia.id]: 'https://www.infura.io/faucet/sepolia',
  [NETWORKS.optimismSepolia.id]: 'https://faucet.goerli.base.org',
};

/**
 * RPC endpoints (can be customized)
 */
export const RPC_ENDPOINTS: Record<number, string> = {
  [NETWORKS.baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || NETWORKS.baseSepolia.rpc,
  [NETWORKS.baseMainnet.id]: process.env.NEXT_PUBLIC_BASE_MAINNET_RPC || NETWORKS.baseMainnet.rpc,
  [NETWORKS.sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_RPC || NETWORKS.sepolia.rpc,
  [NETWORKS.optimismSepolia.id]: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC || NETWORKS.optimismSepolia.rpc,
};

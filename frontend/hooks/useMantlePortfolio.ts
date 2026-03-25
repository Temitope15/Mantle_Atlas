import { useAccount, useBalance } from 'wagmi';
import { mantle } from 'wagmi/chains';

export interface WalletPortfolio {
  mnt: string;
  meth: string;
  isConnected: boolean;
  address?: string;
}

export function useMantlePortfolio() {
  const { address, isConnected } = useAccount();

  // Fetch native MNT balance
  const { data: mntBalance } = useBalance({
    address,
    chainId: mantle.id,
  });

  // Fetch mETH balance
  const { data: methBalance } = useBalance({
    address,
    chainId: mantle.id,
    token: '0xd5F12290333be6D64527dfb3873430C5D76f87C4', // mETH contract on Mantle
  });

  return {
    mnt: mntBalance?.formatted || '0',
    meth: methBalance?.formatted || '0',
    isConnected,
    address,
  };
}

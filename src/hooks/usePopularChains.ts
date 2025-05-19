import { useState, useEffect, useCallback } from 'react';
import { getPopularChains } from '../api/chainService';
import { Chain } from '../types/chain';
import { getStatusMessages } from '../config/constants';

/**
 * 인기 체인점 목록을 가져오는 커스텀 훅
 */
export const usePopularChains = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getPopularChains();
      setChains(data);
    } catch (err) {
      console.error('Failed to fetch popular chains:', err);
      const STATUS_MESSAGES = getStatusMessages();
      setError(STATUS_MESSAGES.error.chains);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChains();
  }, [fetchChains]);

  return { chains, loading, error, refetch: fetchChains };
}; 
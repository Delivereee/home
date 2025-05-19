import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopularChains } from '../hooks/usePopularChains';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { STATUS_MESSAGES } from '../config/constants';
import ImageWithFallback from './ImageWithFallback';

const PopularChains: React.FC = () => {
  const { chains, loading, error, refetch } = usePopularChains();
  const navigate = useNavigate();
  
  // 체인점 클릭 핸들러
  const handleChainClick = (chainId: string, chainName: string) => {
    navigate(`/chains/${chainId}/${encodeURIComponent(chainName)}`);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
        <LoadingState height="h-20" message={STATUS_MESSAGES.loading.chains} />
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
        <ErrorState height="h-20" message={error} onRetry={refetch} />
      </div>
    );
  }

  // 체인점이 없는 경우
  if (chains.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
        <EmptyState message={STATUS_MESSAGES.empty.chains} />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide pb-2 space-x-4 border-b border-gray-200" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {chains.map((chain) => (
            <div 
              key={chain.id} 
              className="flex flex-col items-center min-w-[80px] pb-3 cursor-pointer"
              onClick={() => handleChainClick(chain.id, chain.name)}
            >
              <div className="w-16 h-16 p-0 flex items-center justify-center mb-2">
                <ImageWithFallback 
                  src={chain.imageUrl} 
                  alt={chain.name} 
                  className="w-14 h-14 rounded-full object-cover shadow-md"
                  style={{ display: 'block' }}
                  fallback="https://delivereee.github.io/home/images/chains/default-logo.png"
                />
              </div>
              <span className="text-sm text-center">{chain.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularChains; 
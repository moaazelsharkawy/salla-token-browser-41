import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PiPriceData {
  price: string;
  change24h: string;
  lastUpdate: number;
}

interface StPriceData {
  estimated_price: number;
  change24h?: string;
  lastUpdate: number;
}

export const PriceTracker = () => {
  const { t } = useTranslation();
  const [piPrice, setPiPrice] = useState<PiPriceData | null>(null);
  const [stPrice, setStPrice] = useState<StPriceData | null>(null);
  const [prevStPrice, setPrevStPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPiPrice = async () => {
    try {
      const response = await fetch('https://www.okx.com/api/v5/market/index-tickers?instId=PI-USDT');
      const data = await response.json();
      
      if (data.code === '0' && data.data && data.data.length > 0) {
        const priceData = data.data[0];
        setPiPrice({
          price: parseFloat(priceData.idxPx).toFixed(6),
          change24h: parseFloat(priceData.open24h ? 
            ((parseFloat(priceData.idxPx) - parseFloat(priceData.open24h)) / parseFloat(priceData.open24h) * 100).toFixed(2) 
            : '0').toString(),
          lastUpdate: Date.now()
        });
      }
    } catch (err) {
      console.error('Error fetching Pi price:', err);
      setError('Failed to fetch Pi price');
    }
  };

  const fetchStPrice = async () => {
    try {
      const response = await fetch('https://sallanet.com/wp-json/swap-plugin/v1/st-price');
      const data = await response.json();
      
      const currentPrice = parseFloat(data.estimated_price || data.price || '0');
      let change24h = '0';
      
      if (prevStPrice !== null && prevStPrice !== 0) {
        const changePercent = ((currentPrice - prevStPrice) / prevStPrice * 100);
        change24h = changePercent.toFixed(2);
      }
      
      setPrevStPrice(currentPrice);
      setStPrice({
        estimated_price: currentPrice,
        change24h,
        lastUpdate: Date.now()
      });
    } catch (err) {
      console.error('Error fetching ST price:', err);
      setError('Failed to fetch ST price');
    }
  };

  const fetchPrices = async (isManual = false) => {
    if (isManual) {
      setIsManualRefresh(true);
    }
    setError(null);
    
    await Promise.all([fetchPiPrice(), fetchStPrice()]);
    
    if (isManual) {
      setIsManualRefresh(false);
    }
    setIsLoading(false);
  };

  const fetchPricesSilently = async () => {
    setError(null);
    await Promise.all([fetchPiPrice(), fetchStPrice()]);
  };

  useEffect(() => {
    fetchPrices();
    
    // Update prices every 30 seconds silently
    const interval = setInterval(fetchPricesSilently, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(6);
  };

  const getPriceColor = (change: string) => {
    const changeNum = parseFloat(change);
    if (changeNum > 0) return 'text-green-500';
    if (changeNum < 0) return 'text-red-500';
    return 'text-foreground';
  };

  return (
    <div className="w-full px-4 py-3 bg-gradient-to-r from-background/30 to-muted/10 border-b border-border/30 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground/90">{t('prices.livePrices')}</h3>
          <button
            onClick={() => fetchPrices(true)}
            disabled={isManualRefresh}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isManualRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-500 mb-2 text-center">{error}</div>
        )}

        {/* Price cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* ST Price Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
            <div className="relative bg-background/70 backdrop-blur-md rounded-xl border border-border/30 p-3 hover:border-secondary/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-secondary">ST</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary-foreground">S</span>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-1">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 bg-muted/30 rounded animate-pulse w-1/2" />
                </div>
              ) : stPrice ? (
                <>
                  <div className={`text-sm font-bold ${stPrice.change24h ? getPriceColor(stPrice.change24h) : 'text-foreground'}`}>
                    ${formatPrice(stPrice.estimated_price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{t('prices.estimated')}</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
            </div>
          </div>

          {/* Pi Price Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300" />
            <div className="relative bg-background/70 backdrop-blur-md rounded-xl border border-border/30 p-3 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-primary">PI</span>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary-foreground">π</span>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-1">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 bg-muted/30 rounded animate-pulse w-2/3" />
                </div>
              ) : piPrice ? (
                <>
                  <div className={`text-sm font-bold ${getPriceColor(piPrice.change24h)}`}>
                    ${formatPrice(piPrice.price)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>24h</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">No data</div>
              )}
            </div>
          </div>
        </div>

        {/* Last update info */}
        {(piPrice || stPrice) && !isLoading && (
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground/60">
              {t('prices.lastUpdated')}: {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

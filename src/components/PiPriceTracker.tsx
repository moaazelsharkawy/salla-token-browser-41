import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PiPriceData {
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: Date;
}

export const PiPriceTracker = () => {
  const [priceData, setPriceData] = useState<PiPriceData>({
    price: 45.12,
    change24h: 2.34,
    changePercent24h: 5.47,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time price updates
  useEffect(() => {
    const updatePrice = () => {
      // Simulate price fluctuation (in a real app, this would be from an API)
      const basePrice = 45.12;
      const randomChange = (Math.random() - 0.5) * 5; // ±2.5 range
      const newPrice = basePrice + randomChange;
      const change24h = (Math.random() - 0.5) * 10; // ±5 range
      const changePercent24h = (change24h / basePrice) * 100;

      setPriceData({
        price: newPrice,
        change24h,
        changePercent24h,
        lastUpdated: new Date()
      });
      setIsLoading(false);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const isPositive = priceData.change24h > 0;
  const isNegative = priceData.change24h < 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-200/20">
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-orange-600">جارٍ تحديث السعر...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-yellow-500/10 rounded-xl border border-orange-200/30 shadow-lg backdrop-blur-sm">
      {/* Pi Symbol */}
      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-md">
        <span className="text-white font-bold text-sm">π</span>
      </div>

      {/* Price Info */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-foreground">
              ${priceData.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Pi Network
          </span>
        </div>

        {/* Change Indicator */}
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
          isPositive && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          isNegative && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          !isPositive && !isNegative && "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        )}>
          <TrendIcon className="w-3 h-3" />
          <span>
            {isPositive ? '+' : ''}{priceData.changePercent24h.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* 24h Change */}
      <div className="flex flex-col items-end">
        <span className={cn(
          "text-sm font-medium",
          isPositive && "text-green-600 dark:text-green-400",
          isNegative && "text-red-600 dark:text-red-400",
          !isPositive && !isNegative && "text-gray-600 dark:text-gray-400"
        )}>
          {isPositive ? '+' : ''}${priceData.change24h.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">
          24h
        </span>
      </div>

      {/* Last Updated */}
      <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground">
        <span>آخر تحديث</span>
        <span>{priceData.lastUpdated.toLocaleTimeString('ar', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}</span>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-muted-foreground">مباشر</span>
      </div>
    </div>
  );
};
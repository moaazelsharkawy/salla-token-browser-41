import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  isVisible: boolean;
  className?: string;
}

export function LoadingSpinner({ isVisible, className }: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md",
      "transition-all duration-500",
      className
    )}>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Modern 3D Spinning Logo with Multiple Rings */}
        <div className="relative w-32 h-32">
          {/* Outermost Ring - Slow rotation */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary/40 border-r-primary/20 animate-spin"
               style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
          </div>
          
          {/* Second Ring - Medium rotation */}
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-secondary/60 border-l-secondary/30 animate-spin"
               style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-secondary rounded-full shadow-lg shadow-secondary/50" />
          </div>
          
          {/* Third Ring - Fast rotation */}
          <div className="absolute inset-6 rounded-full border-3 border-transparent border-t-primary border-r-secondary animate-spin"
               style={{ animationDuration: '1.2s' }}>
          </div>
          
          {/* Fourth Ring - Reverse rotation */}
          <div className="absolute inset-8 rounded-full border-3 border-transparent border-b-primary/70 border-l-secondary/70 animate-spin"
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}>
          </div>
          
          {/* Center Logo Circle with Gradient */}
          <div className="absolute top-1/2 left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-secondary to-primary animate-pulse shadow-2xl shadow-primary/30">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-background to-background/80 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-spin"
                       style={{ animationDuration: '1s' }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 animate-spin"
               style={{ animationDuration: '4s' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50 -translate-x-1/2" />
          </div>
          <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 animate-spin"
               style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-secondary rounded-full shadow-lg shadow-secondary/50 -translate-x-1/2" />
          </div>
        </div>
        
        {/* Loading Text with Gradient */}
        <div className="text-center space-y-4">
          <div className="relative">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse"
               style={{ backgroundSize: '200% auto', animation: 'gradient 3s linear infinite, pulse 2s ease-in-out infinite' }}>
              جاري التحميل
            </p>
            {/* Underline animation */}
            <div className="mt-2 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary"
                 style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30" 
                 style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce shadow-lg shadow-secondary/30" 
                 style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30" 
                 style={{ animationDelay: '300ms' }} />
          </div>
          
          {/* Progress hint */}
          <p className="text-sm text-muted-foreground animate-pulse">
            الرجاء الانتظار...
          </p>
        </div>
      </div>
    </div>
  );
}
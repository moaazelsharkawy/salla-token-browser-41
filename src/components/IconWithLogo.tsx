import { cn } from '@/lib/utils';

interface IconWithLogoProps {
  type: string;
  label: string;
  href?: string;
}

export function IconWithLogo({ type, label, href }: IconWithLogoProps) {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  const getCardDesign = (type: string) => {
    const designs = {
      mining: {
        outerRing: "from-amber-400 via-yellow-500 to-orange-400",
        middleRing: "from-yellow-300 to-amber-400",
        centerBg: "from-orange-500 to-red-500",
        icon: "⛏️",
        shadow: "shadow-amber-500/40",
        centerText: "M"
      },
      deposit: {
        outerRing: "from-emerald-400 via-green-500 to-teal-400",
        middleRing: "from-green-300 to-emerald-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "💰",
        shadow: "shadow-green-500/40",
        centerText: "D"
      },
      withdraw: {
        outerRing: "from-rose-400 via-pink-500 to-red-400",
        middleRing: "from-pink-300 to-rose-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🏦",
        shadow: "shadow-rose-500/40",
        centerText: "W"
      },
      transfer: {
        outerRing: "from-blue-400 via-sky-500 to-cyan-400",
        middleRing: "from-sky-300 to-blue-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "↔️",
        shadow: "shadow-blue-500/40",
        centerText: "T"
      },
      payRequest: {
        outerRing: "from-amber-400 via-yellow-500 to-orange-400",
        middleRing: "from-yellow-300 to-amber-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "📋",
        shadow: "shadow-amber-500/40",
        centerText: "P"
      },
      escrow: {
        outerRing: "from-purple-400 via-violet-500 to-indigo-400",
        middleRing: "from-violet-300 to-purple-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🛡️",
        shadow: "shadow-purple-500/40",
        centerText: "E"
      },
      explorer: {
        outerRing: "from-slate-400 via-gray-500 to-zinc-400",
        middleRing: "from-gray-300 to-slate-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🔍",
        shadow: "shadow-slate-500/40",
        centerText: "X"
      },
      swap: {
        outerRing: "from-violet-400 via-purple-500 to-pink-400",
        middleRing: "from-purple-300 to-violet-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🔄",
        shadow: "shadow-violet-500/40",
        centerText: "S"
      },
      virtualCards: {
        outerRing: "from-amber-400 via-yellow-500 to-orange-400",
        middleRing: "from-yellow-300 to-amber-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "💳",
        shadow: "shadow-amber-500/40",
        centerText: "V"
      },
      developerApi: {
        outerRing: "from-gray-400 via-slate-500 to-zinc-400",
        middleRing: "from-slate-300 to-gray-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "⚡",
        shadow: "shadow-gray-500/40",
        centerText: "A"
      },
      commerce: {
        outerRing: "from-emerald-400 via-green-500 to-teal-400",
        middleRing: "from-green-300 to-emerald-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🛒",
        shadow: "shadow-emerald-500/40",
        centerText: "C"
      },
      p2p: {
        outerRing: "from-sky-400 via-blue-500 to-indigo-400",
        middleRing: "from-blue-300 to-sky-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "👥",
        shadow: "shadow-sky-500/40",
        centerText: "P"
      },
      kyc: {
        outerRing: "from-amber-400 via-yellow-500 to-orange-400",
        middleRing: "from-yellow-300 to-amber-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "✅",
        shadow: "shadow-amber-500/40",
        centerText: "K"
      },
      social: {
        outerRing: "from-purple-400 via-violet-500 to-pink-400",
        middleRing: "from-violet-300 to-purple-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "💬",
        shadow: "shadow-purple-500/40",
        centerText: "S"
      },
      coupons: {
        outerRing: "from-orange-400 via-red-500 to-pink-400",
        middleRing: "from-red-300 to-orange-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🎫",
        shadow: "shadow-orange-500/40",
        centerText: "C"
      },
      piMall: {
        outerRing: "from-amber-400 via-yellow-500 to-orange-400",
        middleRing: "from-yellow-300 to-amber-400",
        centerBg: "from-cyan-500 to-blue-500",
        icon: "🏪",
        shadow: "shadow-amber-500/40",
        centerText: "S"
      }
    };
    
    return designs[type as keyof typeof designs] || designs.deposit;
  };

  const design = getCardDesign(type);

  return (
    <div 
      className="flex flex-col items-center gap-3 p-2 group cursor-pointer"
      onClick={handleClick}
    >
      <div className={cn(
        "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer select-none",
        `shadow-lg ${design.shadow}`,
        "hover:shadow-xl transform-gpu"
      )}>
        {/* Outer golden ring */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br",
          design.outerRing,
          "p-1"
        )}>
          {/* Middle ring */}
          <div className={cn(
            "w-full h-full rounded-full bg-gradient-to-br",
            design.middleRing,
            "p-1.5 flex items-center justify-center"
          )}>
            {/* Inner blue circle with letter */}
            <div className={cn(
              "w-full h-full rounded-full bg-gradient-to-br",
              design.centerBg,
              "flex items-center justify-center relative overflow-hidden"
            )}>
              {/* Center letter */}
              <span className="text-white font-black text-lg z-10 drop-shadow-sm">
                {design.centerText}
              </span>
              
              {/* Subtle inner glow */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
          </div>
        </div>
        
        {/* Decorative icon in corner */}
        <div className="absolute -top-1 -right-1 text-xs bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {design.icon}
        </div>
        
        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-md -z-10",
          `bg-gradient-to-br ${design.outerRing}`
        )} />
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <span className={cn(
        "text-sm font-bold text-center leading-tight max-w-[80px] transition-all duration-300",
        "text-foreground/80 group-hover:text-foreground group-hover:scale-105"
      )}>
        {label}
      </span>
    </div>
  );
}
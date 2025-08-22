import { cn } from '@/lib/utils';

interface AppIconProps {
  image: string;
  label: string;
  variant?: 'default' | 'golden';
  href?: string;
}

export function AppIcon({ image, label, variant = 'default', href }: AppIconProps) {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <div 
      className="flex flex-col items-center gap-3 p-2 group cursor-pointer"
      onClick={handleClick}
    >
      <div className={cn(
        "app-icon",
        variant === 'golden' && "app-icon-golden"
      )}>
        <img 
          src={image} 
          alt={label}
          className="w-12 h-12 object-contain drop-shadow-sm rounded-[5px]"
          style={{ background: 'transparent' }}
        />
      </div>
      <span className="text-sm font-bold text-foreground/80 text-center leading-tight max-w-[80px] group-hover:text-foreground transition-colors">
        {label}
      </span>
    </div>
  );
}
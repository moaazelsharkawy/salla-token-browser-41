import { useState } from 'react';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const isValidUrl = (string: string) => {
    try {
      // Check if it's a URL with protocol
      if (string.startsWith('http://') || string.startsWith('https://')) {
        new URL(string);
        return true;
      }
      // Check if it looks like a domain (contains dots and no spaces)
      if (string.includes('.') && !string.includes(' ') && string.length > 3) {
        new URL(`https://${string}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      
      if (isValidUrl(query)) {
        // It's a URL - navigate directly
        const url = query.startsWith('http') ? query : `https://${query}`;
        window.open(url, '_blank');
      } else {
        // It's a search query - use Google
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(googleSearchUrl, '_blank');
      }
    }
  };

  return (
    <div className="w-full px-4 py-3 bg-gradient-to-r from-background/50 to-muted/20 border-b border-border/50 backdrop-blur-sm">
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative group">
          {/* Background with gradient and blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
          
          {/* Main search container */}
          <div className="relative flex items-center bg-background/80 backdrop-blur-md rounded-2xl border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary/30">
            {/* Search icon */}
            <div className="flex items-center justify-center w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors duration-300">
              <Search className="w-5 h-5" />
            </div>
            
            {/* Input field */}
            <Input
              type="text"
              placeholder="أدخل رابط أو ابحث في جوجل... Enter URL or search Google..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-0 py-3 h-auto"
              dir="auto"
            />
            
            {/* Search button */}
            <Button
              type="submit"
              size="sm"
              className="mr-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 rounded-xl px-4 py-2 h-8 transition-all duration-300 hover:scale-105"
              disabled={!searchQuery.trim()}
            >
              <Globe className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">
                {isValidUrl(searchQuery.trim()) ? 'انتقال' : 'بحث'}
              </span>
            </Button>
          </div>
          
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
               style={{ filter: 'blur(8px)' }} />
        </div>
      </form>
    </div>
  );
};
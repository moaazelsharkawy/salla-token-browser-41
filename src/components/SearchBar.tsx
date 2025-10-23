import { useState, useEffect, useRef } from 'react';
import { Search, Globe, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const FIXED_SUGGESTIONS = [
  {
    id: 'salla-shop-eg',
    title: 'مول سلة شوب EG',
    url: 'https://salla-shop.com/eg',
  },
  {
    id: 'salla-shop-pi',
    title: 'مول سلة شوب PI',
    url: 'https://salla-shop.com',
  },
  {
    id: 'st-whitepaper',
    title: 'الورقة البيضاء ل ST',
    url: 'https://paper.sallanet.com',
  },
];

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { t } = useTranslation();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent searches', e);
      }
    }
  }, []);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

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
      saveToRecentSearches(query);
      
      if (isValidUrl(query)) {
        // It's a URL - navigate directly
        const url = query.startsWith('http') ? query : `https://${query}`;
        window.open(url, '_blank');
      } else {
        // It's a search query - use Google
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(googleSearchUrl, '_blank');
      }
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (url: string) => {
    window.open(url, '_blank');
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(googleSearchUrl, '_blank');
  };

  return (
    <div className="w-full px-4 py-3 bg-gradient-to-r from-background/50 to-muted/20 border-b border-border/50 backdrop-blur-sm">
      <div ref={searchRef} className="relative max-w-2xl mx-auto">
        <form onSubmit={handleSearch}>
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
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
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
                  {isValidUrl(searchQuery.trim()) ? t('navigate') : t('search')}
                </span>
              </Button>
            </div>
            
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
                 style={{ filter: 'blur(8px)' }} />
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute w-full mt-2 z-50">
            <Command className="rounded-2xl border border-border/50 shadow-xl bg-background/95 backdrop-blur-md">
              <CommandList>
                <CommandGroup heading="روابط مقترحة">
                  {FIXED_SUGGESTIONS.map((suggestion) => (
                    <CommandItem
                      key={suggestion.id}
                      onSelect={() => handleSuggestionClick(suggestion.url)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium">{suggestion.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                
                {recentSearches.length > 0 && (
                  <CommandGroup heading="عمليات البحث الأخيرة">
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={`recent-${index}`}
                        onSelect={() => handleRecentSearchClick(search)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 rounded-xl transition-colors"
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
};
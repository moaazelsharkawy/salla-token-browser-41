import { useState, useEffect } from 'react';
import { X, Plus, Star, StarOff, Globe, Lock, History, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading?: boolean;
  isIncognito?: boolean;
}

interface BrowserTabsProps {
  className?: string;
}

export const BrowserTabs = ({ className }: BrowserTabsProps) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ url: string; title: string; timestamp: Date }>>([]);
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const savedFavorites = localStorage.getItem('browser-favorites');
    const savedHistory = localStorage.getItem('browser-history');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedHistory && !isIncognitoMode) {
      setHistory(JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  }, [isIncognitoMode]);

  const isValidUrl = (string: string) => {
    try {
      if (string.startsWith('http://') || string.startsWith('https://')) {
        new URL(string);
        return true;
      }
      if (string.includes('.') && !string.includes(' ') && string.length > 3) {
        new URL(`https://${string}`);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const createNewTab = (url?: string, isIncognito = false) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: url ? (isValidUrl(url) ? url : 'Google Search') : 'New Tab',
      url: url || '',
      isIncognito: isIncognito || isIncognitoMode
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    
    if (url) {
      navigateToUrl(url, newTab.id);
    }
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId && newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  };

  const navigateToUrl = (query: string, tabId?: string) => {
    const targetTabId = tabId || activeTabId;
    if (!targetTabId && tabs.length === 0) {
      createNewTab(query);
      return;
    }

    const url = isValidUrl(query) 
      ? (query.startsWith('http') ? query : `https://${query}`)
      : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Update tab
    setTabs(prev => prev.map(tab => 
      tab.id === targetTabId 
        ? { ...tab, url, title: query, isLoading: true }
        : tab
    ));

    // Add to history (if not incognito)
    if (!isIncognitoMode) {
      const historyEntry = {
        url,
        title: query,
        timestamp: new Date()
      };
      
      setHistory(prev => {
        const newHistory = [historyEntry, ...prev.slice(0, 99)]; // Keep last 100
        localStorage.setItem('browser-history', JSON.stringify(newHistory));
        return newHistory;
      });
    }

    // Open in new window/tab
    window.open(url, '_blank');
    
    // Simulate loading completion
    setTimeout(() => {
      setTabs(prev => prev.map(tab => 
        tab.id === targetTabId 
          ? { ...tab, isLoading: false }
          : tab
      ));
    }, 1000);
  };

  const toggleFavorite = (url: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(url) 
        ? prev.filter(fav => fav !== url)
        : [...prev, url];
      
      localStorage.setItem('browser-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });

    toast({
      description: favorites.includes(url) 
        ? 'تم إزالة الموقع من المفضلة' 
        : 'تم إضافة الموقع للمفضلة'
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('browser-history');
    toast({ description: 'تم مسح سجل التصفح' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToUrl(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={cn("w-full bg-background border-b border-border/50", className)}>
      {/* Tabs Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-muted/30 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center min-w-[200px] max-w-[250px] px-3 py-2 rounded-t-lg border-t border-l border-r cursor-pointer group transition-all duration-200",
              activeTabId === tab.id 
                ? "bg-background border-border text-foreground" 
                : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted"
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.isIncognito && <Lock className="w-3 h-3 mr-1 text-purple-500" />}
            <Globe className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="flex-1 truncate text-xs">{tab.title}</span>
            {tab.isLoading && (
              <div className="w-3 h-3 ml-1 border border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0 ml-1 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 ml-1 hover:bg-accent"
          onClick={() => createNewTab()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-background/50 to-muted/20">
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant={isIncognitoMode ? "default" : "outline"}
            size="sm"
            className="h-8 px-3"
            onClick={() => {
              setIsIncognitoMode(!isIncognitoMode);
              if (!isIncognitoMode) {
                createNewTab('', true);
              }
            }}
          >
            <Lock className="w-3 h-3 mr-1" />
            <span className="text-xs">{isIncognitoMode ? 'خفي' : 'عادي'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className="w-3 h-3 mr-1" />
            <span className="text-xs">المفضلة</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-3 h-3 mr-1" />
            <span className="text-xs">التاريخ</span>
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center bg-background/80 backdrop-blur-md rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
            <Globe className="w-4 h-4 ml-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={activeTab?.url || "أدخل رابط أو ابحث في جوجل..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm px-2 py-2 h-auto"
              dir="auto"
            />
            {activeTab?.url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-1 hover:bg-accent"
                onClick={() => toggleFavorite(activeTab.url)}
              >
                {favorites.includes(activeTab.url) ? (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ) : (
                  <StarOff className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>
        </form>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Favorites Panel */}
      {showFavorites && (
        <div className="p-3 bg-muted/20 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">المواقع المفضلة</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {favorites.map((url, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 justify-start text-xs truncate"
                onClick={() => navigateToUrl(url)}
              >
                <Globe className="w-3 h-3 mr-1" />
                {url.replace(/^https?:\/\//, '').split('/')[0]}
              </Button>
            ))}
            {favorites.length === 0 && (
              <span className="text-xs text-muted-foreground col-span-full">لا توجد مواقع مفضلة</span>
            )}
          </div>
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="p-3 bg-muted/20 border-t border-border/50 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">سجل التصفح</span>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={clearHistory}
              >
                مسح الكل
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {history.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => navigateToUrl(item.url)}
              >
                <Globe className="w-3 h-3 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.url}</div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp.toLocaleDateString('ar')}
                </span>
              </div>
            ))}
            {history.length === 0 && (
              <span className="text-xs text-muted-foreground">لا يوجد سجل تصفح</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from 'react';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;
const DEFAULT_FONT_SIZE = 16;

export function useFontSize() {
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fontSize');
      if (saved && !isNaN(parseInt(saved))) {
        return parseInt(saved);
      }
    }
    return DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply to root font size which affects rem units
    root.style.fontSize = `${fontSize}px`;
    
    // Also set CSS variable for specific components
    root.style.setProperty('--base-font-size', `${fontSize}px`);
    
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const changeFontSize = (newSize: number) => {
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, newSize));
    setFontSize(clampedSize);
  };

  return { 
    fontSize, 
    changeFontSize, 
    minSize: MIN_FONT_SIZE, 
    maxSize: MAX_FONT_SIZE,
    defaultSize: DEFAULT_FONT_SIZE
  };
}
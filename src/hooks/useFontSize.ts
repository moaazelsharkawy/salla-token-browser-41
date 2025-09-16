import { useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

const fontSizeMap = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 20
};

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fontSize') as FontSize) || 'medium';
    }
    return 'medium';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const sizeInPx = fontSizeMap[fontSize];
    
    root.style.setProperty('--base-font-size', `${sizeInPx}px`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const changeFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
  };

  return { fontSize, changeFontSize, fontSizeMap };
}
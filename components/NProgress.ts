// components/NProgressBar.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  minimum: 0.08,
  easing: 'ease',
  speed: 800,
  showSpinner: true,
  trickle: true,
  trickleSpeed: 200,
});

export default function NProgressBar({ theme = 'default' }) {
  const router = useRouter();

  const themes: Record<string, { color: string; height: string }> = {
    default: {
      color: 'linear-gradient(90deg,rgba(42, 123, 155, 1) 30%, rgba(237, 83, 229, 1) 100%)',
      height: '3px'
    },
  };

  useEffect(() => {
    const currentTheme = themes[theme];
    
    const style = document.createElement('style');
    style.textContent = `
      #nprogress .bar {
        background: ${currentTheme.color} !important;
        height: ${currentTheme.height} !important;
      }
    `;
    document.head.appendChild(style);

    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, theme]);

  return null;
}
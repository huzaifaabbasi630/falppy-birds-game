import React from 'react';

export const useRouter = () => {
  return {
    push: (path) => {
        console.log('Push to:', path);
        // We can use a global event or window variable to trigger navigation in App.tsx
        if (window.onNavigate) window.onNavigate(path);
    },
    replace: (path) => {
        console.log('Replace with:', path);
        if (window.onNavigate) window.onNavigate(path);
    },
    back: () => {
        if (window.onNavigate) window.onNavigate('/');
    }
  };
};

export const Stack = ({ children }) => <div style={{flex: 1}}>{children}</div>;
export const Link = ({ children }) => <a>{children}</a>;

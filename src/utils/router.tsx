import React, { createContext, useContext, useState } from 'react';

const RouterContext = createContext({
  push: (path: string) => {},
  replace: (path: string) => {},
  back: () => {},
});

export const RouterProvider = ({ children, initialPath = '/' }: any) => {
  const [path, setPath] = useState(initialPath);

  const router = {
    push: (p: string) => setPath(p),
    replace: (p: string) => setPath(p),
    back: () => setPath('/'), // Simplified
    path
  };

  return (
    <RouterContext.Provider value={router}>
      {children}
    </RouterContext.Provider>
  );
};

export const useGameRouter = () => useContext(RouterContext);

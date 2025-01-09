import { createContext, useState, useContext } from "react";

const LoadingContext = createContext({
  loading: false,
  progress: 0,
  startLoading: () => {},
  stopLoading: () => {},
});

import { ReactNode } from "react";

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 300);

    return () => clearInterval(interval);
  };

  const stopLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 500);
  };

  return (
    <LoadingContext.Provider value={{ loading, progress, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

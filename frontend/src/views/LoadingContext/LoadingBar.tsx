import { useLoading } from "./LoadingProvider";
import "./LoadingBar.scss"; // Add your styles

const LoadingBar = () => {
  const { loading, progress } = useLoading() as { loading: boolean; progress: number };

  return (
    loading && (
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${progress}%` }}></div>
      </div>
    )
  );
};

export default LoadingBar;

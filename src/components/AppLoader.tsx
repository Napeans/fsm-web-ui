import "./AppLoader.css";

type AppLoaderProps = {
  open: boolean;
  message?: string;
};

const AppLoader = ({ open, message = "Please wait..." }: AppLoaderProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="app-loader-overlay" role="status" aria-live="polite">
      <div className="app-loader-card">
        <div className="app-loader-spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AppLoader;

import "./AppDialog.css";

type AppDialogProps = {
  open: boolean;
  title: string;
  message: string;
  mode?: "alert" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

const AppDialog = ({
  open,
  title,
  message,
  mode = "alert",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onClose,
}: AppDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="app-dialog-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="app-dialog-card">
        <div className="app-dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="app-dialog-body">
          <p>{message}</p>
        </div>
        <div className="app-dialog-actions">
          {mode === "confirm" && (
            <button className="app-dialog-btn app-dialog-btn-cancel" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className="app-dialog-btn app-dialog-btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDialog;

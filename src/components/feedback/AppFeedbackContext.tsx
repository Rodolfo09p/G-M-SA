import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AppFeedbackContextValue, AppFeedbackProviderProps, ConfirmOptions, ConfirmState } from "./type";

const AppFeedbackContext = createContext<AppFeedbackContextValue | undefined>(
  undefined,
);

const defaultConfirmState: ConfirmState = {
  open: false,
  title: "Confirmar accion",
  message: "",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
};



export function AppFeedbackProvider({ children }: AppFeedbackProviderProps) {
  const [loaderCount, setLoaderCount] = useState(0);
  const [loaderMessage, setLoaderMessage] = useState("Procesando...");
  const [confirmState, setConfirmState] =
    useState<ConfirmState>(defaultConfirmState);
  const confirmResolverRef = useRef<((value: boolean) => void) | null>(null);

  const showLoader = (message?: string) => {
    if (message) {
      setLoaderMessage(message);
    }

    setLoaderCount((prev) => prev + 1);
  };

  const hideLoader = () => {
    setLoaderCount((prev) => Math.max(0, prev - 1));
  };

  const withLoader = async <T,>(action: () => Promise<T>, message?: string) => {
    showLoader(message);

    try {
      return await action();
    } finally {
      hideLoader();
    }
  };

  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      confirmResolverRef.current = resolve;

      setConfirmState({
        open: true,
        title: options.title ?? defaultConfirmState.title,
        message: options.message,
        confirmText: options.confirmText ?? defaultConfirmState.confirmText,
        cancelText: options.cancelText ?? defaultConfirmState.cancelText,
      });
    });
  };

  const resolveConfirm = (accepted: boolean) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(accepted);
      confirmResolverRef.current = null;
    }

    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  const contextValue = useMemo<AppFeedbackContextValue>(
    () => ({
      showLoader,
      hideLoader,
      withLoader,
      confirm,
    }),
    [showLoader, hideLoader, withLoader, confirm],
  );

  return (
    <AppFeedbackContext.Provider value={contextValue}>
      {children}

      <Backdrop
        open={loaderCount > 0}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 2,
          color: "common.white",
          flexDirection: "column",
          gap: 1.5,
          textAlign: "center",
          px: 2,
        }}
      >
        <span className="loader"></span>
        <Typography variant="body1" fontWeight={900} className="mt-8">
          {loaderMessage}
        </Typography>
      </Backdrop>

      <Dialog
        open={confirmState.open}
        onClose={() => resolveConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{confirmState.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {confirmState.message}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => resolveConfirm(false)} color="inherit">
            {confirmState.cancelText}
          </Button>
          <Button
            onClick={() => resolveConfirm(true)}
            variant="contained"
            color="secondary"
          >
            {confirmState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </AppFeedbackContext.Provider>
  );
}

export function useAppFeedbackContext() {
  const context = useContext(AppFeedbackContext);

  if (!context) {
    throw new Error(
      "useAppFeedbackContext must be used within AppFeedbackProvider",
    );
  }

  return context;
}

import { useSnackbar } from "notistack";
import { useAppFeedbackContext } from "./AppFeedbackContext";
import { RunWithFeedbackOptions } from "./type";

export function useAppFeedback() {
  const { enqueueSnackbar } = useSnackbar();
  const { confirm, showLoader, hideLoader, withLoader } = useAppFeedbackContext();

  const success = (message: string) => {
    enqueueSnackbar(message, { variant: "success" });
  };

  const info = (message: string) => {
    enqueueSnackbar(message, { variant: "info" });
  };

  const warning = (message: string) => {
    enqueueSnackbar(message, { variant: "warning" });
  };

  const error = (message: string) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  const runWithFeedback = async <T,>(
    action: () => Promise<T>,
    options: RunWithFeedbackOptions = {}
  ) => {
    const {
      loadingMessage = "Procesando...",
      successMessage,
      errorMessage = "No se pudo completar la operacion.",
      notifySuccess = true,
      notifyError = true,
    } = options;

    try {
      const result = await withLoader(action, loadingMessage);

      if (notifySuccess && successMessage) {
        success(successMessage);
      }

      return result;
    } catch (caughtError) {
      if (notifyError) {
        error(errorMessage);
      }

      throw caughtError;
    }
  };

  return {
    confirm,
    showLoader,
    hideLoader,
    runWithFeedback,
    success,
    info,
    warning,
    error,
  };
}

import { ReactNode } from "react";

export type ConfirmOptions = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
};

export type ConfirmState = ConfirmOptions & {
    open: boolean;
};

export type AppFeedbackContextValue = {
    showLoader: (message?: string) => void;
    hideLoader: () => void;
    withLoader: <T>(action: () => Promise<T>, message?: string) => Promise<T>;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
};

export type AppFeedbackProviderProps = Readonly<{
    children: ReactNode;
}>;

export type RunWithFeedbackOptions = {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    notifySuccess?: boolean;
    notifyError?: boolean;
};
import { useRef } from "react";
import Swal, { SweetAlertIcon } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type BaseOptions = {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
};

type AlertOptions = Omit<BaseOptions, "icon"> & {
  icon?: Exclude<SweetAlertIcon, "question">;
  confirmButtonText?: string;
  timerMs?: number;
  sticky?: boolean;
};

type ConfirmOptions = BaseOptions & {
  confirmButtonText?: string;
  cancelButtonText?: string;
};

const ALERT_DEFAULT_TITLES: Record<Exclude<SweetAlertIcon, "question">, string> = {
  success: "Operación exitosa",
  info: "Información",
  warning: "Atención",
  error: "Ocurrió un error",
};

const DEFAULT_LOADING_TITLE = "Procesando...";
const DEFAULT_CONFIRM_TITLE = "Confirmar acción";

const buildCommonClass = () => ({
  popup: "gm-swal-popup",
  title: "gm-swal-title",
  htmlContainer: "gm-swal-text",
  confirmButton: "gm-swal-confirm",
  cancelButton: "gm-swal-cancel",
});

export function useAppFeedback() {
  const loaderCountRef = useRef(0);

  const showLoading = (options?: string | BaseOptions) => {
    const normalized =
      typeof options === "string" ? { title: options } : (options ?? {});

    loaderCountRef.current += 1;

    if (loaderCountRef.current === 1) {
      void Swal.fire({
        title: normalized.title ?? DEFAULT_LOADING_TITLE,
        text: normalized.text,
        icon: normalized.icon,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: buildCommonClass(),
        buttonsStyling: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }

    let closed = false;

    return () => {
      if (closed) {
        return;
      }

      closed = true;
      loaderCountRef.current = Math.max(0, loaderCountRef.current - 1);

      if (loaderCountRef.current === 0) {
        Swal.close();
      }
    };
  };

  const showAlert = async (options: AlertOptions) => {
    const icon = options.icon ?? "success";
    const stickyByDefault =
      icon === "info" || icon === "warning" || icon === "error";
    const sticky = options.sticky ?? stickyByDefault;

    await Swal.fire({
      title: options.title ?? ALERT_DEFAULT_TITLES[icon],
      text: options.text,
      icon,
      confirmButtonText: options.confirmButtonText ?? "OK",
      showConfirmButton: sticky,
      timer: sticky ? undefined : (options.timerMs ?? 1800),
      timerProgressBar: !sticky,
      allowOutsideClick: !sticky,
      allowEscapeKey: !sticky,
      customClass: buildCommonClass(),
      buttonsStyling: false,
    });
  };

  const showConfirm = async (options: ConfirmOptions) => {
    const result = await Swal.fire({
      title: options.title ?? DEFAULT_CONFIRM_TITLE,
      text: options.text,
      icon: options.icon ?? "question",
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? "Confirmar",
      cancelButtonText: options.cancelButtonText ?? "Cancelar",
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: buildCommonClass(),
      buttonsStyling: false,
    });

    return result.isConfirmed;
  };

  return {
    showLoading,
    showAlert,
    showConfirm,
  };
}

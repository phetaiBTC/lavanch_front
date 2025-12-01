// ~/composables/useFormHandler.ts
export const useFormHandler = () => {
  const { t } = useI18n();
  const toast = useToast();

  const handleError = (err: any) => {
    const msg = err?.response?._data?.message || "Something went wrong";

    toast.add({
      severity: "error",
      summary: t("error"),
      detail: t(msg),
      life: 3000,
    });

    throw err;
  };

  const showSuccess = (message: string = "Operation successful") => {
    toast.add({
      severity: "success",
      summary: t("success"),
      detail: t(message),
      life: 3000,
    });
  };

  const run = async <T>(
    func: () => Promise<T>,
    loading: (v: boolean) => void
  ) => {
    try {
      loading(true);
      return await func();
    } catch (err) {
      handleError(err);
    } finally {
      loading(false);
    }
  };

  return { run, showSuccess };
};

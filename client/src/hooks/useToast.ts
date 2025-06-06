import { useSnackbar } from 'notistack';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showToast = (type: ToastType, message: string) => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  return { showToast };
}; 
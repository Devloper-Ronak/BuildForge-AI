import toast from "react-hot-toast";

export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
    });
};

export const showError = (message) => {
    toast.error(message, {
        duration: 3000,
    });
};

export const showLoading = (message) => {
    return toast.loading(message);
};

export const hideToast = (id) => {
    toast.dismiss(id);
};
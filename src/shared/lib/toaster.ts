import toast from "react-hot-toast";

export const showToaster = (text: string) => {
    toast.error(text, {
        duration: 3000,
        style: {
            background: 'rgba(67,164,234,0.86)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '15px',
        },
        icon: '⚠️',
    });
};

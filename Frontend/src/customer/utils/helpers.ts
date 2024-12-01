export const beautifyDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
};

export const beautifyTime = (timeString: string): string => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
}

export const beautifyStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export const beautifyPrice = (price: number): string => {
    if (!price) return "Không khả dụng"
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
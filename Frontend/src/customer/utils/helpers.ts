export const beautifyDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
};

export const beautifyTime = (timeString: string): string => {
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
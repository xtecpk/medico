const revenueConverter = (value) => {
    const revenue = value.toString();
    const length = revenue.length;

    if (length > 3 && length <= 6) {
        return `${revenue.slice(0, length - 3)}K`
    } else if (length > 6 && length <= 9) {
        return `${revenue.slice(0, length - 6)}M`
    }
    else {
        return revenue;
    }
}

export { revenueConverter }
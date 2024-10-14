
const DateFormatForServer = (dateString) => {
    const inputDate = new Date(dateString);

    // Target format: "2024-01-01 12:00:00"
    const targetDate = new Date(inputDate);

    // Convert input date to target format
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1; // Months are 0-indexed
    const day = targetDate.getDate();
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    const seconds = targetDate.getSeconds();

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return formattedDate; // Returns "2024-01-01 12:00:00" or "2024-01-01T12:00:00" depending on the target format. Example: "2024-01-01 12:00:00" or "2024-01-01T12:
}

const DateFormatForUser = (inputDateString) => {
    const inputDate = new Date(inputDateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return inputDate.toLocaleDateString('en-GB', options);
}

const daysRemaining = (expDate) => {
    const start = new Date();
    const end = new Date(expDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();

    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate();

    let yearsDiff = endYear - startYear;
    let monthsDiff = endMonth - startMonth;
    let daysDiff = endDay - startDay;

    // Adjust for negative differences
    if (daysDiff < 0) {
        const tempEnd = new Date(endYear, endMonth, 0);
        daysDiff = tempEnd.getDate() - startDay + endDay;
        monthsDiff--;
    }

    if (monthsDiff < 0) {
        monthsDiff += 12;
        yearsDiff--;
    }

    // return { years: yearsDiff, months: monthsDiff, days: daysDiff };
    return `${yearsDiff !== 0 ? yearsDiff + "y" : ""} ${monthsDiff}m ${daysDiff}d`;
}

const getTime = (dateString) => {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    let formattedHours = hours % 12;
    formattedHours = formattedHours === 0 ? 12 : formattedHours;

    const period = hours < 12 ? 'am' : 'pm';

    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

    return formattedTime;
}

export default DateFormatForServer
export { DateFormatForUser, daysRemaining, getTime }

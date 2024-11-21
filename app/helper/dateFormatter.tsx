import { format } from 'date-fns';

const parseDate = (dateString: string) => {
    if (!dateString) {
        return 'Invalid Date'; // Return a fallback string if date is undefined or empty
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; // Return a fallback string if date is invalid
    }
    return format(date, 'dd MMMM yyyy'); // 'MMMM' gives full month name
};

const formattedDate = parseDate('2024-11-17T13:51:29.98Z');
console.log(formattedDate); // Output: "17 November 2024"

export {parseDate}

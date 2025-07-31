export const convertTo24HourFormat = (time12hr) => {
    const date = new Date(`2001/01/01 ${time12hr}`);

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    return date.toLocaleTimeString("en-US", options);
};

export const date = {
    today: new Date(),
    getCurrentDate: function () {
        return this.today.toISOString().split("T")[0];
    },
    getCurrentTime: function () {
        return this.today.toTimeString().split(" ")[0];
    },
    getCurrentMonth: function () {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        return months[this.today.getMonth()];
    },
    getCurrentDay: function () {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return days[this.today.getDay()];
    },
    getCurrentDateAndTime: function () {
        return this.getCurrentDate() + " " + this.getCurrentTime();
    },
};

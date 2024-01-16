class RcCrew {
    constructor(aData) {
        let self = this;
        self.ymd = aData[0];
        self.date = this.dateToMonthDay(aData[0]);
        self.captain = {};
        self.captain.name = ko.observable(aData[1]);
        self.captain.email = ko.observable(aData[2]);
        self.assistant = {};
        self.assistant.name = ko.observable(aData[3]);
        self.assistant.email = ko.observable(aData[4]);
        self.sb1_1 = {};
        self.sb1_1.name = ko.observable(aData[5]);
        self.sb1_1.email = ko.observable(aData[6]);
        self.sb1_2 = {};
        self.sb1_2.name = ko.observable(aData[7]);
        self.sb1_2.email = ko.observable(aData[8]);
        self.sb2_1 = {};
        self.sb2_1.name = ko.observable(aData[9]);
        self.sb2_1.email = ko.observable(aData[10]);
        self.sb2_2 = {};
        self.sb2_2.name = ko.observable(aData[11]);
        self.sb2_2.email = ko.observable(aData[12]);

        return self;
    }

    // Convert 2024-05-08 => Wed May 8
    dateToMonthDay(inputDate) {
        const [year, month, day] = inputDate.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthAbbreviation = months[parseInt(month, 10) - 1];
        const formattedDate = `${this.getWeekday(inputDate)} ${monthAbbreviation} ${parseInt(day, 10)}`;

        return formattedDate;
    }

    getWeekday(inputDate) {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(`${inputDate}T00:00:00Z`);
        const weekdayIndex = date.getUTCDay();
        return weekdays[weekdayIndex];
    }

    //Convert Wed May 8 => 2024-05-08
    dateToYMD(formattedDate) {
        const monthsMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        const [weekday, monthAbbreviation, day] = formattedDate.split(' ');
        const month = monthsMap[monthAbbreviation];
        const year = new Date().getFullYear(); // Assuming current year, you may adjust this based on your requirement

        const parsedDate = `${year}-${month}-${day}`;
        return parsedDate;
    }
}
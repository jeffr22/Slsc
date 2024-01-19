//These are the Sunday and Wednesday race definitions - need to come from a config file
//The format of each race series if ['name', 'start month', 'start day'], so ['Robinson',7,14]
//defines the Robinson series start on July 14th.
const sunSeries = [['Practice', 5, 5], ['Zephyr', 5, 26], ['Robinson', 7, 14], ['Kaydeross', 9, 1]];
const wedSeries = [['Practice', 5, 5], ['Manning', 5, 29], ['Rice', 9, 4]];
var raceCount = { 'Practice': 0, 'Zephyr': 0, 'Robinson': 0, 'Kaydeross': 0, 'Manning':0, 'Rice':0 };

class RcCrew {
    constructor(aData) {
        let self = this;
        let dateRace = self.fmtDayAndSeries(aData[0]);
        self.ymd = aData[0];
        self.date = dateRace[0];
        self.race = dateRace[1];
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

    //Add the series as a second line to the mm-dd date.
    fmtDayAndSeries(inputDate){
        let md = this.dateToMonthDay(inputDate);
        let ssLen = sunSeries.length;
        let wsLen = wedSeries.length;
        let hSeries = [];
        if(md['weekday'] == 'Sun'){
            let idx = 0;
            let flag = 1;
            while(flag > 0){
                hSeries = sunSeries[idx];
                if(md['monthnum'] > hSeries[1]){
                    flag = 1;
                    idx += 1;
                }
                else if ((md['monthnum'] == hSeries[1]) && (md['daynum'] >= hSeries[2])){
                    flag = 1;
                    idx += 1;
                }
                else{
                    flag=0;
                }
                if(idx >= ssLen){
                    // idx = ssLen - 1;
                    flag = 0;
                }
            }
            hSeries = sunSeries[idx - 1];

        } else {
            let idx = 0;
            let flag = 1;
            while (flag > 0) {
                hSeries = wedSeries[idx];
                if (md['monthnum'] > hSeries[1]) {
                    flag = 1;
                    idx += 1;
                }
                else if ((md['monthnum'] == hSeries[1]) && (md['daynum'] >= hSeries[2])) {
                    flag = 1;
                    idx += 1;
                }
                else {
                    flag = 0;
                }
                if (idx >= wsLen) {
                    // idx = wsLen - 1;
                    flag = 0;
                }
            }
            hSeries =  wedSeries[idx - 1];
        }
        let raceName = hSeries[0]
        raceCount[raceName] += 1;
        const formattedDate = `${md['weekday']} ${md['monthname']} ${md['daynum']}`;
        const raceNameAndNum = `${raceName} #${raceCount[raceName]}`;
        return [formattedDate, raceNameAndNum];
    }

    // Convert 2024-05-08 => Wed May 8
    dateToMonthDay(inputDate) {
        const [year, month, day] = inputDate.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthAbbreviation = months[parseInt(month, 10) - 1];
        const weekday = this.getWeekday(inputDate);
        const daynum = parseInt(day, 10);
        const monthnum = parseInt(month);
        return {'weekday':weekday,'monthname': monthAbbreviation,'monthnum':monthnum,'daynum':daynum};
        /*
        const formattedDate = `${this.getWeekday(inputDate)} ${monthAbbreviation} ${parseInt(day, 10)}`;
        return formattedDate;
        */
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
/************************************************************************************
                    T h e   S t a f f i n g G r i d   O b j e c t
*************************************************************************************/

function RcCrewGrid(staffJson) {
    let self = this;
    self.username = ko.observable("");
    self.useremail = ko.observable("");
    self.title = ko.observable("");
    self.position = "";
    self.bookDate = "";
    self.aRcCrews = ko.observableArray([]);
    //Loop through the staff data to create an array of staff objects
    let staffArray = JSON.parse(staffJson);
    for(let k=0; k < staffArray.length; k++){
        let tmpObj = new RcCrew(staffArray[k]);
        self.aRcCrews.push(tmpObj);
    }

    self.editCapt = function(row,evt){
        console.log("Captain on %s",row.date);
        self.position="Captain";
        self.sqlcol='rc_';
        self.date=row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }
    self.editAsst = function (row, evt) {
        console.log("Asst on %s", row.date);
        self.position = "Assistant";
        self.sqlcol = 'ac_';
        self.date = row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }
    self.editS11 = function (row, evt) {
        console.log("S11 on %s", row.date);
        self.position = "Safety Boat 1A";
        self.sqlcol = 's1_1_';
        self.date = row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }
    self.editS12 = function (row, evt) {
        console.log("S12 on %s", row.date);
        self.position = "SBoat 1B";
        self.sqlcol = 's1_2_';
        self.date = row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }
    self.editS21 = function (row, evt) {
        console.log("S21 on %s", row.date);
        self.position = "SBoat 2A";
        self.sqlcol = 's2_1_';
        self.date = row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }
    self.editS22 = function (row, evt) {
        console.log("S22 on %s", row.date);
        self.position = "SBoat 2B";
        self.sqlcol = 's2_2_';
        self.date = row.date;
        self.title("Booking for: " + self.position + " on: " + self.date);
        $('#myModal').show();
    }

    self.formSave = function(a,b){
        $('#myModal').hide();
        let q = {};
        q['ymd'] = self.dateToYMD(a.date);
        q['namecol'] = self.sqlcol+'name';
        q['nameval'] = a.username();
        q['emailcol'] = self.sqlcol+'email';
        q['emailval'] = a.useremail();

        // let sql = 'UPDATE Slsc.staffing SET ' + namecol + '="' + a.username() + '",' + emailcol + '="' + a.useremail() + '" WHERE rcdate="' + ymd + '";';
        // console.log(sql);
        let jdata = JSON.stringify(q);
        $.ajax({
            url: '/update_rc_sheet?query=' + encodeURI(jdata),
            success: function(resp){
                if (resp == "OK")
                    location.reload();
                if (resp == "BAD EMAIL")
                    console.log("BAD EMAIL")
            },
            error: function (err) {
                console.error("Rx err %O",err);
            }
        })
    }

    self.formCancel = function (a, b) {
        $('#myModal').hide();
    }

    //Convert Wed May 8 => 2024-05-08
    self.dateToYMD = function(formattedDate) {
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



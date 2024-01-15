/************************************************************************************
                    T h e   S t a f f i n g G r i d   O b j e c t
*************************************************************************************/

function RcCrewGrid(staffJson) {
    let self = this;
    self.aRcCrews = ko.observableArray([]);
    //Loop through the staff data to create an array of staff objects
    let staffArray = JSON.parse(staffJson);
    for(let k=0; k < staffArray.length; k++){
        let tmpObj = new RcCrew(staffArray[k]);
        self.aRcCrews.push(tmpObj);
    }

    self.editCapt = function(row,evt){
        console.log("Captain on %s",row.date);
    }
    self.editAsst = function (row, evt) {
        console.log("Asst on %s", row.date);
    }
    self.editS11 = function (row, evt) {
        console.log("S11 on %s", row.date);
    }
    self.editS12 = function (row, evt) {
        console.log("S12 on %s", row.date);
    }
    self.editS21 = function (row, evt) {
        console.log("S21 on %s", row.date);
    }
    self.editS22 = function (row, evt) {
        console.log("S22 on %s", row.date);
    }
}



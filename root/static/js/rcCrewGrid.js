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
}



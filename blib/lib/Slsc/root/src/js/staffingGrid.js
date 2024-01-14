/************************************************************************************
                    T h e   S t a f f i n g G r i d   O b j e c t
*************************************************************************************/

function RcCrewGrid(staffJson) {
    let self = this;
    self.aRcCrews = ko.obseravleArray([]);
    //Loop through the staff data to create an array of staff objects
    let staffArray = JSON.parse(staffJson);
    for(let k=0; k<length(staffArray); k++){
        self.aRcCrews.push(RcCrew(staffArray[k]))
    }
}



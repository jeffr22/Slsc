class RcCrew {
    constructor(aData) {
        let self = this;
        self.date = aData[0];
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
}
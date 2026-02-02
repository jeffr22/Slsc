/************************************************************************************
                    T h e   S t a f f i n g G r i d   O b j e c t
*************************************************************************************/

function RcCrewGrid(staffJson) {
    let self = this;
    self.username = ko.observable("");
    self.useremail = ko.observable("");
    self.title = ko.observable("");
    self.pbsafety = ko.observable("");
    self.nycert = ko.observable("");

    self.position = "";
    self.bookDate = "";
    self.aRcCrews = ko.observableArray([]);
    //Loop through the staff data to create an array of staff objects
    let staffArray = JSON.parse(staffJson);
    for (let k = 0; k < staffArray.length; k++) {
        let tmpObj = new RcCrew(staffArray[k]);
        self.aRcCrews.push(tmpObj);
    }

    self.editCapt = function (row, evt) {
        console.log("Captain on %s", row.date);
        self.position = "Captain";
        self.sqlcol = 'rc_';
        self.date = row.date;
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


    /******************************************************************************
                Form  Powerboat Safety and NY Boating Cert Handler 
    *******************************************************************************/
    self.certSave = function (a, b) {
        $('#myModal').hide();
        let q = {};
        q['pbsafety'] = self.pbsafety();
        q['nycert'] = self.nycert();
        q['email'] = self.useremail();
        let jdata = JSON.stringify(q);
        $.ajax({
            url: '/update_rc_cert?query=' + encodeURI(jdata),
            success: function (resp) {
                if (resp == "OK")
                    location.reload();
                // if (resp == "BAD EMAIL") {
                //     console.log("BAD EMAIL");
                //     $('#badEmailModal').show();
                // }
            },
            error: function (err) {
                console.error("Rx err %O", err);
            }
        })
    }

    /******************************************************************************
            First and Last Name Validation and Formatting Functions
    *******************************************************************************/
    /******************************************************************************
            First and Last Name Validation and Formatting Functions
    ******************************************************************************/

    function stripNonAlnum(s) {
        // Remove anything that is NOT A-Z, a-z, 0-9
        // (If you want to keep digits, validation below can be loosened.)
        return String(s).replace(/[^A-Za-z0-9]/g, "");
    }

    function capitalize(word) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    function normalizeLastName(raw) {
        // hard sanitize first
        const cleaned = stripNonAlnum(raw);
        if (!cleaned) return "";

        const lower = cleaned.toLowerCase();

        // O'Leary / O-Leary / OLeary  => OLeary
        // After stripping non-alnum, O'Leary becomes Oleary
        if (lower.startsWith("o") && lower.length > 1) {
            // Only apply O + Capitalize(rest) if it looks like the O-prefix pattern:
            // i.e. original is O + letters (we already stripped junk)
            // This will also transform "Oconnor" -> "OConnor" which is often desired.
            return "O" + capitalize(lower.slice(1));
        }

        // MacDonald
        if (lower.startsWith("mac") && lower.length > 3) {
            return "Mac" + capitalize(lower.slice(3));
        }

        // McDonald
        if (lower.startsWith("mc") && lower.length > 2) {
            return "Mc" + capitalize(lower.slice(2));
        }

        // Standard last name
        return capitalize(lower);
    }

    function normalizeFirstName(raw) {
        const cleaned = stripNonAlnum(raw);
        if (!cleaned) return "";
        return capitalize(cleaned.toLowerCase());
    }

    function normalizeUsername(input) {
        if (typeof input !== "string") return null;

        // Normalize whitespace first
        const normalizedSpaces = input.trim().replace(/\s+/g, " ");
        const parts = normalizedSpaces.split(" ");

        // Must be exactly two parts
        if (parts.length !== 2) return null;

        const first = normalizeFirstName(parts[0]);
        const last = normalizeLastName(parts[1]);

        if (!first || !last) return null;

        const formatted = `${first} ${last}`;

        // Validate AFTER formatting
        if (!isValidNormalizedName(formatted)) return null;

        return formatted;
    }

    // Validation for normalized output (letters only; no digits)
    // If you truly want digits allowed, see variant below.
    function isValidNormalizedName(name) {
        // First: Capitalized normal name
        // Last: either Standard (Capitalized) OR McXxx OR MacXxx OR OXxx
        return /^[A-Z][a-z]+ (?:[A-Z][a-z]+|Mc[A-Z][a-z]+|Mac[A-Z][a-z]+|O[A-Z][a-z]+)$/.test(name);
    }

    /******************************************************************************
                Cancel Form Handler
    *******************************************************************************/
    self.formCancel = function (a, b) {
        $('#myModal').hide();
        $('#certModal').hide();
        $('#badEmailModal').hide();
    }

    /******************************************************************************
               Name and Email Form Handler 
    *******************************************************************************/
    self.formSave = function (a, b) {
        $('#myModal').hide();
        let q = {};
        q['ymd'] = self.dateToYMD(a.date);
        q['namecol'] = self.sqlcol + 'name';

        const raw = a.username();
        const formatted = normalizeUsername(raw);

        if (!formatted || !isValidNormalizedName(formatted)) {
            throw new Error("Invalid username format");
        }

        q['nameval'] = formatted;

        // q['nameval'] = a.username();
        q['emailcol'] = self.sqlcol + 'email';
        q['emailval'] = a.useremail();
        let jdata = JSON.stringify(q);
        $.ajax({
            url: '/update_rc_sheet?query=' + encodeURI(jdata),
            success: function (resp) {
                switch (resp) {
                    case "OK":
                        location.reload();
                        break;
                    case "MISSING_CERTS":
                        console.log("MISSING CERTS");
                        self.title("Missing Certifications for: " + self.username());
                        $('#certModal').show();
                        break;
                    case "BAD_EMAIL":
                        console.log("BAD EMAIL");
                        $('#badEmailModal').show();
                        break;
                    default:
                        console.log("Unknown response: %s", resp);
                }
            },
            error: function (err) {
                console.error("Rx err %O", err);
            }
        })
    }

    //Convert Wed May 8 => 2024-05-08
    self.dateToYMD = function (formattedDate) {
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



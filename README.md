# SLSC Sign Up Sheet
## Overview
This project automates the race sign up process by doing the following:
1. Presenting a sign up sheet with a write once capability on every cell.
2. Using a cron job, it tallies up who has/has not signed up and then reminds people as needed.
3. Provides URLS for the reseting reservervations creating a new calendar and other admin jobs.

## Architecture
The project has been built around the combination of Catalyst, KnockoutJS and MySQL, with Bootstrap being used for CSS. The two SQL tables that support the project are:
1. Slsc.staffing - stoeres the reservations or '-' if the cell is available.
```{results='asis'}
CREATE TABLE Slsc.staffing (
	rcdate date NOT NULL,
	rc_name varchar(40) NOT NULL,
    rc_email varchar(40) NOT NULL,
    ac_name varchar(40) NOT NULL,
    ac_email varchar(40) NOT NULL,
	s1_1_name varchar(40) NOT NULL,
    s1_1_email varchar(40) NOT NULL,
    s1_2_name varchar(40) NOT NULL,
    s1_2_email varchar(40) NOT NULL,
	s2_1_name varchar(40) NOT NULL,
    s2_1_email varchar(40) NOT NULL,
    s2_2_name varchar(40) NOT NULL,
    s2_2_email varchar(40) NOT NULL,
	PRIMARY KEY (rcdate)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
```

2. Slsc.membership - stores the first,last,email1,email2,count of all club members.
```{results='asis'}
CREATE TABLE Slsc.members (
    first VARCHAR(40) DEFAULT 'NOFIRST',
    last VARCHAR(40) DEFAULT 'NOLAST',
    email1 VARCHAR(40) NOT NULL,
    email2 VARCHAR(40) DEFAULT '',
    count INT DEFAULT 0,
    PRIMARY KEY (email1)
)  ENGINE=MYISAM DEFAULT CHARSET=LATIN1;
```

when a user enters their name/email the 'membership' table is used to validate that this really is a club member using the site.

## The 'modules' directory

    1. DBUtils.pm <some text here>
    2. rcParser.pl - a file created to read the club email list and iniitalize the members database. It also has a function that read an old signup sheet to add names to email addresses. This file likely has no further use but its here just in case ...
    3. dbEditor: provides the following functions (currently):
       1. "resetBooking" - write '-' to the name and email of the target cell.
       2. "updatecell" - write new values for name and email to the target cell.
       3. "tally" - update the members database with a count of the number of times members have signed up.




## TO DO
1. Add facilities for add/del/change entries in the members DB.
2. Add Perl code to read the members DB and send a reminder email to all those who need to sign up.
3. Perl code to send a reminder to all those on duty in the coming week. There should be seperate reminder for Sunday and Wednesday both sent 2 days ahead of the race.
4. Need a means to easily define a new season.
   1. There is the DBUtils::initSeason function but that will perform a basic init of the staffing DB however there is nothing to set up the Race Series and I'm sure there is other stuff.
5.
# SLSC Sign Up Sheet
## Overview
This project automates the race sign up process by doing the following:
1. Presenting a sign up sheet with a write once capability on every cell.
2. Using a cron job, it tallies up who has/has not signed up and then reminds people as needed.
3. Provides URLS for the reseting reservervations creating a new calendar and other admin jobs.

## Architecture
The project has been built around the combination of Catalyst, KnockoutJS and MySQL, with Bootstrap being used for CSS. The two SQL tables that support the project are:
1. Slsc.staffing - stoeres the reservations or '-' if the cell is available.
2. Slsc.membership - stores the first,last,email1,email2,count of all club members.

when a user enters their name/email the 'membership' table is used to validate that this really is a club member using the site.  
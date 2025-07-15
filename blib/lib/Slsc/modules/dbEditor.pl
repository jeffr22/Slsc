use strict;
use lib qw(/home/btcat/Slsc/modules);
use feature "switch";
use DBI;
use DbUtils;
use Getopt::Long;

=pod
OVERVIEW
--------
This file contains a collection of utilities to perform the following tasks.
1. Initialize the database for a new season.
2. Reset a booking
3. Tally the member sign up totals.

Invocations
-----------
To reset a booking:
perl dbEditor.pl --func="reset" --date="2024-07-14" --cell="captain"
where
    --cell options are = captain|assistant|sb1A|sb1B|sb2A|sb2B

=cut

#################################################################################
#                                 M A I N
#################################################################################
my $Function = 'reset';
my $RcDate = '';
my $Cell = '';
my $Value = '';
my $Start = '';
my $End = '';

main();
exit(0);

#################################################################################
#                           S U B R O U T I N E S
#################################################################################

sub main(){
    parseCmdLine();
    $Function = lc($Function);
    $Cell = lc($Cell);
    no warnings;
    for($Function){
        when('season') {
            newSeason($Start,$End);
        }
        when('reset') {
            resetBooking($RcDate,$Cell);
        }
        when('updatecell') {
            updatecell($RcDate,$Cell,$Value);
        }
        when('tally') {
            tallyMembers();
        }
        default {
            die("Unknow or missing function spcification.")
        }
    }
}

=pod
newSeason
    Args: start (ie '2025-05-11'), end ('2025-10-12')
    The routine deletes all rows in the current staffing table and then generates the
    dates for Sundays and Wednesdays together with a series of dashes '-' for the content
    of the columns.
=cut

sub newSeason($$){
    my ($start, $end) = @_; 
    my $rv = DbUtils::dbConnect(DbUtils::dbCreds());
    if ($rv->{exitCode}) {
        die("Cannot connect to the database\n");
    }   
    my $dbh = $rv->{dbh};

    # Validate the start date format
    if ($start =~ /\d{4}-\d{2}-\d{2}/) {
        $start = $&; # Removes any leading/trailing whitespace
    } else {
        die("Invalid start date format, MUST be of the form YYYY-MM-DD, ie 2024-07-14\n");
    }   

    # Validate the end date format
    if ($end =~ /\d{4}-\d{2}-\d{2}/) {
        $end = $&; # Removes any leading/trailing whitespace
    } else {
        die("Invalid end date format, MUST be of the form YYYY-MM-DD, ie 2024-07-14\n");
    }   

    # Remove all the current rows
    my $delete_sql = "DELETE FROM Slsc.staffing";
    printf("SQL: $delete_sql\n");
    $dbh->do($delete_sql);

    # SQL template for inserting new rows
    my $insert_sql_template = "INSERT INTO Slsc.staffing (
        rcdate, rc_name, rc_email, ac_name, ac_email,
        s1_1_name, s1_1_email, s1_2_name, s1_2_email,
        s2_1_name, s2_1_email, s2_2_name, s2_2_email
    ) VALUES ('%s', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-')";

    use Date::Calc qw(Add_Delta_Days Date_to_Days Day_of_Week);

    my ($year, $month, $day) = split(/-/, $start);
    my ($end_year, $end_month, $end_day) = split(/-/, $end);

    # Ensure the loop processes dates in ascending order
    while (Date_to_Days($year, $month, $day) <= Date_to_Days($end_year, $end_month, $end_day)) {
        my $day_of_week = Day_of_Week($year, $month, $day); # 1 = Monday, 7 = Sunday
        if ($day_of_week == 7 || $day_of_week == 3) { # Sunday or Wednesday
            my $formatted_date = sprintf("%04d-%02d-%02d", $year, $month, $day);
            my $insert_sql = sprintf($insert_sql_template, $formatted_date);
            $dbh->do($insert_sql);
        }
        # Move to the next day
        ($year, $month, $day) = Add_Delta_Days($year, $month, $day, 1);
    }

    $dbh->disconnect();
    print "New season created successfully.\n";
}



=pod
    Args: date (ie 2024-06-22) and cell (ie captain,assistant,sb1a etc )
    Replaces the current data at the defined data and defined cell with a dash
=cut

sub resetBooking($$){
    my ($rcdate,$cell)=@_;
    my $rv = DbUtils::dbConnect(DbUtils::dbCreds());
    if($rv->{exitCode}){
        die("Cannot connect to the database\n");
    }
    my $dbh = $rv->{dbh};

    if($rcdate=~/\d{4}\-\d{2}\-\d{2}/){
        $rcdate = $&; # Reoves any leading/trailing whitespace
    } else {
        die("Invalid date format, MUST be of the form YYYY-MM-DD, ie 2024-07-14\n");
    }
    my $colname="";
    my $colemail="";
    if($cell=~/captain|assistant|sb1a|sb1b|sb2a|sb2b/){
        no warnings;
        for($cell){
            when('captain'){$colname="rc_name";$colemail="rc_email"}
            when('assistant'){$colname="ac_name";$colemail="ac_email"}
            when('sb1a'){$colname="s1_1_name";$colemail="s1_1_email"}
            when('sb1b'){$colname="s1_2_name";$colemail="s1_2_email"}
            when('sb2a'){$colname="s2_1_name";$colemail="s2_1_email"}
            when('sb2b'){$colname="s2_2_name";$colemail="s2_2_email"}
            default{
                die("Unknown error in switch statement\n")
            }
        }
    } else {
        die("Unrecognized 'cell' name\n")
    }

    my $sql = sprintf('UPDATE Slsc.staffing SET %s="-",%s="-" WHERE rcdate="%s"',
                $colname,$colemail,$rcdate);
    printf("SQL: %s\n",$sql);
    $dbh->do($sql);
    print("Done\n");
}

sub updatecell($$){
    my ($rcdate,$cell,$value)=@_;
    my $rv = DbUtils::dbConnect(DbUtils::dbCreds());
    if($rv->{exitCode}){
        die("Cannot connect to the database\n");
    }
    my $dbh = $rv->{dbh};

    if($rcdate=~/\d{4}\-\d{2}\-\d{2}/){
        $rcdate = $&; # Reoves any leading/trailing whitespace
    } else {
        die("Invalid date format, MUST be of the form YYYY-MM-DD, ie 2024-07-14\n");
    }
    my $colname="";
    my $colemail="";
    if($cell=~/captain|assistant|sb1a|sb1b|sb2a|sb2b/){
        no warnings;
        for($cell){
            when('captain'){$colname="rc_name";$colemail="rc_email"}
            when('assistant'){$colname="ac_name";$colemail="ac_email"}
            when('sb1a'){$colname="s1_1_name";$colemail="s1_1_email"}
            when('sb1b'){$colname="s1_2_name";$colemail="s1_2_email"}
            when('sb2a'){$colname="s2_1_name";$colemail="s2_1_email"}
            when('sb2b'){$colname="s2_2_name";$colemail="s2_2_email"}
            default{
                die("Unknown error in switch statement\n")
            }
        }
    } else {
        die("Unrecognized 'cell' name\n")
    }

    #Now check the name/email values
    my ($name,$email) = split(':',$value);
    if($name=~/(\w+)\s+(\w*)/){
        $name=ucfirst($1).' '.ucfirst($2);
    } else {
        die("Invalid name MUST be of the form 'First Last'\n");
    }
    if($email=~/[\w\.]+\@[\w\.]+/){
        $email=lc($&);
    } else {
        die("Invalid email MUST be of the form 'name\@domain'\n");
    }

    my $sql = sprintf('UPDATE Slsc.staffing SET %s="%s",%s="%s" WHERE rcdate="%s"',
                $colname,$name,$colemail,$email,$rcdate);
    printf("SQL: %s\n",$sql);
    $dbh->do($sql);
    print("Done\n");
}

sub tallyMembers(){
    my ($rcdate,$cell)=@_;
    my $rv = DbUtils::dbConnect(DbUtils::dbCreds());
    if($rv->{exitCode}){
        die("Cannot connect to the database\n");
    }
    my $dbh = $rv->{dbh};
    #Initialize a hash whose keys are all the members email addresses
    my $sql = "SELECT email1 FROM Slsc.members where racer=1 and senior=0";
    my $qa  = $dbh->selectall_arrayref($sql);
    my $hMem = {};
    for my $em (@{$qa}){
        $hMem->{$em->[0]} = 0;
    }

    # Now that the counting hash is initialized we can scan the actual bookings and
    # compose a tally of member sign ups.
    $sql = sprintf('SELECT rc_email,ac_email,s1_1_email,s1_2_email,s2_1_email,s2_2_email from Slsc.staffing');
    $qa  = $dbh->selectall_arrayref($sql);
    for my $row (@{$qa}){
        for my $email (@{$row}){
            $email = lc($email);
            $email =~ s/^\s+|\s+$//g;
            print("$email\n");
            if(length($email) > 4){
                $hMem->{$email} += 1;
            }
        }
    }

    # Tally is complete now we can update the 'members' database.
    for my $email (keys(%{$hMem})){
        $email = lc($email);
        $email =~ s/^\s+|\s+$//g;
        $sql = sprintf('UPDATE Slsc.members SET count=%d WHERE email1="%s"',$hMem->{$email},$email);
        print("$sql\n");
        $dbh->do($sql);
    }


    # Now run a query for all those less than 2
    $sql = sprintf('SELECT * FROM Slsc.members WHERE count < 2 AND racer=1 AND senior=0');
    $qa  = $dbh->selectall_arrayref($sql);
    for my $row (@{$qa}){
        printf("%s\n",join(', ',@{$row}))
    }


    print("Done");
}

sub parseCmdLine(){
#------------------
    my $revHistory="
#############################################################################
# Bluewater America
# (copyright Bluewater America 2024)
#
# Rev 0.1 2024-01-18    Initial implementation.
#############################################################################\n";

    my $helpText = sprintf << 'HELP_MSG';
    Editor for SLSC Signup Sheet App
    Copyright Bluewater America 2024
    Usage:
    perl dbEditor.pl --func="season" --start="2025-05-11" --end="2025-10-12"
    OR
    perl dbEditor.pl --func="reset" --date="2024-07-14" --cell="captain"
    OR
    perl dbEditor.pl --func="updatecell" --date="2024-07-14" --cell="assistant" --value="Joanne Fraser:joanne12193@gmail.com"
    OR
    perl dbEditor.pl --func="tally"

    where
        'cell' options are = captain|assistant|sb1A|sb1B|sb2A|sb2B
        'value' is "name:email" when used with 'updatecell'

    PARAMS
    ------
    --existip = (127.0.0.1) the IP address of the eXist DB.

    --help = print this help text.
    --rev  = print revision history

HELP_MSG

    my $cmdLineOpts = GetOptions(
        "func=s"=>\$Function,
        "date=s" => \$RcDate,
        "cell=s" => \$Cell,
        "value=s" => \$Value,
        "start=s" => \$Start,
        "end=s" => \$End,
        "help"=>sub{
            # Print the help message.
            print "$helpText";
            exit 0;
        },
        "rev|ver"=>sub{
            print ("$revHistory");
            exit 0;
        },
    );

    if($cmdLineOpts){
        unless(scalar(@ARGV)){
            print STDERR ("INFO: Command line arguments parsed OK\n");
        }
        else{
            print "The following arguments are illegal (check spelling and args are preceeded by '--'):\n";
            for(@ARGV){
                print "$_\n";
            }
            die "Exiting ...\n";
        }
    }
    else{
        die "Error with command line options\n";
    }
}

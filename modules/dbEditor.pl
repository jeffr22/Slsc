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
        when('reset') {
            resetBooking($RcDate,$Cell);
        }
        when('tally') {
            tallyMembers();
        }
        default {
            die("Unknow or missing function spcification.")
        }
    }
}


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

sub tallyMembers(){
    my ($rcdate,$cell)=@_;
    my $rv = DbUtils::dbConnect(DbUtils::dbCreds());
    if($rv->{exitCode}){
        die("Cannot connect to the database\n");
    }
    my $dbh = $rv->{dbh};
    #Initialize a hash whose keys are all the members email addresses
    my $sql = "SELECT email1 FROM Slsc.members";
    my $qa  = $dbh->selectall_arrayref($sql);
    my $hMem = {};
    for my $em (@{$qa}){
        $hMem->{$em->[0]} = 0;
    }
# $DB::single=1;
    $sql = sprintf('SELECT rc_email,ac_email,s1_1_email,s1_2_email,s2_1_email,s2_2_email from Slsc.staffing');
    $qa  = $dbh->selectall_arrayref($sql);
# $DB::single=1;
    for my $row (@{$qa}){
        for my $email (@{$row}){
            if(length($email) > 4){
                $hMem->{$email} += 1;
            }

        }
    }
$DB::single=1;
    print("OK");
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
    perl dbEditor.pl --func="reset" --date="2024-07-14" --cell="captain"
    OR
    perl dbEditor.pl --func="tally"

    where
        'cell' options are = captain|assistant|sb1A|sb1B|sb2A|sb2B


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
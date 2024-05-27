package DbUtils;
use strict;
#use lib qw(/var/lib/bluestone/perl5 /home/btcat/NewPhone/modules);
use Exporter::Auto;
use DBI;
use Time::Piece;

sub dbConnect($){
    my $hdb = shift;
    my $dbh;
    eval{
        $dbh=DBI->connect("DBI:mysql:$hdb->{dbname}:$hdb->{url}",$hdb->{user},$hdb->{pw});
    };
    if($@){
        return {'exitCode'=>1,'errMsg'=>DBI->errstr};
    }
    return {'exitCode'=>0,'dbh'=>$dbh};
}

sub dbCreds(){
    return {
        'dbname'=>'Slsc',
        'url' => 'localhost',
        'user' => 'btdb',
        'pw' => 'btdb12065'
    };
}

=head2 initSeason()
=pod
Given a 'start/end season' date compute all the Sundays and Wednesdays on thta period
and initialize the table such that:
These dates are filled in
Every staff assignment has a '-'

Args:
start - a date of the form YYYY-MM-DD - MUST be a SUNDAY
end - ditto
dbh - a handle to the database

Returns:
Nothing - raises an error if necessary.
=cut

sub initSeason($$$){
    my $format = "%Y-%m-%d";
    my $curTime = Time::Piece->strptime(shift, $format);
    my $endTime = Time::Piece->strptime(shift, $format);
    my $dbh = shift;

    while($curTime < $endTime){
        my $curTimeStr = $curTime->ymd();
        print("$curTimeStr\n");
        my $sql = "INSERT INTO Slsc.staffing VALUES(\"$curTimeStr\",'-','-','-','-','-','-','-','-','-','-','-','-')";
        my $sth = $dbh->prepare($sql);
        $sth->execute();
        if($sth->err()){
            die $sth->errstr();
        }
        my $dow = $curTime->wdayname;
        if($dow eq 'Sun'){
            $curTime = $curTime + (3 * 3600 * 24);
        }else{
            $curTime = $curTime + (4 * 3600 * 24);
        }
    }
}

return 1;

=pod
    # Test
    my $start = "2024-05-05";
    my $end = "2024-10-20";
    my $dbInfo = {
        'dbname'=>'Slsc',
        'url' => 'localhost',
        'user' => 'btdb',
        'pw' => 'btdb12065'
    };
    my $dbh = dbConnect($dbInfo);
    initSeason($start,$end,$dbh);
    print('Done');
=cut
use DBI;

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


sub dbCreateMembers(){
    my $sql =<<'ENDSQL';
CREATE TABLE Slsc.members (
    first VARCHAR(40) DEFAULT 'NOFIRST',
    last VARCHAR(40) DEFAULT 'NOLAST',
    email1 VARCHAR(40) NOT NULL,
    email2 VARCHAR(40) DEFAULT '',
    count INT DEFAULT 0,
    PRIMARY KEY (email1)
)  ENGINE=MYISAM DEFAULT CHARSET=LATIN1;
ENDSQL
    my $dbInfo = dbCreds();
    my $rv = dbConnect($dbInfo);
    $rv->{dbh}->do($sql);
}


sub dbCreateStaffing(){
    my $sql =<<'ENDSQL';
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
ENDSQL
    my $dbInfo = dbCreds();
    my $rv = dbConnect($dbInfo);
    $rv->{dbh}->do($sql);
}

=pod
A temporary utility to populate the members table with names and emails
=cut
sub activemembers(){
    my $dbInfo = dbCreds();
    my $rv = dbConnect($dbInfo);
    my $dbh = $rv->{dbh};

    my $path = 'activemembers.txt';
    open(my $fh,'<',$path) or die "Cannot open $path\n";
    while($line = <$fh>) {
        if($line=~/[\w\.]+@[\w\.]+/){
            my $email = lc($&);
            eval{
                my $sql = "INSERT INTO Slsc.members (email1) VALUES (\"$email\")";
                print("$sql\n");
                $dbh->do($sql);
            };
            if($@){
                print("Problem with $email\n");
            }
        }

    }
}

sub parse2023(){
    my $dbInfo = dbCreds();
    my $rv = dbConnect($dbInfo);
    my $dbh = $rv->{dbh};

    my $path = 'signup2023.txt';
    open(my $fh,'<',$path) or die "Cannot open $path\n";
    my $state=0;
    my @names,@emails;
    while($line = <$fh>) {
        if($state==0){
            @names = split(',',$line);
            $state=2;
        }
        elsif($state==2){
            @emails = split(',',$line);
            $state=3;
        }
        elsif($state==3){
            #Perform DB updates
            for(my $k=3; $k<9; $k++){
                my($first,$last)=split('\s+',$names[$k]);
                if($last=~/^\s*$/){
                    next;
                }
                my $email = lc($emails[$k]);
                my $sql="UPDATE Slsc.members SET first=\"$first\",last=\"$last\" WHERE email1=\"$email\"";
                print("$sql\n");
                $dbh->do($sql);
            }
            $state=0;
        }
        else{
            $state=0;
            print("ERROR- reseting SM\n");
        }
    }
}

# Just call whatever function you want to exec here.
# Not pretty, but this only likely used once to initialize the DB.
# activemembers()
# parse2023();
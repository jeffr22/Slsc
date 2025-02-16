package Slsc::Controller::Root;
use strict;
use lib qw(/home/btcat/Slsc/modules);

use Moose;
use namespace::autoclean;

use DBI;
use JSON;
use DbUtils;

use Data::Dumper;


BEGIN { extends 'Catalyst::Controller' }

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config(namespace => '');

=encoding utf-8

=head1 NAME

Slsc::Controller::Root - Root Controller for Slsc

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=head2 index

The root page (/)

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;

    $c->response->body( 'Page not found' );
    $c->response->status(404);
}

sub signupsheet :Local {
    my ( $self, $c ) = @_;
    $c->stash->{template} = 'wait.tt2';
}

sub zignupsheet :Local {
    my ( $self, $c ) = @_;
    #create a handle to MySQL
    my $dbInfo = {
        'dbname'=>'Slsc',
        'url' => $c->config->{dbURL},
        'user' => $c->config->{dbUser},
        'pw' => $c->config->{dbPW}
    };

    my $rv = DbUtils::dbConnect($dbInfo);
    if($rv->{exitCode} == 1){
        return;
    }
    my $dbh;
    $dbh=$rv->{dbh};

    #Envoke the HTML template that will display the current staffing chart.
    my $sql = 'SELECT * FROM Slsc.staffing ORDER BY rcdate ASC';
    $rv = $dbh->selectall_arrayref($sql);

    # Hello World
    # $c->response->body(Dumper($rv));
    $c->stash->{table_json} = JSON::encode_json($rv);
    $c->stash->{template} = 'staffing.tt2';
}

sub update_rc_sheet :Local {
    my ( $self, $c ) = @_;
    my $q = $c->request->parameters->{query};
    $c->log->debug("Received => $q\n");


    my $h = JSON::decode_json($q);
    my $sql = sprintf('UPDATE Slsc.staffing SET %s="%s",%s="%s" WHERE rcdate="%s"',
                $h->{namecol},$h->{nameval},$h->{emailcol},$h->{emailval},$h->{ymd} );
    $c->log->debug("SQL => $sql\n");

    #create a handle to MySQL
    my $dbInfo = {
        'dbname'=>'Slsc',
        'url' => $c->config->{dbURL},
        'user' => $c->config->{dbUser},
        'pw' => $c->config->{dbPW}
    };
    my $rv = DbUtils::dbConnect($dbInfo);
    if($rv->{exitCode} == 1){
        return;
    }
    my $dbh;
    $dbh=$rv->{dbh};

    #Check the email is valid
    my $esql = sprintf('SELECT * FROM Slsc.members WHERE email1="%s"',$h->{'emailval'});
    $rv = $dbh->selectall_arrayref($esql);
    my $respBody="OK";
$DB::single=1;
    if(scalar(@{$rv}) > 0){
        $dbh->do($sql);
    }
    else{
        $respBody="BAD EMAIL";
    }

    $c->response->body($respBody);
}


=head2 default

Standard 404 error page

=cut

sub default :Path {
    my ( $self, $c ) = @_;
    $c->response->body( 'Page not found' );
    $c->response->status(404);
}

=head2 end

Attempt to render a view, if needed.

=cut

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Catalyst developer

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;

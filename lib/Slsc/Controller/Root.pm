package Slsc::Controller::Root;
use strict;
use lib qw(/home/btcat/Slsc/modules);

use Moose;
use namespace::autoclean;

use DBI;
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

    #create a handle to MySQL
    my $dbInfo = {
        'dbname'=>'Slsc',
        'url' => $c->config->{dbURL},
        'user' => $c->config->{dbUser},
        'pw' => $c->config->{dbPW}
    };
# $DB::single=1;
    my $rv = DbUtils::dbConnect($dbInfo);
    if($rv->{exitCode} == 1){
        return;
    }
    my $dbh;
    $c->stash->{dbh}=$dbh=$rv->{dbh};

    #Envoke the HTML template that will display the current staffing chart.
    my $sql = 'SELECT * FROM Slsc.staffing';
    $rv = $dbh->selectall_arrayref($sql);

    # Hello World
    $c->response->body(Dumper($rv));
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

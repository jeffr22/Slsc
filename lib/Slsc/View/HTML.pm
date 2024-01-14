package Slsc::View::HTML;
use Moose;
use namespace::autoclean;

extends 'Catalyst::View::TT';

__PACKAGE__->config(
    INCLUDE_PATH => [
        Slsc->path_to( 'root', 'src' ),
        Slsc->path_to( 'root', 'lib' )
    ],
    PRE_PROCESS  => 'config/main',
    WRAPPER      => 'site/wrapper',
    ERROR        => 'error.tt2',
    TIMER        => 0,
    TEMPLATE_EXTENSION => '.tt2',
    render_die => 1,
);

=head1 NAME

Slsc::View::HTML - TT View for Slsc

=head1 DESCRIPTION

TT View for Slsc.

=head1 SEE ALSO

L<Slsc>

=head1 AUTHOR

A clever guy

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;

use strict;
use warnings;
use Test::More;


use Catalyst::Test 'Slsc';
use Slsc::Controller::Root;

ok( request('/root')->is_success, 'Request should succeed' );
done_testing();

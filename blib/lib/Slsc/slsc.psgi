use strict;
use warnings;

use Slsc;

my $app = Slsc->apply_default_middlewares(Slsc->psgi_app);
$app;


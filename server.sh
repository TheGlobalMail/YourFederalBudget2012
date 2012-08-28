#!/bin/sh

PHP=`which php`

if [ $1 == "dev" ]; then
    $PHP -S 0.0.0.0:5000 -t web/ web/index_dev.php
elif [ $1 == "test" ]; then
    $PHP -S 0.0.0.0:5001 -t ./ tests/index.php &
    pid=$!
    phantomjs tests/lib/phantom-jasmine/lib/run_jasmine_test.coffee http://localhost:5001/
    kill $pid
fi
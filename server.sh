#!/bin/sh

PHP=`which php`

function devserver {
    $PHP -S 0.0.0.0:5000 -t web/ web/index_dev.php
}

function testserver {
    $PHP -S 0.0.0.0:5001 -t ./ tests/index.php
    pid=$!
}

function runtests {
    testserver &
    phantomjs tests/lib/phantom-jasmine/lib/run_jasmine_test.coffee http://localhost:5001/
    kill $pid
}

$1
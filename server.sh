#!/bin/bash

PHP=`which php`
pid=0

function devserver {
    $PHP -S 0.0.0.0:5000 -t web/ web/index_dev.php
}

function testserver {
    $PHP -S 0.0.0.0:5050 -t ./ tests/index.php
}

function runtests {
    $PHP -S 0.0.0.0:5001 -t ./ tests/index.php &
    pid=$!
    sleep 0.2
    phantomjs tests/lib/phantom-jasmine/lib/run_jasmine_test.coffee http://localhost:5001/
    success=$?
    kill $pid
    return $success
}

$1

<?php

ini_set('display_errors', 1);
error_reporting(-1);

require_once __DIR__.'/../vendor/autoload.php';

$app = require 'bootstrap.php';
$app['debug'] = true;

$app->run();
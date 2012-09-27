<?php

ini_set('display_errors', 1);
error_reporting(-1);

require_once __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../src/bootstrap.php';
$app['debug'] = true;
$config = $app['config'];
$config['appUrl'] = 'http://localhost:5000/';
$app['config'] = $config;

$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

$app->run();
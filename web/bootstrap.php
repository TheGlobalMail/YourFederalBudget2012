<?php

$app = new Silex\Application();


## SETUP ##
$app['debug'] = false;


## CONTROLLERS ##
$app->get('/', function() use($app) {
    return 'Index';
});

$app->get('/test', function() use($app) {
    return 'Test';
});


return $app;
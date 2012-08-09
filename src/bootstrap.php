<?php

$app = new Silex\Application();


## SETUP ##
$app['debug'] = false;

$config = [
    'frontend' => [
        'scripts' => [
            'vendor/jquery/jquery-1.7.2',
            'vendor/underscore/underscore',
            'vendor/backbone/backbone',
            'js/budget'
        ],
        'less' => 'less/budget'
    ],
    'gitHash' => `git rev-parse HEAD`
];

$config['buildId'] = substr($config['gitHash'], 0, 16);

$app['config'] = $config;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates',
));

## CONTROLLERS ##
$app->get('/', function() use ($app) {
    return $app['twig']->render('index.twig', array(
        'title' => 'Yolo',
        'gitHash' => $app['config']['gitHash']
    ));
});


return $app;
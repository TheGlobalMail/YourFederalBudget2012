<?php

$app = new Silex\Application();


## SETUP ##
$app['debug'] = false;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates',
));

## CONTROLLERS ##
$app->get('/', function() use($app) {
    return $app['twig']->render('index.twig', array(
        'title' => 'Yolo',
    ));
});


return $app;
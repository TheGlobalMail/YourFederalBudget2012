<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ParameterBag;

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

## EVENTS ##

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

## CONTROLLERS ##
$app->get('/', function() use ($app) {
    return $app['twig']->render('index.twig', array(
        'title' => 'Yolo',
        'gitHash' => $app['config']['gitHash']
    ));
});

$app->post('/git-post-receive/', function(Request $request) use ($app) {
    $repo = $request->request->get('repository');

});


return $app;
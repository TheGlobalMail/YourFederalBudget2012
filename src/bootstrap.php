<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
    'gitHash' => `git rev-parse HEAD`,
    'repoUrl' => 'https://github.com/TheGlobalMail/YourFederalBudget2012'
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

$app->post('/git-post-receive', function(Request $request) use ($app) {
    $data = json_decode($request->getContent(), true);
    $request->request->replace(is_array($data) ? $data : array());
    $repo = $request->request->get('repository');

    if ($repo['url'] == $app['config']['repoUrl']) {
        $dir = realpath(__DIR__ . '/../');
        $exec = shell_exec("cd $dir && git pull && ./build.php");
        $response = $exec == null ? 500 : 200;
        return new Response($exec, $response);
    }

    $app->abort(400, "Invalid request.");
});


return $app;
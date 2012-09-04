<?php

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\ParameterBag,
    DGM\Models\Budget;

$app = new Silex\Application();


## SETUP ##
$app['debug'] = false;

$config = [
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => json_decode(file_get_contents(__DIR__ . '/../resources/categories.json'), true),
];

$fileConfig = json_decode(file_get_contents(__DIR__ . '/../resources/config.json'), true);
$config = array_merge($config, $fileConfig);

$app['config'] = $config;
DGM\Models\Budget::$categoryData = $config['categories'];

$app['db'] = $app->share(function() {
    return new \DGM\Database\MongoDB();
});

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../templates',
));

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

$app->post('/git-post-receive', function(Request $request) use ($app) {
    $data = json_decode($request->getContent(), true);
    $request->request->replace(is_array($data) ? $data : array());
    $repo = $request->request->get('repository');

    $dir = realpath(__DIR__ . '/../');
    // @TODO refactor epic one-liner?
    $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer update && ./build.php 2>&1 >> logs/build_log.txt");
    $response = $exec == null ? 500 : 200;
    return new Response($exec, $response);
});

$app->post('/email-page', function(Request $request) use ($app) {
    $epf = new \DGM\Form\EmailPageForm(new SendGrid('theglobamail', 've*P6ZnB0pX'));
    $epf->setData($request->request->all());
    $epf->validate();

    if ($epf->isValid()) {
        $epf->send();
        return $app->json(['message' => 'Email(s) sent']);
    }

    return $app->json($epf->getErrors(), 400);
});

return $app;
<?php

use Silex\Application,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\ParameterBag,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException,
    Symfony\Component\HttpKernel\HttpKernelInterface,
    DGM\Model\Budget;

$app = new Silex\Application();


## SETUP ##
$app['debug'] = false;

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => json_decode(file_get_contents(__DIR__ . '/../resources/categories.json'), true),
];

$fileConfig = json_decode(file_get_contents(__DIR__ . '/../resources/config.json'), true);
$config = array_merge($config, $fileConfig);

$app['config'] = $config;
Budget::$categoryData = $config['categories'];

$app['db'] = $app->share(function() {
    return new \DGM\Database\MongoDB();
});

$app['budgets'] = $app->share(function(Application $app) {
    return new \DGM\Collection\Budgets($app['db'], $app['config']['categories']);
});

$app['averageBudget'] = $app->share(function(Application $app) {
    return (new \DGM\Service\AverageBudget($app['budgets'], $app['memcache']))->getAverageBudget();
});

$app['sendGrid'] = $app->share(function() {
    return new SendGrid('theglobamail', 've*P6ZnB0pX');
});

$app->register(new SilexMemcache\MemcacheExtension(), [
    'memcache.library' =>'memcached',
    'servers' => [
        ['localhost', '11211']
    ]
]);

$app->register(new Silex\Provider\TwigServiceProvider(), [
    'twig.path' => __DIR__.'/../templates',
]);

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

    # Only update this deployment if the commit was on the current branch
    $branch = trim($app['config']['branch']);
    if ($data['ref'] === "refs/heads/$branch"){
      $dir = realpath(__DIR__ . '/../');
      // @TODO refactor epic one-liner?
      $exec = shell_exec("cd $dir && git pull && git submodule update --init && composer install && ./build.php 2>&1 >> logs/build_log.txt");
      $response = $exec == null ? 500 : 200;
    }else{
      $exec = "Commit was not on $branch";
      $response = 200;
    }
    return new Response($exec, $response);
});

$app->post('/email-page', function(Request $request) use ($app) {
    $epf = new \DGM\Service\EmailPage($app['sendGrid']);
    $epf->setData($request->request->all());
    $epf->validate();

    if ($epf->isValid()) {
        $epf->send();
        return $app->json(['message' => 'Email(s) sent']);
    }

    return $app->json($epf->getErrors(), 400);
});

$app->mount("/api/budget", new DGM\Provider\BudgetControllerProvider());

$app->error(function(NotFoundHttpException $e) use ($app) {
    if (!$app['request']->isXmlHttpRequest()) {
        $response = $app->handle(Request::create('/', 'GET'));
        $response->setStatusCode(200);
        $response->headers->set('X-Status-Code', 200);
        return $response;
    }
});

return $app;

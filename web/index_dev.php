<?php

use DGM\Util,
    DGM\Model\Budget;

ini_set('display_errors', 1);
error_reporting(-1);

$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

require_once __DIR__.'/../vendor/autoload.php';
$app = new Silex\Application();
$app['debug'] = true;

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => Util::loadJSONFile('./resources/categories.json'),
    'appUrl' => 'http://localhost:5000/',
    'dbname' => 'budget2012'
];

$fileConfig = Util::loadJSONFile('./resources/config.json');
$config = array_merge($fileConfig, $config);
Budget::$categoryData = $config['categories'];

$app->register(new \DGM\Bootstrap($config));

$app->mount("/api/budget", new DGM\Provider\BudgetControllerProvider());
$app->mount("/", new DGM\Provider\BaseControllerProvider());

$app->run();
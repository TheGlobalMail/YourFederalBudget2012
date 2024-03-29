<?php

use DGM\Util,
    DGM\Model\Budget;

ini_set('display_errors', 1);
error_reporting(-1);

require_once __DIR__.'/../vendor/autoload.php';
$app = new Silex\Application();
$app['debug'] = 2;

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => Util::loadJSONFile(__DIR__ . '/../resources/categories.json'),
    'dbname' => 'budget2012',
    'db' =>  "mongodb://localhost:27017",
    'dbOptions' =>  array()
];

$fileConfig = Util::loadJSONFile(__DIR__ . '/../resources/config.json');
$config = array_merge($fileConfig, $config);
Budget::$categoryData = $config['categories'];

$app->register(new \DGM\Bootstrap($config));

$app->mount("/api/budget", new DGM\Provider\BudgetControllerProvider());
$app->mount("/", new DGM\Provider\BaseControllerProvider());

$app->run();
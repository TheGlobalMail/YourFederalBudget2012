<?php

ini_set('display_errors', 0);

use DGM\Util,
    DGM\Model\Budget;

require_once __DIR__.'/../vendor/autoload.php';
$app = new Silex\Application();

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => Util::loadJSONFile(__DIR__ . '/../resources/categories.json'),
    'db' => 'mongodb://db-production1',
    'dbname' => 'budget2012',
    'assetHost' => 'http://9d13444fc29e94942058-e7acde355f751313b3672e46489208df.r75.cf1.rackcdn.com'
];

$fileConfig = Util::loadJSONFile(__DIR__ . '/../resources/config.json');
$config = array_merge($fileConfig, $config);
Budget::$categoryData = $config['categories'];

$app->register(new \DGM\Bootstrap($config));

$app->mount("/api/budget", new DGM\Provider\BudgetControllerProvider());
$app->mount("/", new \DGM\Provider\BaseControllerProvider());

$app['http_cache']->run();

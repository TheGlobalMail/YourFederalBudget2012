#!/usr/bin/env php
<?php

require 'vendor/autoload.php';

use DGM\Build\Util,
    DGM\Build\Targets;

Targets::$basePath = __DIR__;

$app = new Silex\Application();

$config = [
    'branch' => substr(`git symbolic-ref -q HEAD`, 11),
    'gitHash' => `git rev-parse HEAD`,
    'buildId' => substr(`git rev-parse HEAD`, 0, 16),
    'categories' => \DGM\Util::loadJSONFile(__DIR__ . '/resources/categories.json'),
    'dbname' => 'budget2012'
];

$fileConfig = \DGM\Util::loadJSONFile(__DIR__ . '/resources/config.json');
$config = array_merge($fileConfig, $config);

$app->register(new \DGM\Bootstrap($config));
$app->boot();

function executeTargets($targets, $app) {
    foreach(explode(" ", $targets) as $target) {
        executeTarget($target, $app);
    }
}

function executeTarget($target, $app) {
    switch ($target) {
        case 'javascript':
            Targets::javascript($app);
        break;

        case 'clean':
            Targets::clean();
        break;

        case 'less':
            Targets::less($app);
        break;

        case 'pull':
            Targets::pull();
        break;

        case 'appcache':
            Targets::appcache($app);
        break;

        case 'default':
        default:
            executeTargets('clean javascript less', $app);
        break;
    }
}

if (count($argv) == 1) {
    executeTarget("default", $app);
} else if (count($argv) > 1) {
    executeTargets(implode(" ", array_slice($argv, 1)), $app);
}
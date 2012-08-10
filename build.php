#!/usr/bin/env php
<?php

require 'vendor/autoload.php';

use DGM\Build\Util,
    DGM\Build\Targets;

Targets::$basePath = __DIR__;
$app = require 'src/bootstrap.php';

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
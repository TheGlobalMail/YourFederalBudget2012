<?php

namespace DGM\Build;

use DGM\Util;

class Targets {

    public static $basePath;

    public static function javascript($app)
    {
        $base       = self::$basePath . "/web";
        $gitHash    = $app['config']['buildId'];
        $outFile    = "$base/build/budget-$gitHash.js";
        $minOutFile = "$base/build/budget-$gitHash.min.js";

        $files = [];

        // Add .js extension to files
        foreach ($app['config']['frontend']['scripts'] as $jsFile) {
            $files[] = "$jsFile.js";
        }

        Util::concatFiles($files, $outFile, $base);
        Util::uglifyJs($outFile, $minOutFile);
    }

    public static function clean()
    {
        Util::rmdir(self::$basePath . "/web/build");
        Util::mkdir(self::$basePath . "/web/build");
    }

    public static function less($app)
    {
        $gitHash = substr(trim($app['config']['gitHash']), 0, 16);
        $base = self::$basePath . "/web";
        $lessFile = "$base/{$app['config']['frontend']['less']}.less";
        $cssFile = "$base/build/budget-{$gitHash}.css";
        $minCssFile = "$base/build/budget-{$gitHash}.min.css";

        Util::lessCompile($lessFile, $cssFile);
        Util::lessCompile($lessFile, $minCssFile, true);
    }

}
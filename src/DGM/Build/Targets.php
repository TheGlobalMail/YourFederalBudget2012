<?php

namespace DGM\Build;

class Targets {

    public static $basePath;

    public static function javascript($app)
    {
        $base       = self::$basePath . "/web";
        $gitHash    = $app['config']['buildId'];
        $outFile    = "$base/build/budget-$gitHash.js";
        $minOutFile = "$base/build/budget-$gitHash.min.js";

        Util::concatFiles($app['config']['frontend']['scripts'], $outFile, $base);
        Util::uglifyJs($outFile, $minOutFile);
    }

    public static function clean()
    {
        $buildDir = self::$basePath . "/web/build";

        if (is_dir($buildDir)) {
          Util::rmdir($buildDir);
        }
        Util::mkdir($buildDir);
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

    public static function pull()
    {
        Util::write(shell_exec('cd ' . self::$basePath . ' && git pull'));
    }

}

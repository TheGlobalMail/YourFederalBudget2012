<?php

namespace DGM\Build;

class Util {

    public static function concatFiles(array $files, $outFile, $base = false)
    {
        self::writeln("Concatenating " . count($files) . " into " . basename($outFile));
        $contents = "";

        foreach ($files as $file) {
            $file = ($base) ? $base . "/" . $file : $file;

            foreach (glob($file) as $f) {
                self::writeln("- Adding File " . basename($f));
                $contents .= file_get_contents($f);
            }
        }

        file_put_contents($outFile, $contents);
        self::writeln("Done!");
        self::writeln();
    }

    public static function uglifyJs($jsFile, $outFile)
    {
        self::writeln("Minifying " . basename($jsFile));
        system("uglifyjs -o $outFile $jsFile");
        self::writeln("Created " . basename($outFile));

        $origSize = round(filesize($jsFile) / 1024, 2);
        $newSize  = round(filesize($outFile) / 1024, 2);
        $saved    = $origSize - $newSize;

        self::writeln(" - Original Filesize: {$origSize}Kb");
        self::writeln(" - Minified Filesize: {$newSize}Kb");
        self::writeln(" - Saved {$saved}Kb");
        self::writeln();
    }

    public static function lessCompile($lessFile, $cssFile, $minify = false)
    {
        self::writeln("Compiling " . basename($lessFile));

        if ($minify) {
            exec("lessc --yui-compress $lessFile > $cssFile");
        } else {
            exec("lessc $lessFile > $cssFile");
        }

        self::writeln("Created " . basename($cssFile));
        self::writeln();
    }

    public static function rmdir($dirPath) {
        if (!is_dir($dirPath)) {
            throw new \InvalidArgumentException('$dirPath must be a directory');
        }

        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }

        $files = glob($dirPath . '*', GLOB_MARK);

        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }

        rmdir($dirPath);
    }

    public static function mkdir($dir)
    {
        if (mkdir($dir, 0755, true)) {
            self::writeln("Created $dir");
        } else {
            self::writeln("Couldn't create $dir");
        }
    }

    public static function write($message = "")
    {
        fwrite(STDOUT, $message);
    }

    public static function writeln($message = "")
    {
        self::write($message . "\n");
    }

    public static function generateAppCache($destination, array $caches = array(), array $fallbacks = array(), array $networks = array())
    {
        $output = [ "CACHE MANIFEST" ];

        if ($caches) {
            $output[] = "CACHE:";
            foreach ($caches as $cache) {
                $output[] = $cache;
            }
        }

        if ($fallbacks) {
            $output[] = "FALLBACK:";
            foreach ($fallbacks as $fallback) {
                $output[] = $fallback;
            }
        }

        if ($networks) {
            $output[] = "NETWORK:";
            foreach ($networks as $network) {
                $output[] = $network;
            }
        }

        $output = implode("\n", $output);
        self::writeln("Generating appcache file $destination");
        file_put_contents($destination, $output);
    }

}
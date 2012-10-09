<?php

namespace DGM;

class Util
{

    public static function loadJSONFile($file)
    {
        $contents = file_get_contents($file);
        return json_decode($contents, true);
    }

}
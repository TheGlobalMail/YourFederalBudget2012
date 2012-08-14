<?php

namespace DGM\Database;

class MongoDB {

    public $mongo;

    public $mongoDb;

    public function __construct($connectionString, $dbname)
    {
        $this->mongo = new \Mongo($connectionString);
        $this->mongoDb = $this->mongo->__get($dbname);
    }

}
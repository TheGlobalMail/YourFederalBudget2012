<?php

namespace DGM\Database;

class MongoDB {

    public $mongo;

    public $mongoDb;

    public function __construct($connectionString = "mongodb://localhost:27017", $dbname = "budget2012")
    {
        $this->mongo = new \Mongo($connectionString);
        $this->mongoDb = $this->mongo->selectDb($dbname);
    }

    public function getCollection($name)
    {
        return $this->mongoDb->selectCollection($name);
    }

}
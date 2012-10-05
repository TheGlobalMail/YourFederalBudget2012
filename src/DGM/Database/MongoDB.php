<?php

namespace DGM\Database;

class MongoDB {

    public $mongo;

    public $mongoDb;

    public function __construct($dbname, $connectionString, $options)
    {
        $this->mongo = new \Mongo($connectionString, $options);
        $this->mongoDb = $this->mongo->selectDb($dbname);
    }

    public function getCollection($name)
    {
        return $this->mongoDb->selectCollection($name);
    }

    public function changeDb($name)
    {
        $this->mongo->selectDb($name);
        return $this;
    }

}

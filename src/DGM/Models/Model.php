<?php

namespace DGM\Models;

use DGM\Database\MongoDB;

abstract class Model
{

    protected $db;
    protected $createdAt;

    public function __construct(MongoDB $db)
    {
        $this->db = $db;
        $this->init();
    }

    public function save()
    {
        $coll = $this->db->getCollection($this->collection);
        $data = $this->jsonSerialize();

        $coll->insert($data);
        $this->id = $data['_id'];
    }

    public function init() {}

}
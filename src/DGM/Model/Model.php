<?php

namespace DGM\Model;

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

    public function getCreatedAt()
    {
        if (!$this->createdAt) {
            $this->createdAt = new \MongoDate();
        }

        $ts = $this->createdAt->sec;
        $date = new \DateTime();
        $date->setTimestamp($ts);
        return $date;
    }

    public function setCreatedAt(\MongoDate $date)
    {
        $this->createdAt = $date;
    }

    public function save()
    {
        $coll = $this->db->getCollection($this->collection);
        $data = $this->jsonSerialize();
        $data['createdAt'] = $this->createdAt = new \MongoDate();

        $data = $this->preSave($data);

        $coll->insert($data);
        $this->id = $data['_id'];

        $this->postSave($data);

        return $this;
    }

    public function init() {}

    public function preSave(array $data)
    {
        return $data;
    }

    public function postSave(array $data)
    {
        return $data;
    }

}
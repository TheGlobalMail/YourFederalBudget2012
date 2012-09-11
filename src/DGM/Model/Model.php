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
        $ts = $this->createdAt->sec * -1;
        return new \DateTime("@$ts");
    }

    public function setCreatedAt(\DateTime $date)
    {
        $this->createdAt = new \MongoDate($date->getTimestamp());
    }

    public function save()
    {
        $this->createdAt = new \MongoDate();
        $coll = $this->db->getCollection($this->collection);
        $data = $this->jsonSerialize();

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
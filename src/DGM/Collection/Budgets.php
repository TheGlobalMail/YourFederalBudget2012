<?php

namespace DGM\Collection;

use DGM\Model\Budget,
    DGM\Database\MongoDb;

class Budgets
{

    protected $db;
    protected $collection;

    public function __construct(MongoDb $db)
    {
        $this->db = $db;
        $this->collection = $db->getCollection((new Budget($db))->collection);
    }

    public function isClientIdUnique($uniqueId)
    {
        $cursor = $this->collection->find([ 'clientId' => $uniqueId ]);
        return $cursor->count() == 0;
    }

}
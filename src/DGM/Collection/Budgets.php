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

    public function findById($id)
    {
        $budgetData = $this->collection->findOne([ "_id" => new \MongoId($id) ]);

        if (!$budgetData) {
            return false;
        }

        $budget = new Budget($this->db);
        $budget->set($budgetData);

        $id = new \ReflectionProperty($budget, 'id');
        $id->setAccessible(true);
        $id->setValue($budget, $budgetData['_id']);

        return $budget;
    }

}
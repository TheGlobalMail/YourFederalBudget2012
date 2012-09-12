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
        $this->collection->ensureIndex("createdAt");
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

        return $this->_makeBudget($budgetData);
    }

    protected function _makeBudget(array $data)
    {
        $budget = new Budget($this->db);
        $budget->set($data);

        $id = new \ReflectionProperty($budget, 'id');
        $id->setAccessible(true);
        $id->setValue($budget, $data['_id']);

        return $budget;
    }

    public function fetch($start, $count)
    {
        $cursor = $this->collection->find()
            ->skip($start)
            ->limit($count)
            ->sort(array('createdAt' => 1));

        // return an array of Budget
        return array_map([$this, '_makeBudget'], iterator_to_array($cursor, false));
    }

}
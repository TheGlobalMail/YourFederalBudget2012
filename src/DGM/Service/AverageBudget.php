<?php

namespace DGM\Service;

use DGM\Collection\Budgets;

class AverageBudget
{

    private $budgets;
    private $memcached;

    const EXPIRES = 600; // 10 minutes
    const CACHE_KEY = 'averageBudget';

    public function __construct(Budgets $budgets)
    {
        $this->budgets = $budgets;
        //$this->memcached = $memcached;
    }

    public function getAverageBudget()
    {
        return $this->budgets->getAverageBudget();
        $averageBudget = $this->memcached->get(self::CACHE_KEY);

        if ($this->memcached->getResultCode() == \Memcached::RES_NOTFOUND) {
            $averageBudget = $this->budgets->getAverageBudget();
            $this->memcached->set(self::CACHE_KEY, $averageBudget, self::EXPIRES);
        }

        return $averageBudget;
    }

}
